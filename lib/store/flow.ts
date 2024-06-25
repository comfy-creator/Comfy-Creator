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
} from 'reactflow';
import { create } from 'zustand';
import {
  AddNodeParams,
  EdgeComponents,
  EdgeType,
  ExecutionState,
  HandleEdge,
  InputData,
  KeyboardHandler,
  NodeData,
  NodeDefinitions,
  NodeTypes as NodeComponents,
  OutputData,
  UpdateInputData,
  UpdateInputDataParams,
  UpdateOutputData,
  UpdateOutputDataParams
} from '../types/types';
import {
  addWidgetToPrimitiveNode,
  computeInitialNodeData,
  disconnectPrimitiveNode,
  getHandleName,
  isPrimitiveNode,
  isWidgetType
} from '../utils/node';
import { createNodeComponentFromDef } from '../components/prototypes/NodeTemplate';
import {
  CURRENT_GRAPH_INDEX,
  DEFAULT_HOTKEYS_HANDLERS,
  DEFAULT_SHORTCUT_KEYS,
  GRAPHS_KEY,
  HANDLE_TYPES
} from '../config/constants';
import { createEdgeFromTemplate } from '../components/prototypes/EdgeTemplate';
import { yjsProvider } from '../yjs';
import {
  FilePicker,
  PreviewImage,
  PreviewVideo,
  PrimitiveNode,
  RerouteNode,
  transformNodeDefs
} from '../utils/nodedefs';
import { ComfyObjectInfo } from '../types/comfy';
import DB, { IGraphData } from './database';

const nodesMap = yjsProvider.doc.getMap<Node<NodeData>>('nodes');
const edgesMap = yjsProvider.doc.getMap<Edge>('edges');
const awareness = yjsProvider.awareness; // TO DO: use for cusor location

type NodeCallbackType = 'afterQueued';

export interface IGraphSnapshot {
  index: string;
  nodes: Node<NodeData>[];
  edges: Edge[];
}

export type RFState = {
  executions: ExecutionState[];

  setExecutionOutput: (executionId: string, output: Record<string, any>) => void;
  setCurrentExecutionNodeId: (executionId: string, nodeId: string | null) => void;
  setExecutionProgress: (executionId: string, value: number | null, max?: number) => void;

  panOnDrag: boolean;
  setPanOnDrag: (panOnDrag: boolean) => void;

  nodes: Node<NodeData>[];
  edges: Edge[];
  setNodes: (nodes: React.SetStateAction<Node<NodeData>[]>, selectGraph?: boolean) => void;
  setEdges: (edges: React.SetStateAction<Edge[]>, selectGraph?: boolean) => void;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  nodeDefs: NodeDefinitions;
  nodeComponents: NodeComponents;
  addNodeDefs: (defs: NodeDefinitions) => void;
  loadNodeDefsFromApi: (fetcher: () => Promise<Record<string, ComfyObjectInfo>>) => void;
  removeNodeDefs: (typeNames: string[]) => void;

  addNode: (params: AddNodeParams) => string;
  removeNode: (nodeId: string) => void;
  addRawNode: (node: Node) => void;

  updateNodeData: (nodeId: string, newState: Partial<NodeData>) => void;
  updateInputData: UpdateInputData;
  updateOutputData: UpdateOutputData;

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
    [key in NodeCallbackType]?: (node: Node<NodeData>, ...v: any[]) => any;
  };
  registerNodeCallback: (
    type: NodeCallbackType,
    value: (node: Node<NodeData>, ...v: any[]) => any
  ) => void;

  isUpdatingEdge: boolean;
  setIsUpdatingEdge: (isUpdatingEdge: boolean) => void;

  currentHandleEdge: HandleEdge | null;
  setCurrentHandleEdge: (edge: HandleEdge | null) => void;
};

