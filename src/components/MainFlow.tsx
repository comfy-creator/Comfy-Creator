// Note: SOURCE = output, TARGET = input. Yes; this is confusing

import { DragEventHandler, useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  MiniMap,
  Node,
  NodeChange,
  NodeResizer,
  NodeToolbar,
  Panel,
  ReactFlowInstance,
  useReactFlow,
  getOutgoers,
  NodeTypes,
  OnConnectEnd
} from 'reactflow';
import { useContextMenu } from '../contexts/ContextMenu';
import ControlPanel from './ControlPanel/ControlPanel';
import { useStore, RFState } from '../store';
import { InputDef, NodeState, OutputDef } from '../types';
import { getFileAsDataURL, getFileKind } from '../utils.ts';
import { previewImage, previewVideo } from '../node_definitions/preview.ts';

const FLOW_KEY = 'flow';

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
  updateWidgetState: state.updateWidgetState
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
    addNode
  } = useStore(selector);

  const { getNodes, getEdges } = useReactFlow<NodeState, string>();
  const { onContextMenu, onNodeContextMenu, onPaneClick, menuRef } = useContextMenu();

  const [rfInstance, setRFInstance] = useState<ReactFlowInstance | null>(null);

  useEffect(() => {
    // Register some node defs for testing
    addNodeDefs({ previewImage, previewVideo });
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
      const sourceEdgeType = sourceNode.data.outputEdges[Number(sourceHandle)].edgeType;
      const targetEdgeType = targetNode.data.inputEdges[Number(targetHandle)].edgeType;
      return sourceEdgeType === targetEdgeType;
    },
    [getNodes, getEdges]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    if (!event.dataTransfer) return;

    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    async (event: DragEvent) => {
      event.preventDefault();
      if (!event.dataTransfer || !rfInstance) return;

      let i = 0;
      for (const file of event.dataTransfer.files) {
        const kind = getFileKind(file);

        // TODO: compute position in a better way
        const xy = { x: event.clientX + i * 100, y: event.clientY + i * 100 };
        const position = rfInstance.screenToFlowPosition(xy);

        switch (kind) {
          case 'image':
            const imageData = await getFileAsDataURL(file);
            addNode({
              position,
              type: 'previewImage',
              inputWidgetValues: { image: imageData }
            });

            break;
          case 'video':
            const videoData = await getFileAsDataURL(file);
            addNode({
              position,
              type: 'previewVideo',
              inputWidgetValues: {
                video: {
                  src: videoData,
                  type: file.type
                }
              }
            });

            break;
          case 'json':
            try {
              const flow = JSON.parse(await file.text());

              if (typeof flow == 'object') {
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
              }
            } catch (e) {
              console.error('Failed to load workflow');
            }
            break;
          default:
            return;
        }

        i += 1;
      }
    },
    [rfInstance]
  );

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
      fitView
      style={{
        backgroundColor: 'var(--bg-color)',
        color: 'var(--fg-color)'
      }}
    >
      <Background variant={BackgroundVariant.Lines} />
      <Controls />
      <MiniMap />
      <NodeResizer />
      <NodeToolbar />
      <Panel position="top-right">
        <ControlPanel />
      </Panel>
    </ReactFlow>
  );
}
