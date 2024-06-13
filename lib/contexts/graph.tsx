import { ReactNode, createContext, useEffect, useState } from 'react';
import { Node, Edge } from 'reactflow';
import { createUseContextHook } from './hookCreator';
import DB, { IGraphData, IGraphRun } from '../store/database';
import {
  CURRENT_GRAPH_INDEX,
  CURRENT_SNAPSHOT_INDEX,
  GRAPHS_KEY,
  SNAPSHOT_KEY,
  outputNodeTypesName
} from '../config/constants';
import { RFState, useFlowStore } from '../store/flow';
import { uuidv4 } from 'lib0/random.js';
import { NodeData } from '../types/types';

interface IGraphContext {
  selectGraph: (index: string) => void;
  setGraphs: (graphs: IGraphData[]) => void;
  addNewGraph: (
    label: string,
    options?: { nodes: Node<NodeData>[]; edges: Edge[] },
    selectGraph?: boolean,
    fromRun?: boolean
  ) => void;
  removeGraph: (index: string) => void;
  renameGraph: (index: string, label: string) => void;
  stateGraphs: IGraphData[];
  currentStateGraphIndex: string;
  setCurrentGraphIndex: (index: string, graphs?: IGraphData[]) => void;
  stateRuns: IGraphRun[];
  currentStateGraphRunIndex: string;
  addGraphRun: (index: string) => void;
  removeGraphRun: (index: string) => void;
  selectGraphRun: (index: string) => void;
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
  const [stateGraphs, setStateGraphs] = useState<IGraphData[]>([]);
  const [currentStateGraphIndex, setStateCurrentGraphIndex] = useState<string>('');

  const [stateRuns, setStateRuns] = useState<IGraphRun[]>([]);
  const [currentStateGraphRunIndex, setCurrentStateGraphRunIndex] = useState<string>('');

  const { setEdges, setNodes, edges, nodes } = useFlowStore(selector);

  useEffect(() => {
    DB.getItem(GRAPHS_KEY).then((res) => {
      const fetchedGraphs = (res || []) as IGraphData[];
      setStateGraphs(fetchedGraphs);

      DB.getItem(CURRENT_GRAPH_INDEX).then((res: unknown) => {
        if (res) {
          setStateCurrentGraphIndex((res as string) || '');
          selectGraph((res as string) || '');
        }
      });
    });
    DB.getItem(SNAPSHOT_KEY).then((res) => {
      const fetchedRuns = (res || []) as IGraphRun[];
      setStateRuns(fetchedRuns);

      DB.getItem(CURRENT_SNAPSHOT_INDEX).then((res) => {
        if (res) {
          setCurrentStateGraphRunIndex((res as string) || '');
          selectGraphRun((res as string) || '');
        }
      });
    });
  }, []);

  useEffect(() => {
    generateworkflowName(nodes);
  }, [nodes]);

  const setCurrentGraphIndex = async (index: string, graphs?: IGraphData[]) => {
    if (!graphs || !graphs.length) {
      graphs = ((await DB.getItem(GRAPHS_KEY)) || stateGraphs || []) as IGraphData[];
    }

    const currentGraph = graphs.find((graph) => graph.index === index);
    if (currentGraph) {
      setEdges(currentGraph?.edges || []);
      setNodes(currentGraph?.nodes || []);
    }
    // save to state
    setStateCurrentGraphIndex(index);
    // save to db
    DB.setItem(CURRENT_GRAPH_INDEX, index);
  };

  const selectGraph = async (index: string) => {
    const graphs = ((await DB.getItem(GRAPHS_KEY)) || stateGraphs || []) as IGraphData[];
    const currentGraph = graphs.find((graph) => graph.index === index) || graphs[0];
    if (currentGraph) {
      console.log('Graph>>', currentGraph);
      setEdges(currentGraph?.edges || []);
      setNodes(currentGraph?.nodes || []);

      setCurrentGraphIndex(index);

      // set run index to empty
      setCurrentGraphRunIndex('');
    }
  };

  const setGraphs = (graphs: IGraphData[]) => {
    setStateGraphs(graphs);
    DB.setItem(GRAPHS_KEY, graphs);
  };

