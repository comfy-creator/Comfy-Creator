// Note: SOURCE = output, TARGET = input. Yes; this is confusing

import {
  DragEvent,
  type MouseEvent as ReactMouseEvent,
  TouchEvent,
  useCallback,
  useEffect
} from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  ConnectionLineType,
  Controls,
  getNodesBounds,
  getOutgoers,
  getViewportForBounds,
  Node,
  NodeResizer,
  NodeToolbar,
  OnConnectStart,
  OnConnectStartParams,
  Panel,
  useReactFlow
} from 'reactflow';
import { useContextMenu } from '../contexts/contextmenu';
import ControlPanel from './panels/ControlPanel';
import { RFState, useFlowStore } from '../store/flow';
import { NodeData } from '../lib/types';
import { RerouteNode } from '../lib/nodedefs';
import ReactHotkeys from 'react-hot-keys';
import { dragHandler, dropHandler } from '../lib/handlers/dragDrop';
import { ConnectionLine } from './ConnectionLIne';
import { API_URL, FLOW_MAX_ZOOM, FLOW_MIN_ZOOM, HANDLE_TYPES } from '../lib/config/constants';
import { useSettings } from '../contexts/settings';
import { useSettingsStore } from '../store/settings';
import { defaultThemeConfig } from '../lib/config/themes';
import { colorSchemeSettings } from '../lib/settings';
import { useApiContext } from '../contexts/api';
import ImageFeedDrawer from './Drawer/ImageFeedDrawer';
import { useGraph } from '../lib/hooks/useGraph';
import { getHandleName, isWidgetHandleId } from '../lib/utils/node';

const selector = (state: RFState) => ({
  panOnDrag: state.panOnDrag,
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  nodeComponents: state.nodeComponents,
  loadNodeDefsFromApi: state.loadNodeDefsFromApi,
  nodeDefs: state.nodeDefs,
  addNode: state.addNode,
  updateInputData: state.updateInputData,
  hotKeysShortcut: state.hotKeysShortcut,
  hotKeysHandlers: state.hotKeysHandlers,
  addHotKeysShortcut: state.addHotKeysShortcut,
  addHotKeysHandlers: state.addHotKeysHandlers,
  setCurrentConnectionLineType: state.setCurrentConnectionLineType,
  edgeComponents: state.edgeComponents,
  registerEdgeType: state.registerEdgeType,
  instance: state.instance,
  setInstance: state.setInstance,
  addRawNode: state.addRawNode,
  execution: state.execution
});

