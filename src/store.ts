import {
  Edge,
  EdgeChange,
  OnConnect,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  XYPosition,
  Connection,
  addEdge,
  isNode
} from 'reactflow';
import { create } from 'zustand';
import { NodeDefinitions, NodeState, NodeTypes as NodeComponents } from './types';
import { initialNodeState } from './utils';

export type RFState = {
  nodes: Node<NodeState>[];
  edges: Edge[];
  setNodes: (nodes: Node<NodeState, string>[]) => void;
  setEdges: (edges: Edge[]) => void;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  nodeDefs: NodeDefinitions;
  addNodeDefs: (defs: NodeDefinitions) => void;
  removeNodeDefs: (typeNames: string[]) => void;

  addNode: (type: string, position: XYPosition) => void;
  removeNode: (nodeId: string) => void;
  updateNodeState: (nodeId: string, newState: Partial<NodeState>) => void;

  nodeComponents: Record<string, NodeComponents>;
};

export const useStore = create<RFState>((set, get) => ({
  nodes: [],

  edges: [],

  setNodes: (nodes) => set(() => ({ nodes })),

  setEdges: (edges) => set(() => ({ edges })),

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes)
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges)
    });
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges)
    });
  },

  nodeDefs: {},

  // This will overwrite old node-definitions of the same name
  addNodeDefs: (defs: NodeDefinitions) => {
    set((state) => {
      const updatedNodeDefs = { ...state.nodeDefs, ...defs };
      return { nodeDefs: updatedNodeDefs };
    });
  },

  removeNodeDefs: (typeNames: string[]) => {
    set((state) => {
      const updatedNodeDefs = { ...state.nodeDefs };

      typeNames.forEach((typeName) => {
        delete updatedNodeDefs[typeName];
      });

      return { nodeDefs: updatedNodeDefs };
    });
  },

  addNode: (type: string, position: XYPosition) => {
    const def = get().nodeDefs[type];
    if (!def) {
      throw new Error(`Node type ${type} does not exist`);
    }

    const data = initialNodeState(def);

    // TO DO: use a more robust id generator that is guaranteed unique
    const newNode = {
      id: `${type}-${get().nodes.length + 1}`,
      type,
      position,
      data
      // example of other properties we could specify:
      //   style: { border: '1px solid #ddd', padding: '10px' },
      //   className: 'custom-node-class',
      //   draggable: true,
      //   selectable: true,
      //   connectable: true,
      //   hidden: false,
      //   zIndex: 1
    };

    set((state) => ({
      nodes: [...state.nodes, newNode]
    }));
  },

  removeNode: (nodeId: string) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    }));
  },

  updateNodeState: (nodeId: string, newState: Partial<NodeState>) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, ...newState };
        }

        return node;
      })
    });
  },

  nodeComponents: {}
}));
