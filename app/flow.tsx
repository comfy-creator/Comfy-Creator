"use client";

import { Background, Controls, NodeTypes, ReactFlow } from "@xyflow/react";
import { ButtonsPanel } from "@/components/app/panels/buttons";
import { MenubarPanel } from "@/components/app/panels/menubar";
import { useContextMenu } from "@/components/providers/context-menu";
import { useFlow } from "@/lib/stores/flow";
import { nodeDefinitions } from "@/lib/data/nodes";
import { useEffect } from "react";

export function Flow() {
  const {
    nodes,
    edges,
    nodeTypes,
    addConnection,
    handleNodeChanges,
    handleEdgeChanges,
    loadNodeDefinitions,
  } = useFlow();
  const { onContextMenu } = useContextMenu();

  useEffect(() => {
    loadNodeDefinitions(nodeDefinitions);
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onConnect={addConnection}
      onContextMenu={onContextMenu}
      onNodesChange={handleNodeChanges}
      onEdgesChange={handleEdgeChanges}
    >
      <Background />
      <Controls />

      <MenubarPanel position="top-left" />
      <ButtonsPanel position="top-right" />
    </ReactFlow>
  );
}
