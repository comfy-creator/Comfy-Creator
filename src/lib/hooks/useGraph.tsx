import { Node, ReactFlowJsonObject, useReactFlow, Viewport } from 'reactflow';
import { NodeState } from '../types.ts';
import { FLOW_KEY } from '../config/constants.ts';
import { RFState, useFlowStore } from '../../store/flow.ts';
import { useLogging } from '../../contexts/logging.tsx';
import { computeInitialNodeState } from '../utils/node.ts';

const selector = (state: RFState) => ({
  nodeDefs: state.nodeDefs,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  instance: state.instance
});

export function useGraph() {
  const { instance, nodeDefs, setNodes, setEdges } = useFlowStore(selector);
  const { setViewport } = useReactFlow<NodeState, string>();

  const { log } = useLogging();

  const recomputeNodes = (nodes: Node<NodeState>[]) => {
    return nodes.map((node) => {
      if (!node.type) return node;

      const def = nodeDefs[node.type];
      const { config, widgets } = node.data;
      const values: Record<string, any> = {};

      if (!def) return node;

      for (const name in widgets) {
        const widget = widgets[name];
        if (!('value' in widget)) continue;

        let value = widget.value;
        if (typeof value == 'object' && 'src' in value) {
          values[name] = value.src;
        } else {
          values[name] = value;
        }
      }

      return {
        ...node,
        data: {
          ...node.data,
          ...computeInitialNodeState(def, values, {
            ...config
          })
        }
      };
    });
  };

  const loadSerializedGraph = (
    flow?: Omit<ReactFlowJsonObject<NodeState>, 'viewport'> & { viewport?: Viewport }
  ) => {
    try {
      if (!flow) {
        flow = JSON.parse(
          localStorage.getItem(FLOW_KEY) as string
        ) as ReactFlowJsonObject<NodeState>;
      }

      if (!flow.nodes?.length) throw new Error('No nodes found in flow');
      if (!flow.edges?.length) throw new Error('No edges found in flow');

      let viewport = flow.viewport;
      if (!viewport) {
        viewport = { x: 0, y: 0, zoom: 1 };
      }

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
