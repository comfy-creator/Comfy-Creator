import { create } from "zustand";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  NodeTypes,
} from "@xyflow/react";
import { NodeDefinition, UIPosition } from "../types";
import { CozyNode } from "@/components/nodes/cozy-node";

interface FlowStore {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: NodeTypes;

  addConnection: (connection: Connection) => void;
  addNode: (type: string, position: UIPosition) => void;
  handleNodeChanges: (changes: NodeChange[]) => void;
  handleEdgeChanges: (changes: EdgeChange[]) => void;
  loadNodeDefinitions: (definitions: NodeDefinition[]) => void;
}

export const useFlow = create<FlowStore>((set, get) => ({
  nodes: [],
  edges: [],
  nodeTypes: {},

  addNode: (type: string, position: UIPosition) => {
    set((state) => {
      const newNode: Node = {
        position,
        type: type ?? "default",
        id: `node_${state.nodes.length + 1}`,
        data: { label: `Node ${state.nodes.length + 1}` },
      };

      return { nodes: [...state.nodes, newNode] };
    });
  },

  loadNodeDefinitions: (definitions: NodeDefinition[]) => {
    const nodeTypes: NodeTypes = {};
    for (const definition of definitions) {
      nodeTypes[definition.type] = CozyNode(definition);
    }

    set({ nodeTypes });
  },

  setNodes: (nodes: Node[]) => {
    set({ nodes });
  },

  handleNodeChanges: (changes: NodeChange[]) => {
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) }));
  },

  handleEdgeChanges: (changes: EdgeChange[]) => {
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) }));
  },

  addConnection: (connection: Connection) => {
    set((state) => ({ edges: addEdge(connection, state.edges) }));
  },
}));