  const addNewGraph = async (
    label: string,
    options?: { nodes: Node<NodeData>[]; edges: Edge[] },
    selectGraph: boolean = true,
    fromRun: boolean = false
  ) => {
    const graphs = ((await DB.getItem(GRAPHS_KEY)) || stateGraphs || []) as IGraphData[];

    if (fromRun) {
      const currentRun = stateRuns.find((run) => run.index === currentStateGraphRunIndex);
      label = currentRun?.label || `Graph - ${graphs.length + 1}`;
    }

    const newGraph: IGraphData = {
      index: uuidv4(),
      label: label ? label : `Graph - ${graphs.length + 1}`,
      nodes: options?.nodes || [],
      edges: options?.edges || []
    };

    setStateGraphs([...graphs, newGraph]);

    // save to db
    DB.setItem(GRAPHS_KEY, [...graphs, newGraph]);

    // select graph
    if (selectGraph) {
      setCurrentGraphIndex(newGraph.index, [...graphs, newGraph]);
      setCurrentGraphRunIndex('');
    }
  };

  const removeGraph = async (index: string) => {
    const graphs = ((await DB.getItem(GRAPHS_KEY)) || stateGraphs || []) as IGraphData[];
    const newGraphs = graphs.filter((graph) => graph.index !== index);

    console.log('Grapjs>>', newGraphs);

    const lastGraph = newGraphs[newGraphs.length - 1];

    // save to state
    if (!currentStateGraphRunIndex && lastGraph) {
      console.log('No run and last graph', currentStateGraphRunIndex, lastGraph);
      setStateGraphs(newGraphs);
      DB.setItem(GRAPHS_KEY, newGraphs);
      console.log('Extra>>', lastGraph ? lastGraph.index : '', newGraphs);
      setCurrentGraphIndex(lastGraph ? lastGraph.index : '', newGraphs);
    } else if (!currentStateGraphRunIndex && !lastGraph) {
      console.log('No run and no last graph', currentStateGraphRunIndex, lastGraph);
      addNewGraph('Default');
    } else if (currentStateGraphRunIndex && !lastGraph) {
      console.log('Run and no last graph', currentStateGraphRunIndex, lastGraph);
      addNewGraph('Default', undefined, false);
    }
  };

  const renameGraph = async (index: string, label: string) => {
    const graphs = ((await DB.getItem(GRAPHS_KEY)) || stateGraphs || []) as IGraphData[];
    const newGraphs = graphs.map((graph) => {
      if (graph.index === index) {
        return { ...graph, label };
      }
      return graph;
    });
    // save to state
    setStateGraphs(newGraphs);
    // save to db
    DB.setItem(GRAPHS_KEY, newGraphs);
  };

  //   Run
  const setCurrentGraphRunIndex = async (index: string) => {
    // save to state
    setCurrentStateGraphRunIndex(index);
    // save to db
    DB.setItem(CURRENT_SNAPSHOT_INDEX, index);
  };

  const addGraphRun = async (index: string) => {
    const runs = ((await DB.getItem(SNAPSHOT_KEY)) || stateRuns || []) as IGraphRun[];

    const currentGraph = stateGraphs.find((graph) => graph.index === currentStateGraphIndex);

    const run: IGraphRun = {
      index,
      label: currentGraph?.label ?? 'Run',
      nodes,
      edges
    };

    // save to state
    setStateRuns([...runs, run]);

    // save to db
    DB.setItem(SNAPSHOT_KEY, [...runs, run]);
  };

  const removeGraphRun = async (index: string) => {
    // TODO: find a way to save current graph state before removing run so you can return the nodes and edges
    const runs = ((await DB.getItem(SNAPSHOT_KEY)) || stateRuns || []) as IGraphRun[];

    const newRuns = runs.filter((snap) => snap.index !== index);

    if (index === currentStateGraphRunIndex) {
      setCurrentGraphRunIndex('');
      // get previous graph state and setnodes and edges
    }

    // save to state
    setStateRuns(newRuns);

    // save to db
    DB.setItem(SNAPSHOT_KEY, newRuns);
  };

  const selectGraphRun = async (index: string) => {
    const runs = ((await DB.getItem(SNAPSHOT_KEY)) || stateRuns || []) as IGraphRun[];

    const run = runs.find((snap) => snap.index === index);

    if (run) {
      setEdges(run?.edges || []);
      setNodes(run?.nodes || []);
      setCurrentGraphRunIndex(index);
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
        setGraphs,
        addNewGraph,
        removeGraph,
        renameGraph,
        stateGraphs,
        currentStateGraphIndex,
        setCurrentGraphIndex,
        stateRuns,
        currentStateGraphRunIndex,
        addGraphRun,
        removeGraphRun,
        selectGraphRun,
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
