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
import {
  NodeDefinitions,
  NodeState,
  NodeTypes as NodeComponents,
  WidgetState,
  EdgeType,
  UpdateWidgetState,
  AddNodeParams
} from './types';
import { initialNodeState } from './utils';
import { createNodeComponentFromDef } from './components/template/NodeTemplate';

export type RFState = {
  nodes: Node<NodeState>[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  nodeDefs: NodeDefinitions;
  nodeComponents: NodeComponents;
  addNodeDefs: (defs: NodeDefinitions) => void;
  removeNodeDefs: (typeNames: string[]) => void;

  addNode: (params: AddNodeParams) => void;
  removeNode: (nodeId: string) => void;

  updateNodeState: (nodeId: string, newState: Partial<NodeState>) => void;
  updateWidgetState: UpdateWidgetState;
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

  nodeComponents: {},

  // This will overwrite old node-definitions of the same name
  addNodeDefs: (defs: NodeDefinitions) => {
    const updateWidgetState = get().updateWidgetState;

    set((state) => {
      const newComponents = Object.entries(defs).reduce((acc, [type, def]) => {
        acc[type] = createNodeComponentFromDef(def, updateWidgetState);
        return acc;
      }, {} as NodeComponents);

      return {
        nodeDefs: { ...state.nodeDefs, ...defs },
        nodeComponents: { ...state.nodeComponents, ...newComponents }
      };
    });
  },

  removeNodeDefs: (typeNames: string[]) => {
    set((state) => {
      const updatedNodeDefs = { ...state.nodeDefs };
      const updatedNodeComponents = { ...state.nodeComponents };

      typeNames.forEach((typeName) => {
        delete updatedNodeDefs[typeName];
        delete updatedNodeComponents[typeName];
      });

      return { nodeDefs: updatedNodeDefs, nodeComponents: updatedNodeComponents };
    });
  },

  addNode: ({ type, position, inputWidgetValues }: AddNodeParams) => {
    const def = get().nodeDefs[type];
    if (!def) {
      throw new Error(`Node type ${type} does not exist`);
    }

    const data = initialNodeState(def, inputWidgetValues);

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

  updateWidgetState: (nodeId, widgetLabel, newState) =>
    set((state) => {
      const nodeIndex = state.nodes.findIndex((n) => n.id === nodeId);
      if (nodeIndex === -1) return state; // No update possible

      const nodesCopy = [...state.nodes];
      const nodeCopy = { ...nodesCopy[nodeIndex] };
      const inputWidgetsCopy = { ...nodeCopy.data.inputWidgets };

      let widgetState = inputWidgetsCopy[widgetLabel];
      if (!widgetState) return state; // No update possible

      // Note that edgeType can be changed at runtime
      widgetState = { ...widgetState, ...(newState as typeof widgetState) };

      // Edge Type cannot be changed
      //   if (isSameEdgeType(widgetState, newState)) {
      //     widgetState = { ...widgetState, ...(newState as typeof widgetState) };
      //   } else {
      //     console.error(
      //       `Mismatched edgeType. ${widgetState.edgeType} cannot merge with ${newState.edgeType}`
      //     );
      //   }

      nodeCopy.data.inputWidgets = inputWidgetsCopy;
      nodesCopy[nodeIndex] = nodeCopy;

      return { nodes: nodesCopy };
    })
}));

// function isSameEdgeType(stateA: WidgetState, stateB: Partial<WidgetState>): boolean {
//   return stateA.edgeType === stateB.edgeType;
// }
