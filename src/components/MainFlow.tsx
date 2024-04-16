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
import { NodeState } from '../lib/types';
import {
  PreviewImage,
  PreviewVideo,
  PrimitiveNode,
  RerouteNode,
  transformNodeDefs
} from '../lib/nodedefs';
import ReactHotkeys from 'react-hot-keys';
import { dragHandler, dropHandler } from '../lib/handlers/dragDrop';
import { ConnectionLine } from './ConnectionLIne';
import {
  API_URL,
  FLOW_MAX_ZOOM,
  FLOW_MIN_ZOOM,
  HANDLE_ID_DELIMITER,
  HANDLE_TYPES
} from '../lib/config/constants';
import { useSettings } from '../contexts/settings';
import { useSettingsStore } from '../store/settings';
import { defaultThemeConfig } from '../lib/config/themes';
import { colorSchemeSettings } from '../lib/settings';
import { useApiContext } from '../contexts/api.tsx';
import { useFlow } from '../lib/hooks/useFlow.tsx';
import { computeInitialNodeState } from '../lib/utils/node.ts';
import ImageFeedDrawer from './Drawer/ImageFeedDrawer.tsx';

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
  addNodeDefs: state.addNodeDefs,
  nodeDefs: state.nodeDefs,
  addNode: state.addNode,
  updateWidgetState: state.updateWidgetState,
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
    addNodeDefs,
    addNode,
    hotKeysShortcut,
    hotKeysHandlers,
    setCurrentConnectionLineType,
    edgeComponents,
    registerEdgeType,
    instance,
    setInstance,
    execution,
    updateWidgetState
  } = useFlowStore(selector);

  const { getNodes, getEdges, getViewport, fitView } = useReactFlow<NodeState, string>();
  const { onContextMenu, onNodeContextMenu, onPaneClick, menuRef } = useContextMenu();
  const { loadCurrentSettings, addSetting } = useSettings();
  const { getNodeDefs, makeServerURL } = useApiContext();
  const { saveFlow, loadFlow } = useFlow();
  const viewport = getViewport();

  useEffect(() => {
    getNodeDefs()
      .then((defs) => {
        addNodeDefs({
          PreviewImage,
          PreviewVideo,
          RerouteNode,
          PrimitiveNode,
          ...transformNodeDefs(defs)
        });

        loadFlow();
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!execution.output) return;

    const node = nodes.find((node) => node.id === execution.currentNodeId);
    if (node?.id !== execution.currentNodeId) return;
    const { images } = execution.output;

    const fileView = API_URL.VIEW_FILE({ ...images?.[0] });
    updateWidgetState({
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

      saveFlow(flow);
      console.log('Flow saved to local storage');
    }
  }, [nodes, edges, viewport]);

  // TO DO: open the context menu if you dragged out an edge and didn't connect it,
  // so we can auto-spawn a compatible node for that edge
  const onConnectEnd = useCallback(
    // ReactMouseEvent | TouchEvent instead ?
    (event: Event) => {
      if (event.target && event.target.className !== 'flow_input') {
        // TODO: this logic may be wrong here? We're mixing react-events with native-events!
        onContextMenu(event);
      }

      const newNodes = nodes.map((node) => {
        const outputs = Object.entries(node.data.outputs).map(([_, output]) => ({
          ...output,
          isHighlighted: false
        }));

        const inputs = Object.entries(node.data.inputs).map(([_, input]) => ({
          ...input,
          isHighlighted: false
        }));

        return {
          ...node,
          data: { ...node.data, outputs, inputs }
        };
      });
      setNodes(newNodes);
    },
    [nodes, setNodes, onContextMenu]
  );

  const onConnectStart: OnConnectStart = useCallback(
    (event: ReactMouseEvent | TouchEvent, params: OnConnectStartParams) => {
      if (!params.handleId) return;
      const [_category, _index, type] = params.handleId.split(HANDLE_ID_DELIMITER);
      if (type) {
        setCurrentConnectionLineType(type);
      }

      let newNodes = nodes;

      if (params.handleType === 'target') {
        newNodes = nodes.map((node) => {
          const outputs = Object.entries(node.data.outputs).map(([_, output]) => {
            return {
              ...output,
              isHighlighted: output.type !== type
            };
          });
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
          const inputs = Object.entries(node.data.inputs).map(([_, input]) => {
            return {
              ...input,
              isHighlighted: input.type !== type
            };
          });
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

  // Store graph state to local storage
  const serializeFlow = useCallback(() => {
    if (instance) saveFlow();
  }, [instance]);

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

      const hasCycle = (node: Node, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      if (hasCycle(targetNode)) return false;

      const splitOutputHandle = sourceHandle.split(HANDLE_ID_DELIMITER).slice(-1);
      const splitInputHandle = targetHandle.split(HANDLE_ID_DELIMITER).slice(-1);

      if (sourceNode.type === 'RerouteNode' || targetNode.type === 'RerouteNode') {
        return splitOutputHandle[0] != splitInputHandle[0];
      }

      // Ensure new connection connects compatible types
      return splitOutputHandle[0] === splitInputHandle[0];
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
    (event: MouseEvent | globalThis.TouchEvent) => {
      const bounds = getNodesBounds(nodes);
      const viewPort = getViewport();
      //
      const boundViewPort = getViewportForBounds(
        bounds,
        menuRef.current?.clientWidth || 1200,
        menuRef.current?.clientHeight || 800,
        0.7,
        viewPort.zoom
      );
      //
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
