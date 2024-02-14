// Note: SOURCE = output, TARGET = input. Yes; this is confusing

import { useCallback, useEffect, useState } from "react";
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
} from "reactflow";
import { useNodeTypes } from "../contexts/NodeTypes";
import { useContextMenu } from "../contexts/ContextMenu";
import ControlPanel from "./ControlPanel/ControlPanel";
import { useRegisterNodes } from "../hooks/useRegisterNodes";
import { videoModelDef } from "../node_definitions/videoModel";

export function MainFlow() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const { registerNode } = useRegisterNodes();
  const { nodeTypes } = useNodeTypes();

  useEffect(() => {
    registerNode("VideoModel", videoModelDef);
  }, []);

  useEffect(() => {
    setNodes([
      {
        id: "1",
        type: "VideoModel",
        position: { x: 250, y: 5 },
        data: {},
      },
    ]);
  }, []);

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
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--fg-color)",
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
