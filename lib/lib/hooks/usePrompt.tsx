import { useFlowStore } from '../../store/flow';
import { ReactFlowJsonObject } from 'reactflow';
import { NodeState, SerializedFlow } from '../types';
import { useApiContext } from '../../contexts/api';
import { applyWidgetControl } from '../utils/widgets';

export function usePrompt() {
  const { instance, updateWidgetState } = useFlowStore();
  const { runWorkflow } = useApiContext();

  const queuePrompt = async () => {
    const flow = flowToObject();
    const prompt = flowToPrompt();
    if (!prompt) return;

    await runWorkflow(prompt);

    for (const node of flow.nodes) {
      applyWidgetControl(node, updateWidgetState);
    }
  };

  const flowToPrompt = () => {
    const flow = flowToObject();
    const prompt: SerializedFlow = {};

    for (const node of flow.nodes) {
      if (!node.type) continue;

      const data: SerializedFlow[0] = {
        class_type: node.type,
        _meta: { title: node.data.name },
        inputs: {}
      };

      const { inputs, widgets } = node.data;

      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];

        const handleId = `input::${i}::${input.type}`;
        const edge = flow.edges.find(
          (edge) => edge.target === node.id && edge.targetHandle === handleId
        );
        if (!edge || !edge.source || !edge.sourceHandle) return;

        const [_, slot] = edge.sourceHandle.split('::');
        const value = [edge.source, Number(slot)] as [string, number];
        data.inputs[input.name] = value;
      }

      for (const name in widgets) {
        const widget = widgets[name];
        if (widget.serialize === false) continue;

        if ('value' in widget) {
          const value =
            widget.type === 'VIDEO'
              ? widget.value.src
              : Array.isArray(widget.value)
                ? widget.value[0]
                : widget.value;

          data.inputs[name] = value;
        }
      }

      prompt[node.id] = data;
    }

    return prompt;
  };

  const flowToObject = () => {
    if (!instance) throw new Error('Flow instance not found');
    return instance.toObject() as ReactFlowJsonObject<NodeState>;
  };

  return { queuePrompt, flowToPrompt, flowToObject };
}
