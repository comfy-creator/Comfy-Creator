import { useEffect, useState } from 'react';
import { Node, useReactFlow } from 'reactflow';
import { NodeData } from '../types/types';
import { CURRENT_GRAPH_INDEX, GRAPHS_KEY } from '../config/constants';
import { RFState, useFlowStore } from '../store/flow';
import { useLogging } from '../contexts/logging';
import { computeInitialNodeData, isWidgetType } from '../utils/node';
import { uuidv4 } from 'lib0/random.js';
import DB, { IGraphData } from '../store/database';
import { useGraphContext } from '../contexts/graph';

const selector = (state: RFState) => ({
  edges: state.edges,
  nodes: state.nodes,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  nodeDefs: state.nodeDefs,
});

export function useGraph() {
  const { setGraphs, setCurrentGraphIndex, currentStateGraphIndex } = useGraphContext();

  const { nodeDefs, nodes, edges, setEdges, setNodes } = useFlowStore(selector);
  const { setViewport, toObject } = useReactFlow<NodeData, string>();

  const { log } = useLogging();

  const recomputeNodes = (nodes: Node<NodeData>[]) => {
    return nodes.map((node) => {
      if (!node.type) return node;

      const def = nodeDefs[node.type];
      const { inputs } = node.data;
      const values: Record<string, any> = {};

      if (!def) return node;

      const widgets = Object.values(inputs).filter((input) => isWidgetType(input.type));

      for (const name in widgets) {
        const widget = widgets[name];
        if (!('value' in widget)) continue;

        values[name] = widget.value;
      }

      return {
        ...node,
        data: {
          ...node.data,
          ...computeInitialNodeData(def, values)
        }
      };
    });
  };

  const loadSerializedGraph = async (
    graphs?: IGraphData[],
    loadSerializeOrDefault: boolean = false
  ) => {
    try {
      // if load serialize, it means we are only loading the graphs
      // (meanwhile, it's only 1 graph wrapped in array) into the current graph
      const localGraphs = ((await DB.getItem(GRAPHS_KEY)) || []) as IGraphData[];
      let currentGraphIndex = (await DB.getItem(CURRENT_GRAPH_INDEX)) as string;
      if (loadSerializeOrDefault) {
        const newNodes = [...nodes, ...(graphs?.[0]?.nodes || [])];
        const newEdges = [...edges, ...(graphs?.[0]?.edges || [])];

        currentGraphIndex = currentGraphIndex ?? localGraphs?.[0]?.index;

        const newGraphs = localGraphs.map((graph) => {
          return {
            ...graph,
            nodes: graph.index === currentGraphIndex ? newNodes : graph.nodes,
            edges: graph.index === currentGraphIndex ? newEdges : graph.edges
          };
        });

        setNodes(newNodes);
        setEdges(newEdges);

        // save to db and state
        setGraphs(newGraphs);
        setCurrentGraphIndex(currentGraphIndex, newGraphs);
      } else {
        if (!graphs) {
          graphs =
            localGraphs?.length > 0
              ? localGraphs
              : [
                  {
                    index: uuidv4(),
                    label: 'Default',
                    nodes: [],
                    edges: []
                  }
                ];
        }

        const newGraphs = graphs.map((graph) => {
          // if (!graph.nodes?.length) throw new Error(`No nodes found in graph at index ${index}`);
          // if (!graph.edges?.length) throw new Error(`No edges found in graph at index ${index}`);

          const nodes = recomputeNodes(graph?.nodes || []);
          return {
            index: graph.index,
            label: graph.label,
            nodes,
            edges: graph.edges || []
          };
        });

        currentGraphIndex = currentGraphIndex ?? newGraphs[0]?.index;

        // save to db and state
        setGraphs(newGraphs);
        setCurrentGraphIndex(currentGraphIndex, newGraphs);
      }

      const viewport = { x: 0, y: 0, zoom: 1 };
      setViewport(viewport);
    } catch (e) {
      log('Error loading graphs', e);
      console.log('Error loading graphs: ', e);
    }
  };

  const saveSerializedGraph = (graphs?: IGraphData[]) => {
    let currentGraphIndex = currentStateGraphIndex;
    if (!graphs) {
      const flow = toObject();
      currentGraphIndex = currentGraphIndex ?? uuidv4();

      graphs = [
        {
          index: currentGraphIndex,
          label: 'Default',
          nodes: flow?.nodes || [],
          edges: flow?.edges || []
        }
      ];
    }

    // save to db and state
    setGraphs(graphs);
    setCurrentGraphIndex(currentGraphIndex, graphs);
  };

  return {
    loadSerializedGraph,
    saveSerializedGraph
  };
}