export function MainFlow() {
  const {
    panOnDrag,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setNodes,
    setEdges,
    nodeComponents,
    loadNodeDefsFromApi,
    addNode,
    hotKeysShortcut,
    hotKeysHandlers,
    setCurrentConnectionLineType,
    edgeComponents,
    registerEdgeType,
    instance,
    setInstance,
    execution,
    updateInputData
  } = useFlowStore(selector);

  const { getNodes, getEdges, getViewport, fitView } = useReactFlow<NodeData, string>();
  const { onContextMenu, onNodeContextMenu, onPaneClick, menuRef } = useContextMenu();
  const { loadCurrentSettings, addSetting } = useSettings();
  const { getNodeDefs, makeServerURL } = useApiContext();
  const { saveSerializedGraph, loadSerializedGraph } = useGraph();
  const viewport = getViewport();

  useEffect(() => {
    loadNodeDefsFromApi(getNodeDefs);
    loadSerializedGraph();
  }, []);

  useEffect(() => {
    if (!execution.output) return;

    const node = nodes.find((node) => node.id === execution.currentNodeId);
    if (node?.id !== execution.currentNodeId) return;
    const { images } = execution.output;

    const fileView = API_URL.VIEW_FILE({ ...images?.[0] });
    updateInputData({
      name: 'image',
      nodeId: node.id,
      data: { value: makeServerURL(fileView) }
    });
  }, [execution]);

  useEffect(() => {
    const { addThemes } = useSettingsStore.getState();

    // Load current settings
    loadCurrentSettings();

    // Register default color schemes
    addThemes(defaultThemeConfig);
    addSetting(colorSchemeSettings);

    // Register Node definitions and edge types
    registerEdgeType(HANDLE_TYPES);
  }, []);

  // save to ComfyLocalStorage as nodes, edges and viewport changes
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      const flow = {
        viewport,
        nodes: nodes.filter(Boolean),
        edges: edges.filter(Boolean)
      };

      saveSerializedGraph(flow);
      console.log('Graph saved to local storage');
    }
  }, [nodes, edges, viewport]);

  // TO DO: open the context menu if you dragged out an edge and didn't connect it,
  // so we can auto-spawn a compatible node for that edge
  const onConnectEnd = useCallback(
    // ReactMouseEvent | TouchEvent instead ?
    (event: MouseEvent | globalThis.TouchEvent) => {
      // console.log(event);
      // if (event.target && event.target.className !== 'flow_input') {
      // TODO: this logic may be wrong here? We're mixing react-events with native-events!
      // onContextMenu(event);
      // }

      const { nodes } = useFlowStore.getState();
      const newNodes = nodes.map((node) => {
        const outputs = { ...node.data.outputs };
        for (const name in outputs) {
          outputs[name].isHighlighted = false;
        }

        const inputs = { ...node.data.inputs };
        for (const name in inputs) {
          inputs[name].isHighlighted = false;
        }

        return {
          ...node,
          data: { ...node.data, outputs, inputs }
        };
      });

      setNodes(newNodes);
    },
    [nodes]
  );

  const onConnectStart: OnConnectStart = useCallback(
    (_: ReactMouseEvent | TouchEvent, params: OnConnectStartParams) => {
      if (!params.handleId) return;
      const node = nodes.find((node) => node.id === params.nodeId);
      if (!node) return;

      console.log('params', params, getHandleName(params.handleId));

      const handle =
        node.data[params.handleType === 'source' ? 'outputs' : 'inputs'][
          getHandleName(params.handleId)
        ];
      console.log('handle', handle);
      if (!handle) return;

      setCurrentConnectionLineType(handle.type);

      let newNodes = nodes;

      if (params.handleType === 'target') {
        newNodes = nodes.map((node) => {
          const outputs = { ...node.data.outputs };
          for (const name in outputs) {
            const output = outputs[name];
            outputs[name].isHighlighted = output.type !== handle.type;
          }

          return {
            ...node,
            data: {
              ...node.data,
              outputs
            }
          };
        });
      } else if (params.handleType === 'source') {
        newNodes = nodes.map((node) => {
          const inputs = { ...node.data.inputs };
          for (const name in inputs) {
            const input = inputs[name];
            inputs[name].isHighlighted = input.type !== handle.type;
          }

          return {
            ...node,
            data: {
              ...node.data,
              inputs
            }
          };
        });
      }
      setNodes(newNodes);
    },
    [nodes, setCurrentConnectionLineType, setNodes]
  );

  // Validation connection for edge-compatability and circular loops
  const isValidConnection = useCallback(
    (connection: Connection): boolean => {
      const { source, target, sourceHandle, targetHandle } = connection;
      const nodes = getNodes();
      const edges = getEdges();

      if (sourceHandle === null || targetHandle === null) return false;
      if (isWidgetHandleId(targetHandle)) return true;

      // Find corresponding nodes
      const sourceNode = nodes.find((node) => node.id === source);
      const targetNode = nodes.find((node) => node.id === target);
      if (!sourceNode || !targetNode) return false;

      // Ensure new connection does not introduce a circular loop
      if (target === source) return false;

      const hasCycle = (node: Node, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      if (hasCycle(targetNode)) return false;

      const outputHandle = sourceNode.data.outputs[getHandleName(sourceHandle)];
      const inputHandle = targetNode.data.inputs[getHandleName(targetHandle)];
      if (!outputHandle || !inputHandle) return false;

      if (sourceNode.type === 'RerouteNode' || targetNode.type === 'RerouteNode') {
        return outputHandle.type != inputHandle.type;
      }

      // Ensure new connection connects compatible types
      return outputHandle.type === inputHandle.type;
    },
    [getNodes, getEdges]
  );

  const onDragOver = useCallback(dragHandler, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) =>
      dropHandler({ rfInstance: instance, addNode, setNodes, setEdges })(event),
    [instance, addNode, setNodes, setEdges]
  );

  const handleKeyPress = useCallback(
    (keyName: string, event: any) => {
      event.preventDefault();
      hotKeysHandlers[keyName]?.();
    },
    [hotKeysHandlers]
  );

  // TO DO: this is aggressive; do not change zoom levels. We do not need to have
  // all nodes on screen at once; we merely do not want to leave too far out
  const handleMoveEnd = useCallback(
    (_: MouseEvent | globalThis.TouchEvent) => {
      const bounds = getNodesBounds(nodes);
      const viewPort = getViewport();

      const boundViewPort = getViewportForBounds(
        bounds,
        menuRef.current?.clientWidth || 1200,
        menuRef.current?.clientHeight || 800,
        0.7,
        viewPort.zoom
      );

      if (
        viewPort.x > (menuRef.current?.clientWidth || 0) ||
        viewPort.y > (menuRef.current?.clientHeight || 0)
      ) {
        fitView({
          minZoom: FLOW_MIN_ZOOM,
          maxZoom: viewPort.zoom,
          duration: 500
        });
      }

      if (viewPort.x < 0 && Math.abs(viewPort.x) > boundViewPort.x) {
        fitView({
          minZoom: FLOW_MIN_ZOOM,
          maxZoom: viewPort.zoom,
          duration: 500
        });
      }
    },
    [fitView, nodes, getViewport, menuRef]
  );

  return (
    <ReactFlow
      panOnDrag={panOnDrag}
      onContextMenu={onContextMenu}
      onNodeContextMenu={onNodeContextMenu}
      onPaneClick={onPaneClick}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onConnectStart={onConnectStart}
      onConnectEnd={onConnectEnd}
      isValidConnection={isValidConnection}
      onInit={setInstance}
      nodeTypes={nodeComponents}
      ref={menuRef}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onMoveEnd={handleMoveEnd}
      maxZoom={FLOW_MAX_ZOOM}
      minZoom={FLOW_MIN_ZOOM}
      deleteKeyCode={['Delete', 'Backspace']}
      multiSelectionKeyCode={'Shift'}
      fitView
      fitViewOptions={{
        padding: 2,
        minZoom: 1,
        maxZoom: FLOW_MAX_ZOOM,
        duration: 500
      }}
      zoomOnDoubleClick={false}
      style={{
        backgroundColor: 'var(--bg-color)',
        color: 'var(--fg-color)',
        cursor: 'crosshair'
      }}
      proOptions={{ account: 'paid-pro', hideAttribution: true }}
      edgeTypes={edgeComponents}
      connectionLineComponent={ConnectionLine}
      connectionLineType={ConnectionLineType.Bezier}
    >
      <ReactHotkeys keyName={hotKeysShortcut.join(',')} onKeyDown={handleKeyPress}>
        <Background color={'var(--tr-odd-bg-color)'} variant={BackgroundVariant.Lines} />

        <Controls />
        <NodeResizer />
        <NodeToolbar />
        <Panel position="top-right">
          <ControlPanel />
          <ImageFeedDrawer />
        </Panel>
      </ReactHotkeys>
    </ReactFlow>
  );
}
