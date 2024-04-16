import { RFState, useFlowStore } from '../../../store/flow';
import { defaultEdges, defaultNodes } from '../../../default-flow';
import { computeInitialNodeState } from '../../../lib/utils/node.ts';

const selector = (state: RFState) => ({
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  nodeDefs: state.nodeDefs
});

const LoadDefaultButton = () => {
  const { setNodes, setEdges, nodeDefs } = useFlowStore(selector);

  // const loadFlow = () => {
  //   const flow: ReactFlowJsonObject<NodeState> = JSON.parse(
  //     ComfyLocalStorage.getItem(FLOW_KEY) as string
  //   );
  //
  //   if (flow) {
  //
  //
  //     setNodes(nodes.length > 0 ? nodes : defaultNodes);
  //     setEdges(flow.edges?.length > 0 ? flow.edges : defaultEdges);
  //     setViewport({ x, y, zoom });
  //   }
  // };

  const handleClick = () => {
    const value = confirm('Load default workflow?');

    if (value) {
      const nodes = defaultNodes.map((node) => {
        if (!node.type) return node;

        const { config, widgets } = node.data;
        const values: Record<
          string,
          string | number | boolean | Record<string, string> | undefined
        > = {};

        for (const name in widgets) {
          const widget = widgets[name];
          values[name] = widget.value;
        }

        console.log('Node type>', node.type, nodeDefs);

        const def = nodeDefs[node.type];
        const state = computeInitialNodeState(def, values, { ...config });

        console.log({ state, data: node.data });
        return { ...node, data: { ...node.data, ...state } };
      });

      setNodes(nodes);
      setEdges(defaultEdges);
    }
  };

  return (
    <button id="comfy-load-default-button" onClick={handleClick}>
      Load Default
    </button>
  );
};

export default LoadDefaultButton;
