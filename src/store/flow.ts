import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  getConnectedEdges,
  Node,
  NodeChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  ReactFlowInstance
} from 'reactflow';
import { create } from 'zustand';
import {
  AddNodeParams,
  EdgeComponents,
  EdgeType,
  KeyboardHandler,
  NodeDefinitions,
  NodeState,
  NodeTypes as NodeComponents,
  UpdateWidgetState,
  UpdateWidgetStateParams,
  WidgetState
} from '../lib/types';
import { computeInitialNodeState, exchangeInputForWidget } from '../lib/utils/node';
import { createNodeComponentFromDef } from '../components/prototypes/NodeTemplate';
import {
  DEFAULT_HOTKEYS_HANDLERS,
  DEFAULT_SHORTCUT_KEYS,
  HANDLE_ID_DELIMITER,
  HANDLE_TYPES
} from '../lib/config/constants';
import { createEdgeFromTemplate } from '../components/prototypes/EdgeTemplate';
import { yjsProvider } from '../yjs';

const nodesMap = yjsProvider.doc.getMap<Node<NodeState>>('nodes');
const edgesMap = yjsProvider.doc.getMap<Edge>('edges');
const awareness = yjsProvider.awareness; // TO DO: use for cusor location

type NodeCallbackType = 'afterQueued';

export type RFState = {
  execution: {
    currentNodeId: string | null;
    progress: { value: number; max: number } | null;
    output: Record<string, any>;
  };

  setExecutionOutput: (output: Record<string, any>) => void;
  setCurrentExecutionNodeId: (nodeId: string | null) => void;
  setExecutionProgress: (value: number | null, max?: number) => void;

  instance: ReactFlowInstance | null;

  panOnDrag: boolean;
  setPanOnDrag: (panOnDrag: boolean) => void;

  nodes: Node<NodeState>[];
  edges: Edge[];
  setNodes: (nodes: React.SetStateAction<Node<NodeState>[]>) => void;
  setEdges: (edges: React.SetStateAction<Edge[]>) => void;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  nodeDefs: NodeDefinitions;
  nodeComponents: NodeComponents;
  addNodeDefs: (defs: NodeDefinitions) => void;
  removeNodeDefs: (typeNames: string[]) => void;

  addNode: (params: AddNodeParams) => void;
  removeNode: (nodeId: string) => void;
  addRawNode: (node: Node) => void;

  updateNodeState: (nodeId: string, newState: Partial<NodeState>) => void;
  updateWidgetState: UpdateWidgetState;

  hotKeysShortcut: string[];
  addHotKeysShortcut: (keys: string[]) => void;

  hotKeysHandlers: Record<string, KeyboardHandler>;
  addHotKeysHandlers: (handler: Record<string, KeyboardHandler>) => void;

  currentConnectionLineType?: string;
  setCurrentConnectionLineType: (type: string) => void;

  edgeComponents: EdgeComponents;
  registerEdgeType: (defs: EdgeType[]) => void;

  destroy: () => void;

  nodeCallbacks: {
    [key in NodeCallbackType]?: (node: Node<NodeState>, ...v: any[]) => any;
  };
  registerNodeCallback: (
    type: NodeCallbackType,
    value: (node: Node<NodeState>, ...v: any[]) => any
  ) => void;

  setInstance: (instance: ReactFlowInstance) => void;
};

