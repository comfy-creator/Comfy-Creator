import { Edge, Node, useReactFlow } from '@xyflow/react';
import { AppNode, NodeData } from '../types/types';
import { RFState, useFlowStore } from '../store/flow';
import { useLogging } from '../contexts/logging';
import { computeInitialNodeData, isWidgetType } from '../utils/node';
import { Database, IGraphData } from '../store/database';
import { useGraphContext } from '../contexts/graph';

const selector = (state: RFState) => ({
   edges: state.edges,
   nodes: state.nodes,
   setNodes: state.setNodes,
   setEdges: state.setEdges,
   nodeDefs: state.nodeDefs
});

export function useGraph() {
   const { setCurrentGraphIndex, currentGraphIndex, graphs } = useGraphContext();

   const { nodeDefs, nodes, edges, setEdges, setNodes } = useFlowStore(selector);
   const { setViewport, toObject } = useReactFlow<AppNode, Edge>();

   const { log } = useLogging();

   const recomputeNodes = (nodes: Node<NodeData>[]) => {
      return nodes.map((node) => {
         if (!node.type) return node;

         const def = nodeDefs[node.type];
         const { inputs } = node.data;
         const values: Record<string, any> = {};

         if (!def) return node;

         const widgets = Object.values(inputs).filter((input) => isWidgetType(input.edge_type));

         for (const name in widgets) {
            const widget = widgets[name];
            if (!('value' in widget)) continue;

            values[name] = widget.value;
         }

         return {
            ...node,
            data: {
               ...node.data,
               ...computeInitialNodeData(def)
            }
         };
      });
   };

   const loadSerializedGraph = async (
      _graph?: IGraphData,
      loadSerializeOrDefault: boolean = false
   ) => {
      try {
         // if load serialize, it means we are only loading the graphs
         // (meanwhile, it's only 1 graph wrapped in array) into the current graph
         if (loadSerializeOrDefault && _graph) {
            const newNodes = [...(_graph?.nodes || [])];
            const newEdges = [...edges, ...(_graph?.edges || [])];

            await Database.graphs.update(currentGraphIndex, {
               nodes: newNodes,
               edges: newEdges
            });

            setNodes(newNodes);
            setEdges(newEdges);
            setCurrentGraphIndex(currentGraphIndex);
         } else {
            const graph = graphs.find((graph) => graph.id === currentGraphIndex);
            if (graph) {
               setNodes(graph?.nodes || []);
               setEdges(graph?.edges || []);
            }
         }

         const viewport = { x: 0, y: 0, zoom: 1 };
         setViewport(viewport);
      } catch (e) {
         log('Error loading graphs', e);
         console.log('Error loading graphs: ', e);
      }
   };

   return {
      loadSerializedGraph
   };
}