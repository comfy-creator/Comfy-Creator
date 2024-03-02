// Note: SOURCE = output, TARGET = input. Yes; this is confusing

import { DragEvent, MouseEvent, useCallback, useEffect, useState } from 'react';
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
  OnConnectEnd,
  Panel,
  ReactFlowInstance,
  useReactFlow
} from 'reactflow';
import { useContextMenu } from '../contexts/ContextMenu';
import ControlPanel from './ControlPanel/ControlPanel';
import { RFState, useFlowStore } from '../store/flow';
import { NodeDefinition, NodeState } from '../types';
import { previewImage, previewVideo } from '../node_definitions/preview';
import ReactHotkeys from 'react-hot-keys';
import { dragHandler, dropHandler } from '../handlers/dragDrop';
import nodeInfo from '../../node_info.json';
import { HANDLE_TYPES } from '../constants.ts';
import { createEdgeFromTemplate } from './template/EdgeTemplate.tsx';
import { ConnectionLine } from './ConnectionLIne.tsx';

const FLOW_KEY = 'flow';
const PADDING = 5; // in pixels
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;

const selector = (state: RFState) => ({
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
  setCurrentConnectionLineType: state.setCurrentConnectionLineType
});

export function MainFlow() {
  const {
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
    setCurrentConnectionLineType
  } = useFlowStore(selector);

  const { getNodes, getEdges, getViewport, fitView } = useReactFlow<NodeState, string>();
  const { onContextMenu, onNodeContextMenu, onPaneClick, menuRef } = useContextMenu();

  const [rfInstance, setRFInstance] = useState<ReactFlowInstance | null>(null);

  useEffect(() => {
    // Register some node defs for testing
    addNodeDefs({ previewImage, previewVideo });
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

      for (const name in node.input.required) {
        const [type, options] = node.input.required[
          name as keyof typeof node.input.required
        ] as any;
        const input = buildInput(type, name, options, false);
        def.inputs.push(input);
      }

      // @ts-expect-error
      for (const name in node.input.optional) {
        // @ts-expect-error
        const [type, options] = node.input.optional[
          // @ts-expect-error
          name as keyof typeof node.input.optional
        ] as any;

        const input = buildInput(type, name, options, true);
        def.inputs.push(input);
      }

      for (const name in node.output) {
        const output = node.output[name as keyof typeof node.output] as any;
        def.outputs.push({ name: output, type: output });
      }

      defs[name] = def;
    }

    addNodeDefs(defs);
  }, []);

  // Store graph state to local storage
  const serializeGraph = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(FLOW_KEY, JSON.stringify(flow));
    }
  }, [rfInstance]);

  // Load graph state from local storage
  const loadGraph = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(FLOW_KEY) || '');

      if (flow) {
        // const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        // setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setEdges]);

  // TO DO: open the context menu if you dragged out an edge and didn't connect it,
  // so we can auto-spawn a compatible node for that edge
  const oncConnectEnd: OnConnectEnd = useCallback((event: MouseEvent | TouchEvent) => {
    console.log('onConnectEnd', event);
  }, []);

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

      // Ensure new connection connects compatible types
      const { type: sourceType } = sourceNode.data.outputs[Number(sourceHandle)];
      const { type: targetType } = targetNode.data.inputs[Number(targetHandle)];
      return sourceType === targetType;
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
    (event: MouseEvent) => {
      // console.log("event>>", event)
      const bounds = getNodesBounds(nodes);
      // console.log("bounds>", bounds)
      const viewPort = getViewport();
      //
      const boundViewPort = getViewportForBounds(
        bounds,
        menuRef.current?.clientWidth || 1200,
        menuRef.current?.clientHeight || 800,
        0.7,
        viewPort.zoom
      );
      // console.log("Bound view port>>", boundViewPort)
      // console.log("GET >View port>>", getViewport())
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
    [fitView, nodes]
  );

  // Register Edge Types; TODO: Move to a separate file later
  const defaultEdgeTypes: Record<string, any> = {};
  for (const type in HANDLE_TYPES) {
    defaultEdgeTypes[type] = createEdgeFromTemplate({ type });
  }

  return (
    <ReactFlow
      onContextMenu={onContextMenu}
      onNodeContextMenu={onNodeContextMenu}
      onPaneClick={onPaneClick}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onConnectEnd={oncConnectEnd}
      isValidConnection={isValidConnection}
      onInit={setRFInstance}
      nodeTypes={nodeComponents}
      ref={menuRef}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onMoveEnd={handleMoveEnd}
      maxZoom={MAX_ZOOM}
      minZoom={MIN_ZOOM}
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
      proOptions={{ account: '', hideAttribution: true }}
      edgeTypes={defaultEdgeTypes}
      connectionLineComponent={ConnectionLine}
      onConnectStart={(event, params) => {
        if (!params.handleId) return;
        const [_category, _index, type] = params.handleId.split('-');
        if (type) {
          setCurrentConnectionLineType(type);
        }
      }}
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
