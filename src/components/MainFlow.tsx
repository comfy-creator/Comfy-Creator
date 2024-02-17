// Note: SOURCE = output, TARGET = input. Yes; this is confusing

import { useCallback, useEffect, useState } from 'react';
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
  NodeTypes
} from 'reactflow';
import { useNodeTypes } from '../contexts/NodeTypes';
import { useContextMenu } from '../contexts/ContextMenu';
import ControlPanel from './ControlPanel/ControlPanel';
import { useRegisterNodes } from '../hooks/useRegisterNodes';
import { videoModelDef } from '../node_definitions/videoModel';
import { DataType } from '../types';

const FLOW_KEY = 'flow';

export function MainFlow() {
  const [nodes, setNodes] = useState<Node<DataType, string>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [rfInstance, setRFInstance] = useState<ReactFlowInstance | null>(null);

  const { registerNode } = useRegisterNodes();
  const { nodeTypes } = useNodeTypes();
  const { onContextMenu, onNodeContextMenu, onPaneClick, menuRef } = useContextMenu();

  const { getNodes, getEdges } = useReactFlow();

  const serializeGraph = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(FLOW_KEY, JSON.stringify(flow));
    }
  }, [rfInstance]);

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
  }, []);

  // Discard
  useEffect(() => {
    registerNode('VideoModel', videoModelDef);
  }, []);

  // Discard
  useEffect(() => {
    setNodes([
      {
        id: '1',
        type: 'VideoModel',
        position: { x: 250, y: 5 },
        data: {}
      }
    ]);
  }, []);

  // Standard React Flow Handlers
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const isValidConnection = useCallback(
    (connection: Connection): boolean => {
      const { source, target, sourceHandle, targetHandle } = connection;
      const nodes = getNodes();
      const edges = getEdges();

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

      const whatever = edges[0];
      whatever.type;

      const whatever2 = nodes[0];
      whatever2.data;

      // Ensure new connection connects compatible types
      // input === output
      const node = nodes.find((node) => node.id === connection.source);
      const handle = node.handles?.find((handle) => {
        handle.id === connection.sourceHandle;
      });

      return connection.targetHandle == connection.sourceHandle;
    },
    [getNodes, getEdges]
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
      isValidConnection={isValidConnection}
      onInit={setRFInstance}
      nodeTypes={nodeTypes}
      ref={menuRef}
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
