import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange
} from 'reactflow';
import { create } from 'zustand';
import {
  AddNodeParams,
  EdgeComponents,
  EdgeType,
  NodeDefinitions,
  NodeState,
  NodeTypes as NodeComponents,
  UpdateWidgetState,
  UpdateWidgetStateParams,
  WidgetState
} from '../types';
import { computeInitialNodeState, exchangeInputForWidget } from '../utils/node';
import { createNodeComponentFromDef } from '../components/prototypes/NodeTemplate.tsx';
import {
  DEFAULT_HOTKEYS_HANDLERS,
  DEFAULT_SHORTCUT_KEYS,
  HANDLE_ID_DELIMITER,
  HANDLE_TYPES
} from '../config/constants.ts';
import { createEdgeFromTemplate } from '../components/prototypes/EdgeTemplate.tsx';

export type RFState = {
  nodes: Node<NodeState>[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  currentConnectionLineType?: string;

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

  hotKeysShortcut: string[];
  addHotKeysShortcut: (keys: string[]) => void;

  hotKeysHandlers: Record<string, Function>;
  addHotKeysHandlers: (handler: Record<string, Function>) => void;

  setCurrentConnectionLineType: (type: string) => void;

  edgeComponents: EdgeComponents;
  registerEdgeType: (defs: EdgeType[]) => void;
};

export const useFlowStore = create<RFState>((set, get) => ({
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
    const filterEdges = get().edges.filter(
      (edge) =>
        !(edge.target === connection.target && edge.targetHandle === connection.targetHandle)
    );

    const sourceParts = connection.sourceHandle?.split(HANDLE_ID_DELIMITER) || [];
    const targetParts = connection.targetHandle?.split(HANDLE_ID_DELIMITER) || [];

    const sourceNode = get().nodes.find((node) => node.id == connection.source);
    const targetNode = get().nodes.find((node) => node.id == connection.target);
    if (!sourceNode || !targetNode) return;

    if (sourceNode.type == 'PrimitiveNode') {
      const inputSlot = Number(targetParts[1]);
      exchangeInputForWidget({ inputSlot, sourceNode: targetNode, targetNode: sourceNode });
    } else if (targetNode.type == 'PrimitiveNode') {
      const inputSlot = Number(sourceParts[1]);
      exchangeInputForWidget({ inputSlot, sourceNode, targetNode });
    }

    // if (sourceNode.type == 'RerouteNode') {
    //   const slot = Number(targetParts[1]);
    //   addOutputTypeToNode(slot, targetNode, sourceNode);
    // } else if (targetNode.type == 'RerouteNode') {
    //   const slot = Number(sourceParts[1]);
    //   addInputTypeToNode(slot, sourceNode, targetNode);
    // }

    set({
      edges: addEdge(
        {
          ...connection,
          type: sourceParts[2] === targetParts[2] ? sourceParts[2] : undefined
        },
        filterEdges
      )
    });

    console.log({ edges: get().edges });
  },

  nodeDefs: {},

  nodeComponents: {},

  edgeComponents: {},

  // This will overwrite old node-definitions of the same name
  addNodeDefs: (defs: NodeDefinitions) => {
    const { updateWidgetState } = get();

    set((state) => {
      const components = Object.entries(defs).reduce((components, [type, def]) => {
        components[type] = createNodeComponentFromDef(def, updateWidgetState);
        return components;
      }, {} as NodeComponents);

      return {
        nodeDefs: { ...state.nodeDefs, ...defs },
        nodeComponents: { ...state.nodeComponents, ...components }
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

  addNode: ({ config = {}, type, position, inputWidgetValues = {} }: AddNodeParams) => {
    const def = get().nodeDefs[type];
    if (!def) {
      throw new Error(`Node type ${type} does not exist`);
    }

    const id = crypto.randomUUID();
    const data = computeInitialNodeState(def, inputWidgetValues, config);

    const newNode = { id, type, position, data };

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

  updateWidgetState: ({ nodeId, name, newState }: UpdateWidgetStateParams) =>
    set((state) => {
      const nodeIndex = state.nodes.findIndex((n) => n.id === nodeId);
      if (nodeIndex === -1) return state; // Early return if node not found.

      const node = state.nodes[nodeIndex];
      const widgetState = node.data.widgets[name];
      if (!widgetState) {
        console.error(`Widget '${name}' not found in node '${nodeId}'.`);
        return state;
      }

      console.log('Types>>', widgetState.type, newState.type);

      if (widgetState.type !== newState.type) {
        console.error(`Mismatched type. ${widgetState.type} cannot merge with ${newState.type}`);
        return state;
      }

      // Update the widget state only if types match.
      const updatedWidgets = {
        ...node.data.widgets,
        [name]: { ...widgetState, ...(newState as WidgetState) }
      };

      const updatedNodes = state.nodes.map((n, i) =>
        i === nodeIndex
          ? {
              ...n,
              data: {
                ...n.data,
                widgets: updatedWidgets
              }
            }
          : n
      );

      return { ...state, nodes: updatedNodes };
    }),

  // hot keys state
  hotKeysShortcut: DEFAULT_SHORTCUT_KEYS,

  addHotKeysShortcut: (hotKeys) => {
    set((state) => {
      return { hotKeysShortcut: [...state.hotKeysShortcut, ...hotKeys] };
    });
  },

  hotKeysHandlers: DEFAULT_HOTKEYS_HANDLERS,

  addHotKeysHandlers: (handler) => {
    set((state) => {
      return {
        hotKeysHandlers: { ...state.hotKeysHandlers, ...handler },
        hotKeysShortcut: Array.from(new Set([...state.hotKeysShortcut, Object.keys(handler)[0]]))
      };
    });
  },

  setCurrentConnectionLineType: (type) => {
    set({ currentConnectionLineType: type });
  },

  registerEdgeType: (edge: EdgeType[]) => {
    set((state) => {
      const edgeTypes: Record<string, any> = {};
      for (const type of HANDLE_TYPES) {
        edgeTypes[type] = createEdgeFromTemplate({ type });
      }

      return {
        edgeComponents: { ...state.edgeComponents, ...edgeTypes }
      };
    });
  }
}));