export const useFlowStore = create<RFState>((set, get) => {
  // Propagate changes from Yjs doc -> our Zustand state
  const yjsNodesObserver = () => {
    set({ nodes: Array.from(nodesMap.values()) });
  };
  yjsNodesObserver();
  nodesMap.observe(yjsNodesObserver);

  const yjsEdgesObserver = () => {
    set({ edges: Array.from(edgesMap.values()) });
  };
  yjsEdgesObserver();
  nodesMap.observe(yjsEdgesObserver);

  // TO DO: awareness update

  // === Return the store object ===
  return {
    instance: null,
    panOnDrag: true,
    setPanOnDrag: (panOnDrag) => set({ panOnDrag }),

    nodes: [],

    edges: [],

    execution: {
      currentNodeId: null,
      progress: null,
      output: {}
    },

    // This updates y.Doc state, rather than Zustand state directly
    // The yjsObserver will propagate the y.Doc update -> Zustand store
    setNodes: (nodesOrUpdater) => {
      const seen = new Set<string>();
      const next =
        typeof nodesOrUpdater === 'function'
          ? nodesOrUpdater([...nodesMap.values()])
          : nodesOrUpdater;

      for (const node of next) {
        seen.add(node.id);
        nodesMap.set(node.id, node);
      }

      for (const node of nodesMap.values()) {
        if (!seen.has(node.id)) {
          nodesMap.delete(node.id);
        }
      }
    },

    setEdges: (edgesOrUpdater) => {
      const next =
        typeof edgesOrUpdater === 'function'
          ? edgesOrUpdater([...edgesMap.values()])
          : edgesOrUpdater;

      const seen = new Set<string>();

      for (const edge of next) {
        seen.add(edge.id);
        edgesMap.set(edge.id, edge);
      }

      for (const edge of edgesMap.values()) {
        if (!seen.has(edge.id)) {
          edgesMap.delete(edge.id);
        }
      }
    },

    // This is a handler for ReactFlow to call when it wants to update state; ReactFlow
    // does not mutate state directly. We must apply it manually. We apply the changes
    // to our y.Doc, which will be propagated by yjsObserver -> this Zustand store
    onNodesChange: (changes: NodeChange[]) => {
      const nodes = Array.from(nodesMap.values());
      const nextNodes = applyNodeChanges(changes, nodes);

      for (const change of changes) {
        if (change.type === 'add' || change.type === 'reset') {
          nodesMap.set(change.item.id, change.item);
        } else if (change.type === 'remove' && nodesMap.has(change.id)) {
          const deletedNode = nodesMap.get(change.id)!;
          const connectedEdges = getConnectedEdges([deletedNode], [...edgesMap.values()]);

          nodesMap.delete(change.id);

          // Deletes any edges connected to this deleted node
          for (const edge of connectedEdges) {
            edgesMap.delete(edge.id);
          }
        } else {
          // Use the default changes `applyNodeChanges` prepared for us
          nodesMap.set(change.id, nextNodes.find((n) => n.id === change.id)!);
        }
      }
    },

    onEdgesChange: (changes: EdgeChange[]) => {
      const edges = Array.from(edgesMap.values());
      const nextEdges = applyEdgeChanges(changes, edges);

      for (const change of changes) {
        if (change.type === 'add' || change.type === 'reset') {
          edgesMap.set(change.item.id, change.item);
        } else if (change.type === 'remove' && edgesMap.has(change.id)) {
          edgesMap.delete(change.id);
        } else {
          edgesMap.set(change.id, nextEdges.find((n) => n.id === change.id)!);
        }
      }
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

      const newEdge = {
        ...connection,
        type: sourceParts[2] === targetParts[2] ? sourceParts[2] : undefined
      };
      get().setEdges(addEdge(newEdge, filterEdges));
    },

    nodeDefs: {},

    nodeComponents: {},

    edgeComponents: {},

    nodeCallbacks: {},

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
      const newNode: Node<NodeState> = { id, type, position, data };

      nodesMap.set(id, newNode);
    },

    addRawNode: (node: Node<NodeState>) => nodesMap.set(node.id, node),
    removeNode: (nodeId: string) => {
      nodesMap.delete(nodeId);
      const edges = edgesMap.values();
      for (const edge of edges) {
        if (edge.source === nodeId || edge.target === nodeId) {
          edgesMap.delete(edge.id);
        }
      }
    },

    updateNodeState: (nodeId: string, newState: Partial<NodeState>) => {
      const node = nodesMap.get(nodeId);
      if (!node) return;

      nodesMap.set(nodeId, {
        ...node,
        data: { ...node.data, ...newState }
      });
    },

    updateWidgetState: ({ nodeId, name, data }: UpdateWidgetStateParams) => {
      const node = nodesMap.get(nodeId);
      if (!node) {
        console.error(`Node ${nodeId} not found`);
        return;
      }

      const widget = node.data.widgets[name];
      if (!widget) {
        console.error(`Widget '${name}' not found in node '${nodeId}'.`);
        return;
      }

      // Update the widgets, but keep the widget type the same
      const updatedWidgets = {
        ...node.data.widgets,
        [name]: {
          ...widget,
          ...(data as WidgetState),
          type: widget.type
        }
      } as Record<string, WidgetState>;

      nodesMap.set(nodeId, {
        ...node,
        data: {
          ...node.data,
          widgets: updatedWidgets
        }
      });
    },

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
    },

    // Cleanup function
    destroy: () => {
      nodesMap.unobserve(yjsNodesObserver);
      edgesMap.unobserve(yjsEdgesObserver);
    },

    registerNodeCallback: (type, value) => {
      set((state) => {
        return {
          nodeCallbacks: {
            ...state.nodeCallbacks,
            [type]: value
          }
        };
      });
    },

    setInstance: (instance) => {
      set({ instance });
    },

    setCurrentExecutionNodeId: (nodeId) => {
      set((state) => ({
        execution: {
          ...state.execution,
          currentNodeId: nodeId
        }
      }));
    },

    setExecutionProgress(value, max) {
      set((state) => ({
        execution: {
          ...state.execution,
          progress:
            value === null
              ? null
              : {
                  value,
                  max: max ?? 0
                }
        }
      }));
    },

    setExecutionOutput: (output) => {
      set((state) => ({
        execution: {
          ...state.execution,
          output
        }
      }));
    }
  };
});
