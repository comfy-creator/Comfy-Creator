import { Node, ReactFlowJsonObject, useReactFlow } from 'reactflow';
import { NodeState } from '../types.ts';
import { FLOW_KEY } from '../config/constants.ts';
import { defaultEdges, defaultNodes } from '../../default-flow.ts';
import { RFState, useFlowStore } from '../../store/flow.ts';
import { useLogging } from '../../contexts/logging.tsx';
import { computeInitialNodeState } from '../utils/node.ts';
import { ComfyLocalStorage } from '../localStorage.ts';

const selector = (state: RFState) => ({
  nodeDefs: state.nodeDefs,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  instance: state.instance
});

export function useFlow() {
  const { instance, nodeDefs, setNodes, setEdges } = useFlowStore(selector);
  const { setViewport } = useReactFlow<NodeState, string>();

  const { log } = useLogging();

  const recomputeNodes = (nodes: Node<NodeState>[]) => {
    return nodes.map((node) => {
      if (!node.type) return node;

      // Check the node def
      const def = nodeDefs[node.type];
      if (!def) return node;

      const { config, widgets } = node.data;
      const values: Record<string, string | number | boolean | undefined> = {};

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

  const loadFlow = (flow?: ReactFlowJsonObject<NodeState>) => {
    try {
      if (!flow) {
        flow = JSON.parse(
          ComfyLocalStorage.getItem(FLOW_KEY) as string
        ) as ReactFlowJsonObject<NodeState>;
      }

      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      const nodes = recomputeNodes(flow.nodes);

      setNodes(nodes.length > 0 ? nodes : defaultNodes);
      setEdges(flow.edges?.length > 0 ? flow.edges : defaultEdges);
      setViewport({ x, y, zoom });
    } catch (e) {
      log('Error loading flow', e);
      console.log('Error loading flow: ', e);
    }
  };

  const saveFlow = (flow?: ReactFlowJsonObject) => {
    if (!flow) {
      flow = instance?.toObject();
    }

    ComfyLocalStorage.setItem(FLOW_KEY, JSON.stringify(flow));
  };

  return {
    loadFlow,
    saveFlow
  };
}
