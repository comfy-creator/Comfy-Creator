import { useFlowStore } from '../../store/flow';
import { ReactFlowJsonObject } from 'reactflow';
import { NodeData, SerializedFlow } from '../types';
import { useApiContext } from '../../contexts/api.tsx';
import { isWidgetInput } from '../utils/node.ts';

// import { applyWidgetControl } from '../utils/widgets.ts';

export function useWorkflow() {
  const { instance, updateInputData } = useFlowStore();
  const { runWorkflow } = useApiContext();

  const submitWorkflow = async () => {
    const flow = flowToObject();
    const prompt = flowToPrompt();
    if (!prompt) return;

    await runWorkflow(prompt);

    for (const node of flow.nodes) {
      // applyWidgetControl(node, updateInputData);
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

      const { inputs } = node.data;
      const widgets = inputs.filter((input) => isWidgetInput(input.type));

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
          data.inputs[name] = widget.value as any;
        }
      }

      prompt[node.id] = data;
    }

    return prompt;
  };

  const flowToObject = () => {
    if (!instance) throw new Error('Flow instance not found');
    return instance.toObject() as ReactFlowJsonObject<NodeData>;
  };

  return { submitWorkflow, flowToPrompt, flowToObject };
}
