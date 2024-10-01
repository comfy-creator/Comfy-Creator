import { ReactNode, createContext, useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';
import { createUseContextHook } from './hookCreator';
import { IGraphData, IGraphSnapshot, Database } from '../store/database';
import { outputNodeTypesName } from '../config/constants';
import { RFState, useFlowStore } from '../store/flow';
import { uuidv4 } from 'lib0/random.js';
import { NodeData } from '../types/types';
import { useLiveQuery } from 'dexie-react-hooks';

interface IGraphContext {
   selectGraph: (index: string) => void;
   addNewGraph: (
      label: string,
      options?: { nodes: Node<NodeData>[]; edges: Edge[] },
      selectGraph?: boolean,
      fromSnapshot?: boolean
   ) => void;
   removeGraph: (index: string) => void;
   renameGraph: (index: string, label: string) => void;
   graphs: IGraphData[];
   currentGraphIndex: string;
   setCurrentGraphIndex: (index: string) => void;
   snapshots: IGraphSnapshot[];
   currentSnapshotIndex: string;
   addGraphSnapshot: (index: string) => void;
   removeGraphSnapshot: (index: string) => void;
   selectGraphSnapshot: (index: string) => void;
   generateworkflowName: (nodes: Node<NodeData>[]) => void;
}

const selector = (state: RFState) => ({
   setNodes: state.setNodes,
   setEdges: state.setEdges,
   nodes: state.nodes,
   edges: state.edges
});

export const GraphContextProvider: React.FC<{
   children: ReactNode;
}> = ({ children }) => {
   const graphs = useLiveQuery(() => Database.graphs.toArray()) || [];
   const snapshots = useLiveQuery(() => Database.snapshots.toArray()) || [];
   const config = useLiveQuery(() => Database.config.where({ id: 'config' }).first());

   const { setEdges, setNodes, edges, nodes } = useFlowStore(selector);

   useEffect(() => {
      selectGraph(config?.currentGraphId || '');
      selectGraphSnapshot(config?.currentSnapshotId || '');
   }, [config?.currentGraphId, config?.currentSnapshotId]);

   const setCurrentGraphIndex = async (id: string) => {
      await Database.config.update('config', { currentGraphId: id, currentSnapshotId: '' });
   };

   const selectGraph = async (id: string) => {
      const currentGraph = (graphs || [])?.find((graph) => graph.id === id) || graphs?.[0];
      if (currentGraph) {
         await Database.config
            .update('config', { currentGraphId: id, currentSnapshotId: '' })
            .then(() => {
               setEdges(currentGraph?.edges || []);
               setNodes(currentGraph?.nodes || []);
            });
      }
   };

   const addNewGraph = async (
      label: string,
      options?: { nodes: Node<NodeData>[]; edges: Edge[] },
      selectGraph: boolean = true,
      fromSnapshot: boolean = false
   ) => {
      if (fromSnapshot && !config?.currentSnapshotId) {
         const currentSnapshot = snapshots.find(
            (snapshot) => snapshot.id === config?.currentSnapshotId
         );
         label = currentSnapshot?.label || `Graph - ${graphs.length + 1}`;
      }

      const newGraph: IGraphData = {
         id: uuidv4(),
         label: label ? label : `Graph - ${graphs.length + 1}`,
         nodes: options?.nodes || [],
         edges: options?.edges || []
      };

      await Database.graphs.add(newGraph);

      // select graph
      if (selectGraph) {
         await Database.config.update('config', {
            currentGraphId: newGraph.id,
            currentSnapshotId: ''
         });
      }
   };

   const removeGraph = async (index: string) => {
      const newGraphs = graphs.filter((graph) => graph.id !== index);
      const lastGraph = newGraphs[newGraphs.length - 1];
      // save to state
      await Database.graphs.delete(index);
      if (!config?.currentSnapshotId && lastGraph) {
         setCurrentGraphIndex(lastGraph ? lastGraph.id : '');
      } else if (!config?.currentSnapshotId && !lastGraph) {
         addNewGraph('Default', undefined, true);
      } else if (config?.currentSnapshotId && !lastGraph) {
         addNewGraph('Default', undefined, false);
      }
   };

   const renameGraph = async (index: string, label: string) => {
      await Database.graphs.update(index, { label });
   };

   //   Snapshot
   const setCurrentGraphSnapshotIndex = async (index: string) => {
      await Database.config.update('config', { currentSnapshotId: index, currentGraphId: '' });
   };

   const addGraphSnapshot = async (id: string) => {
      const currentGraph = graphs.find((graph) => graph.id === config?.currentGraphId);

      const snapshot: IGraphSnapshot = {
         id,
         label: currentGraph?.label ?? 'Snapshot',
         nodes,
         edges
      };

      await Database.snapshots.add(snapshot);
   };

   const removeGraphSnapshot = async (index: string) => {
      if (index === config?.currentSnapshotId) {
         await Database.config.update('config', { currentSnapshotId: '' });
      }

      await Database.snapshots.delete(index);
   };

   const selectGraphSnapshot = async (index: string) => {
      const snapshot = snapshots.find((snap) => snap.id === index);

      if (snapshot) {
         setEdges(snapshot?.edges || []);
         setNodes(snapshot?.nodes || []);
         setCurrentGraphSnapshotIndex(index);
         setCurrentGraphIndex('');
      }
   };

   const generateworkflowName = (nodes: Node<NodeData>[]) => {
      const array: string[] = [];
      if (nodes.length === 0) return 'blank';
      for (const node of nodes) {
         const outputs = Object.keys(node.data.outputs);
         array.push(...outputs);
      }

      const mostFrequent = (arr: Array<any>, mapFn = (x: any) => x) =>
         [
            ...arr.reduce((a, v) => {
               const k = mapFn(v);
               a.set(k, (a.get(k) ?? 0) + 1);
               return a;
            }, new Map())
         ].reduce((a, v) => (v[1] >= a[1] ? v : a), [null, 0])[0];

      const name: string = mostFrequent(array);

      const suggestedName = outputNodeTypesName[name as keyof typeof outputNodeTypesName];

      return suggestedName;
   };

   return (
      <GraphContext.Provider
         value={{
            selectGraph,
            addNewGraph,
            removeGraph,
            renameGraph,
            graphs,
            snapshots,
            currentGraphIndex: config?.currentGraphId || '',
            currentSnapshotIndex: config?.currentSnapshotId || '',
            setCurrentGraphIndex,
            addGraphSnapshot,
            removeGraphSnapshot,
            selectGraphSnapshot,
            generateworkflowName
         }}
      >
         {children}
      </GraphContext.Provider>
   );
};

const GraphContext = createContext<IGraphContext | undefined>(undefined);

export const useGraphContext = createUseContextHook(
   GraphContext,
   'useGraphContext must be used within a GraphContextProvider'
);