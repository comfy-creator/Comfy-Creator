// Note: SOURCE = output, TARGET = input. Yes; this is confusing

import {
  DragEvent,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent,
  useCallback,
  useEffect,
  useState
} from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  ConnectionLineType,
  ConnectionMode,
  Controls,
  Edge,
  getNodesBounds,
  getOutgoers,
  getViewportForBounds,
  Node,
  NodeResizer,
  NodeToolbar,
  OnConnectStart,
  OnConnectStartParams,
  Panel,
  updateEdge,
  useReactFlow
} from 'reactflow';
import { useContextMenu } from '../contexts/contextmenu';
import ControlPanel from './panels/ControlPanel';
import { RFState, useFlowStore } from '../store/flow';
import { EdgeType, NodeData } from '../lib/types';
import ReactHotkeys from 'react-hot-keys';
import { dragHandler, dropHandler } from '../lib/handlers/dragDrop';
import { ConnectionLine } from './ConnectionLIne';
import {
  API_URL,
  AUTO_PAN_ON_CONNECT,
  EDGES_UPDATABLE,
  ELEVATE_EDGES_ON_SELECT,
  FLOW_MAX_ZOOM,
  FLOW_MIN_ZOOM,
  HANDLE_TYPES,
  MULTI_SELECT_KEY_CODE,
  REACTFLOW_PRO_OPTIONS_CONFIG,
  ZOOM_ON_DOUBLE_CLICK
} from '../lib/config/constants';
import { useSettings } from '../contexts/settings';
import { useSettingsStore } from '../store/settings';
import { defaultThemeConfig } from '../lib/config/themes';
import { colorSchemeSettings } from '../lib/settings';
import { useApiContext } from '../contexts/api';
import ImageFeedDrawer from './Drawer/ImageFeedDrawer';
import { useGraph } from '../lib/hooks/useGraph';
import { getHandleName, getHandleNodeId, isWidgetType } from '../lib/utils/node';
import { getSuggestedNodesData } from '../lib/menu.ts';

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
  updateOutputData: state.updateOutputData,
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
    nodeDefs,
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
    updateInputData,
    updateOutputData
  } = useFlowStore(selector);

  const { getNodes, getEdges, getViewport, fitView } = useReactFlow<NodeData, string>();
  const { onContextMenu, onNodeContextMenu, onPaneClick, menuRef } = useContextMenu();
  const { loadCurrentSettings, addSetting } = useSettings();
  const { getNodeDefs, makeServerURL } = useApiContext();
  const { saveSerializedGraph, loadSerializedGraph } = useGraph();
  const [edgeUpdating, setEdgeUpdating] = useState(false);
  const [currentEdge, setCurrentEdge] = useState<{
    handleId: string;
    edgeType: EdgeType;
    handleType: 'input' | 'output';
  } | null>(null);
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
    // TODO: this logic may be wrong here? We're mixing react-events with native-events!
    async (event: MouseEvent | globalThis.TouchEvent) => {
      if (edgeUpdating) return;

      const target = event.target as HTMLElement;
      const isDroppedOnPane = target.classList.contains('react-flow__pane');
      if (isDroppedOnPane) {
        if (!currentEdge) return;

        // For some reason, need to wait until the next event loop
        await new Promise((resolve) => setTimeout(resolve, 0));
        const data = getSuggestedNodesData({
          nodeDefs,
          limit: 10,
          handleType: currentEdge.handleType,
          edgeType: currentEdge.edgeType,
          handleId: currentEdge.handleId
        });

        const title = `${currentEdge.edgeType} | ${currentEdge.edgeType}`;
        onContextMenu(event, data, title);
      } else {
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
      }

      setCurrentEdge(null);
    },
    [nodes, currentEdge, nodeDefs]
  );

  const onConnectStart: OnConnectStart = useCallback(
    (_: ReactMouseEvent | TouchEvent, params: OnConnectStartParams) => {
      const node = nodes.find((node) => node.id === params.nodeId);
      if (!node || !params.handleId) return;

      const handleName = getHandleName(params.handleId);
      const handle = node.data[params.handleType === 'source' ? 'outputs' : 'inputs'][handleName];
      if (!handle) return;

      setCurrentEdge({
        edgeType: handle.type,
        handleId: params.handleId,
        handleType: params.handleType === 'source' ? 'output' : 'input'
      });
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

      // Find corresponding nodes
      const sourceNode = nodes.find((node) => node.id === source);
      const targetNode = nodes.find((node) => node.id === target);
      if (!sourceNode || !targetNode) return false;

      // Ensure new connection does not introduce a circular loop
      if (target === source) return false;

      if (isWidgetType(targetNode.data.inputs[getHandleName(targetHandle)]?.type)) return true;

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

  const onEdgeUpdateStart = useCallback(
    (_: any, edge: Edge) => {
      setEdgeUpdating(true);
      if (!edge.sourceHandle || !edge.targetHandle) return;

      const sourceNode = getHandleNodeId(edge.sourceHandle);
      const targetNode = getHandleNodeId(edge.targetHandle);

      const sourceHandle = getHandleName(edge.sourceHandle);
      const targetHandle = getHandleName(edge.targetHandle);

      updateInputData({ nodeId: targetNode, name: targetHandle, data: { isConnected: false } });
      updateOutputData({ nodeId: sourceNode, name: sourceHandle, data: { isConnected: false } });
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    },
    [edges]
  );

  const onEdgeUpdate = useCallback((oldEdge: Edge, newConnection: Connection) => {
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
    setEdgeUpdating(false);
  }, []);

  const onEdgeUpdateEnd = useCallback((_: any) => setEdgeUpdating(false), []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      panOnDrag={panOnDrag}
      edgesUpdatable={EDGES_UPDATABLE}
      autoPanOnConnect={AUTO_PAN_ON_CONNECT}
      onPaneClick={onPaneClick}
      elevateEdgesOnSelect={ELEVATE_EDGES_ON_SELECT}
      onContextMenu={onContextMenu}
      onNodeContextMenu={onNodeContextMenu}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      connectionMode={ConnectionMode.Loose}
      onConnectStart={onConnectStart}
      onConnectEnd={onConnectEnd}
      isValidConnection={isValidConnection}
      onInit={setInstance}
      nodeTypes={nodeComponents}
      ref={menuRef}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onMoveEnd={handleMoveEnd}
      onEdgeUpdateEnd={onEdgeUpdateEnd}
      onEdgeUpdate={onEdgeUpdate}
      onEdgeUpdateStart={onEdgeUpdateStart}
      maxZoom={FLOW_MAX_ZOOM}
      minZoom={FLOW_MIN_ZOOM}
      deleteKeyCode={['Delete', 'Backspace']}
      multiSelectionKeyCode={MULTI_SELECT_KEY_CODE}
      fitView
      fitViewOptions={{
        padding: 2,
        minZoom: 1,
        maxZoom: FLOW_MAX_ZOOM,
        duration: 500
      }}
      zoomOnDoubleClick={ZOOM_ON_DOUBLE_CLICK}
      style={{
        backgroundColor: 'var(--bg-color)',
        color: 'var(--fg-color)',
        cursor: 'crosshair'
      }}
      proOptions={REACTFLOW_PRO_OPTIONS_CONFIG}
      edgeTypes={edgeComponents}
      connectionLineComponent={ConnectionLine}
      connectionLineType={ConnectionLineType.Bezier}
      onPaneContextMenu={onContextMenu}
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