export const useFlowStore = create<RFState>((set, get) => {
  // Propagate changes from Yjs doc -> our Zustand state
  const yjsNodesObserver = () => {
    // console.log(Array.from(nodesMap.values()));
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
    panOnDrag: true,
    setPanOnDrag: (panOnDrag) => set({ panOnDrag }),

    nodes: [],

    edges: [],

    executions: [],

    isUpdatingEdge: false,
    currentHandleEdge: null,

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

      // save to db
      DB.getItem(GRAPHS_KEY).then(async (res) => {
        const currentGraphIndex = ((await DB.getItem(CURRENT_GRAPH_INDEX)) as string) || '';
        const fetchedGraphs = (res || []) as IGraphData[];

        const graphs = fetchedGraphs.map((graph) => {
          if (currentGraphIndex === graph.index) {
            console.log('Caught hfhfg in node');

            return {
              ...graph,
              nodes: [...nodesMap.values()],
              edges: [...edgesMap.values()]
            };
          } else {
            return graph;
          }
        });
        // save to DB
        DB.setItem(GRAPHS_KEY, graphs);
      });
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

      // save to db
      DB.getItem(GRAPHS_KEY).then(async (res) => {
        const currentGraphIndex = ((await DB.getItem(CURRENT_GRAPH_INDEX)) as string) || '';
        const fetchedGraphs = (res || []) as IGraphData[];

        const graphs = fetchedGraphs.map((graph) => {
          if (currentGraphIndex === graph.index) {
            return {
              ...graph,
              nodes: [...nodesMap.values()],
              edges: [...edgesMap.values()]
            };
          } else {
            return graph;
          }
        });
        // save to DB
        DB.setItem(GRAPHS_KEY, graphs);
      });
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

      // save to db
      DB.getItem(GRAPHS_KEY).then(async (res) => {
        const currentGraphIndex = ((await DB.getItem(CURRENT_GRAPH_INDEX)) as string) || '';
        const fetchedGraphs = (res || []) as IGraphData[];

        const graphs = fetchedGraphs.map((graph) => {
          if (currentGraphIndex === graph.index) {
            return {
              ...graph,
              nodes: [...nodesMap.values()],
              edges: [...edgesMap.values()]
            };
          } else {
            return graph;
          }
        });
        // save to DB
        DB.setItem(GRAPHS_KEY, graphs);
      });
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

      // save to db
      DB.getItem(GRAPHS_KEY).then(async (res) => {
        const currentGraphIndex = ((await DB.getItem(CURRENT_GRAPH_INDEX)) as string) || '';
        const fetchedGraphs = (res || []) as IGraphData[];

        const graphs = fetchedGraphs.map((graph) => {
          if (currentGraphIndex === graph.index) {
            return {
              ...graph,
              nodes: [...nodesMap.values()],
              edges: [...edgesMap.values()]
            };
          } else {
            return graph;
          }
        });
        // save to DB
        DB.setItem(GRAPHS_KEY, graphs);
      });
    },

    onConnect: (connection: Connection) => {
      const filterEdges = get().edges.filter(
        (edge) =>
          !(edge.target === connection.target && edge.targetHandle === connection.targetHandle)
      );

      const { targetHandle, sourceHandle, source: sourceNodeId, target: targetNodeId } = connection;
      const source = get().nodes.find((node) => node.id == sourceNodeId);
      const target = get().nodes.find((node) => node.id == targetNodeId);

      if (!source || !target || !sourceHandle || !targetHandle) return;
      const _sourceHandle = source.data.outputs[getHandleName(sourceHandle)];
      const _targetHandle = target.data.inputs[getHandleName(targetHandle)];

      let newConn: (Connection & { type?: string }) | undefined;

      if (isWidgetType(_targetHandle.type)) {
        if (source.type == 'PrimitiveNode') {
          if (!targetNodeId) return;

          const widgetData = { nodeId: targetNodeId, widgetName: getHandleName(targetHandle) };
          const result = addWidgetToPrimitiveNode(source.id, get().updateNodeData, widgetData);

          if (result) {
            newConn = {
              ...connection,
              type: result.type
            };
          }
        }
      } else {
        newConn = {
          ...connection,
          type: _sourceHandle.type === _targetHandle.type ? _sourceHandle.type : undefined
        };
      }

      if (newConn) {
        const { updateInputData, updateOutputData, setEdges } = get();

        updateInputData({
          nodeId: target.id,
          name: _targetHandle.name,
          data: { isConnected: true }
        });

        updateOutputData({
          nodeId: source.id,
          name: _sourceHandle.name,
          data: { isConnected: true }
        });

        setEdges(addEdge(newConn, filterEdges));
      }
    },

    nodeDefs: {},

    nodeComponents: {},

    edgeComponents: {},

    nodeCallbacks: {},

    // This will overwrite old node-definitions of the same name
    addNodeDefs: (defs: NodeDefinitions) => {
      const { updateInputData } = get();

      set((state) => {
        const components = Object.entries(defs).reduce((components, [type, def]) => {
          components[type] = createNodeComponentFromDef(def, updateInputData);
          return components;
        }, {} as NodeComponents);

        return {
          nodeDefs: { ...state.nodeDefs, ...defs },
          nodeComponents: { ...state.nodeComponents, ...components }
        };
      });
    },

    loadNodeDefsFromApi: async (fetcher) => {
      const nodes = transformNodeDefs(await fetcher());
      const allNodeDefs = {
        PreviewImage,
        PreviewVideo,
        RerouteNode,
        PrimitiveNode,
        FilePicker,
        ...nodes
      };
      get().addNodeDefs(allNodeDefs);
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

    addNode: ({ type, position, width = 210, defaultValues = {} }: AddNodeParams) => {
      const def = get().nodeDefs[type];
      if (!def) {
        throw new Error(`Node type ${type} does not exist`);
      }

      const id = crypto.randomUUID();
      const data = computeInitialNodeData(def, defaultValues);
      const newNode: Node<NodeData> = {
        id,
        type,
        data,
        position,
        style: { width: `${width}px` }
      };
      nodesMap.set(id, newNode);

      return id;
    },

    addRawNode: (node: Node<NodeData>) => nodesMap.set(node.id, node),
    removeNode: (nodeId: string) => {
      const node = nodesMap.get(nodeId);
      if (!node) return;

      if (isPrimitiveNode(node)) {
        disconnectPrimitiveNode(node.id);
      }

      nodesMap.delete(nodeId);
      const edges = edgesMap.values();
      for (const edge of edges) {
        if (edge.source === nodeId || edge.target === nodeId) {
          edgesMap.delete(edge.id);
        }
      }
    },

    updateNodeData: (nodeId: string, newState: Partial<NodeData>) => {
      const node = nodesMap.get(nodeId);
      if (!node) return;

      nodesMap.set(nodeId, {
        ...node,
        data: {
          ...node.data,
          ...newState
        }
      });
    },

    updateInputData: ({ nodeId, name, data }: UpdateInputDataParams) => {
      const node = nodesMap.get(nodeId);
      if (!node) {
        console.error(`Node ${nodeId} not found`);
        return;
      }

      const input = node.data.inputs[name];
      if (!input) {
        console.error(`Input '${name}' not found in node '${nodeId}'.`);
        return;
      }

      const { type, ...oldData } = input;
      const newInput = { ...oldData, ...data, type } as InputData;

      if (isPrimitiveNode(node) && node.data.targetNodeId) {
        const targetNode = nodesMap.get(node.data.targetNodeId);

        if (targetNode) {
          const targetInput = targetNode.data.inputs[name];
          if (targetInput) {
            nodesMap.set(targetNode.id, {
              ...targetNode,
              data: {
                ...targetNode.data,
                inputs: {
                  ...targetNode.data.inputs,
                  [name]: {
                    ...targetNode.data.inputs[name],
                    value: newInput.value
                  }
                }
              }
            });
          }
        }
      }

      nodesMap.set(nodeId, {
        ...node,
        data: {
          ...node.data,
          inputs: {
            ...node.data.inputs,
            [name]: newInput
          }
        }
      });
    },

    updateOutputData: ({ nodeId, name, data }: UpdateOutputDataParams) => {
      const node = nodesMap.get(nodeId);
      if (!node) {
        console.error(`Node ${nodeId} not found`);
        return;
      }

      const output = node.data.outputs[name];
      if (!output) {
        console.error(`Output '${name}' not found in node '${nodeId}'.`);
        return;
      }

      const { type, ...oldData } = output;
      const newOutput = { ...oldData, ...data, type } as OutputData;
      console.log(newOutput);

      nodesMap.set(nodeId, {
        ...node,
        data: {
          ...node.data,
          outputs: {
            ...node.data.outputs,
            [name]: newOutput
          }
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

    setCurrentExecutionNodeId: (executionId, nodeId) => {
      set((state) => {
        const executions = state.executions.map((execution) =>
          execution.id === executionId ? { ...execution, currentNodeId: nodeId } : execution
        );

        return { ...state, executions };
      });
    },

    setExecutionProgress: (executionId, value, max) => {
      set((state) => {
        const executions = state.executions.map((execution) =>
          execution.id === executionId
            ? {
                ...execution,
                progress: value === null ? null : { value, max: max ?? 0 }
              }
            : execution
        );

        return { ...state, executions };
      });
    },

    setExecutionOutput: (executionId, output) => {
      set((state) => {
        const executions = state.executions.map((execution) =>
          execution.id === executionId ? { ...execution, output } : execution
        );

        return { ...state, executions };
      });
    },

    setIsUpdatingEdge: (isUpdatingEdge) => {
      set({ isUpdatingEdge });
    },

    setCurrentHandleEdge: (handleEdge) => {
      set({ currentHandleEdge: handleEdge });
    }
  };
});
