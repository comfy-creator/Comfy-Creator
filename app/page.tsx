"use client";

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { CozyNode } from "@/components/nodes/cozy-node";
import { ButtonsPanel } from "@/components/app/panels/buttons";
import { MenubarPanel } from "@/components/app/panels/menubar";

export default function Page() {
  const { getZoom, getViewport } = useReactFlow();
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const { x: viewportX, y: viewportY } = getViewport();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [customNodes, setCustomNodes] = useState<Record<string, any>>({});

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onContextMenu = useCallback(
    (event) => {
      event.preventDefault();

      setContextMenu({
        x: event.clientX - viewportX,
        y: event.clientY - viewportY,
      });
    },
    [getZoom]
  );

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        closeContextMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeContextMenu]);

  const addNode = (type: string, position: UIPosition) => {
    const newNode: Node = {
      position,
      type: type ?? "default",
      id: `node_${nodes.length + 1}`,
      data: { label: `Node ${nodes.length + 1}` },
    };

    console.log(customNodes);
    console.log(newNode);
    console.log(nodes);

    setNodes((nds) => [...nds, newNode]);
  };

  useEffect(() => {
    const customNodes: Record<string, any> = {};

    for (const category in categNodes) {
      console.log(categNodes[category], category);
      for (const node of categNodes[category]) {
        customNodes[node.type] = memo(CozyNode(node));
      }
    }

    console.log(customNodes);
    setCustomNodes(customNodes);
  }, []);

  return (
    <div className="h-[100vh] w-full">
      <ReactFlow
        fitView
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        nodeTypes={customNodes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onContextMenu={onContextMenu}
      >
       
      
        <Background />
        <Controls />

        <MenubarPanel position="top-left" />
        <ButtonsPanel position="top-right" />
      </ReactFlow>
    </div>
  );
}
