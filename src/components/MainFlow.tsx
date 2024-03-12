// Note: SOURCE = output, TARGET = input. Yes; this is confusing

import {
  DragEvent,
  MouseEvent as ReactMouseEvent,
  TouchEvent,
  useCallback,
  useEffect,
  useState
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
  ReactFlowInstance,
  useKeyPress,
  useOnSelectionChange,
  useReactFlow
} from 'reactflow';
import { useContextMenu } from '../contexts/ContextMenu';
import ControlPanel from './panels/ControlPanel';
import { RFState, useFlowStore } from '../store/flow';
import { NodeDefinition, NodeState } from '../types';
import { previewImage, previewVideo } from '../node_definitions/preview';
import ReactHotkeys from 'react-hot-keys';
import { dragHandler, dropHandler } from '../handlers/dragDrop';
import nodeInfo from '../../node_info.json';
import { ConnectionLine } from './ConnectionLIne.tsx';
import { HANDLE_ID_DELIMITER, HANDLE_TYPES } from '../config/constants.ts';
import { defaultEdges, defaultNodes } from '../default-flow.ts';

const FLOW_KEY = 'flow';
const PADDING = 5; // in pixels
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;

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
  addNode: state.addNode,
  updateWidgetState: state.updateWidgetState,
  hotKeysShortcut: state.hotKeysShortcut,
  hotKeysHandlers: state.hotKeysHandlers,
  addHotKeysShortcut: state.addHotKeysShortcut,
  addHotKeysHandlers: state.addHotKeysHandlers,
  setCurrentConnectionLineType: state.setCurrentConnectionLineType,
  edgeComponents: state.edgeComponents,
  registerEdgeType: state.registerEdgeType
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
    registerEdgeType
  } = useFlowStore(selector);

  const { getNodes, getEdges, getViewport, fitView, setViewport } = useReactFlow<
    NodeState,
    string
  >();
  const { onContextMenu, onNodeContextMenu, onPaneClick, menuRef } = useContextMenu();

  const [rfInstance, setRFInstance] = useState<ReactFlowInstance | null>(null);

  // keep an eye on shift key
  const shiftPressed = useKeyPress('Shift');

  // viewport from rfl
  const viewport = getViewport();

  useEffect(() => {
    const PrimitiveNode: NodeDefinition = {
      inputs: [],
      category: 'utils',
      output_node: true,
      display_name: 'Primitive',
      description: 'Primitive Node',
      outputs: [{ type: '*', name: 'connect widget to input' }]
    };

    const RerouteNode: NodeDefinition = {
      category: 'utils',
      output_node: true,
      display_name: 'Reroute',
      description: 'Reroute Node',
      inputs: [{ type: '*', name: '' }],
      outputs: [{ type: '*', name: '' }]
    };

    // Register some node defs for testing
    addNodeDefs({ previewImage, previewVideo, RerouteNode, PrimitiveNode });
  }, [addNodeDefs]);

  useEffect(() => {
    const defs: Record<string, NodeDefinition> = {};

    const buildInput = (type: string, name: string, options: any, optional: boolean) => {
      let data;
      if (Array.isArray(type)) {
        data = {
          type: 'ENUM',
          multiSelect: false,
          defaultValue: type[0],
          options: type
        };
      } else {
        data = {
          type,
          defaultValue: options?.default,
          ...options
        };
      }

      return { ...data, name, optional };
    };

    for (const name in nodeInfo) {
      const node = nodeInfo[name as keyof typeof nodeInfo];

      const def: NodeDefinition = {
        inputs: [],
        outputs: [],
        category: node.category,
        description: node.description,
        output_node: node.output_node,
        display_name: node.display_name
      };

      // TO DO: we should change the server's return value for node-definitions such
      // that it conforms to the NodeDefinition type. We do not need to support ComfyUI's
      // old legacy poorly thought-out system.
      for (const name in node.input.required) {
        const [type, options] = node.input.required[
          name as keyof typeof node.input.required
        ] as any;
        const input = buildInput(type, name, options, false);
        def.inputs.push(input);
      }

      // for (const name in node.input.optional) {
      //   const [type, options] = node.input.optional[
      //     name as keyof typeof node.input.optional
      //   ] as any;

      //   const input = buildInput(type, name, options, true);
      //   def.inputs.push(input);
      // }

      for (const name in node.output) {
        const output = node.output[name as keyof typeof node.output] as any;
        def.outputs.push({ name: output, type: output });
      }

      defs[name] = def;
    }

    addNodeDefs(defs);
    registerEdgeType(HANDLE_TYPES);
  }, []);

  useEffect(() => {
    // Load graph state from local storage
    const flow = JSON.parse(localStorage.getItem(FLOW_KEY) as string);
    if (flow) {
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setNodes(flow.nodes?.length > 0 ? flow.nodes : defaultNodes);
      setEdges(flow.edges?.length > 0 ? flow.edges : defaultEdges);
      setViewport({ x, y, zoom });
    }
  }, []);

  // save to localStorage as nodes, edges and viewport changes
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      const flow = {
        nodes,
        edges,
        viewport
      };
      localStorage.setItem(FLOW_KEY, JSON.stringify(flow));
    }
  }, [nodes, edges, viewport]);

  // Store graph state to local storage
  const serializeGraph = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(FLOW_KEY, JSON.stringify(flow));
    }
  }, [rfInstance]);

  // TO DO: open the context menu if you dragged out an edge and didn't connect it,
  // so we can auto-spawn a compatible node for that edge
  const onConnectEnd = useCallback(
    // ReactMouseEvent | TouchEvent instead ?
    (event: MouseEvent | globalThis.TouchEvent) => {
      if (event.target && !(event.target.className === 'flow_input')) {
        // TO DO: this logic may be wrong here? We're mixing react-events with native-events!
        onContextMenu(event);
      }
      const newNodes = nodes.map((node) => {
        const outputs = Object.entries(node.data.outputs).map(([_, output]) => {
          return {
            ...output,
            isHighlighted: false
          };
        });
        const inputs = Object.entries(node.data.inputs).map(([_, input]) => {
          return {
            ...input,
            isHighlighted: false
          };
        });
        return {
          ...node,
          data: {
            ...node.data,
            outputs,
            inputs
          }
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
      dropHandler({ rfInstance, addNode, setNodes, setEdges })(event),
    [rfInstance, addNode, setNodes, setEdges]
  );

  const handleKeyPress = useCallback(
    (keyName: string, event: any) => {
      event.preventDefault();
      const func = hotKeysHandlers[keyName];
      func && func();
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
          minZoom: MIN_ZOOM,
          maxZoom: viewPort.zoom,
          duration: 500
        });
      }

      if (viewPort.x < 0 && Math.abs(viewPort.x) > boundViewPort.x) {
        fitView({
          minZoom: MIN_ZOOM,
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
      onInit={setRFInstance}
      nodeTypes={nodeComponents}
      ref={menuRef}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onMoveEnd={handleMoveEnd}
      maxZoom={MAX_ZOOM}
      minZoom={MIN_ZOOM}
      deleteKeyCode={['Delete', 'Backspace']}
      multiSelectionKeyCode={'Shift'}
      fitView
      fitViewOptions={{
        padding: 2,
        minZoom: 1,
        maxZoom: MAX_ZOOM,
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
        <Background variant={BackgroundVariant.Lines} />
        <Controls />
        <NodeResizer />
        <NodeToolbar />
        <Panel position="top-right">
          <ControlPanel />
        </Panel>
      </ReactHotkeys>
    </ReactFlow>
  );
}
