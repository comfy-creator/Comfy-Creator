// Note: SOURCE = output, TARGET = input. Yes; this is confusing

import { useCallback, useState } from "react";
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
} from "reactflow";
import { useNodeTypes } from "../contexts/NodeTypes.tsx";
import { useContextMenu } from "../contexts/ContextMenu.tsx";

export function MainFlow() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const { nodeTypes } = useNodeTypes();
  const { onContextMenu, onNodeContextMenu, onPaneClick, menuRef } =
    useContextMenu();

  // Standard React Flow Handlers
  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  return (
    <ReactFlow
      onContextMenu={onContextMenu}
      onNodeContextMenu={onNodeContextMenu}
      onPaneClick={onPaneClick}
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      ref={menuRef}
      fitView
    >
      <Background variant={BackgroundVariant.Lines} />
      <Controls />
      <MiniMap />
      <NodeResizer />
      <NodeToolbar />
    </ReactFlow>
  );
}
