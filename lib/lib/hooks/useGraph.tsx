import { Node, ReactFlowJsonObject, useReactFlow, Viewport } from 'reactflow';
import { NodeData } from '../types.ts';
import { FLOW_KEY } from '../config/constants.ts';
import { RFState, useFlowStore } from '../../store/flow.ts';
import { useLogging } from '../../contexts/logging.tsx';
import { computeInitialNodeData, isWidgetType } from '../utils/node.ts';

const selector = (state: RFState) => ({
  nodeDefs: state.nodeDefs,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  instance: state.instance
});

export function useGraph() {
  const { instance, nodeDefs, setNodes, setEdges } = useFlowStore(selector);
  const { setViewport } = useReactFlow<NodeData, string>();

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

  const loadSerializedGraph = (
    flow?: Omit<ReactFlowJsonObject<NodeData>, 'viewport'> & { viewport?: Viewport }
  ) => {
    try {
      if (!flow) {
        flow = JSON.parse(
          localStorage.getItem(FLOW_KEY) as string
        ) as ReactFlowJsonObject<NodeData>;
      }

      if (!flow.nodes?.length) throw new Error('No nodes found in flow');
      if (!flow.edges?.length) throw new Error('No edges found in flow');

      let viewport = flow.viewport;
      if (!viewport) viewport = { x: 0, y: 0, zoom: 1 };

      const nodes = recomputeNodes(flow.nodes);

      setNodes(nodes);
      setEdges(flow.edges);
      setViewport(viewport);
    } catch (e) {
      log('Error loading flow', e);
      console.log('Error loading flow: ', e);
    }
  };

  const saveSerializedGraph = (flow?: ReactFlowJsonObject) => {
    if (!flow) {
      flow = instance?.toObject();
    }

    localStorage.setItem(FLOW_KEY, JSON.stringify(flow));
  };

  return {
    loadSerializedGraph,
    saveSerializedGraph
  };
}
