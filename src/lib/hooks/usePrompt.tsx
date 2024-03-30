import { useFlowStore } from '../../store/flow';
import { ReactFlowJsonObject } from 'reactflow';
import { NodeState } from '../types';
import { publish as publishEvent } from '../event.ts';

interface APIWorkflow {
  [key: string]: {
    inputs: Record<string, string | number | boolean | [string, number]>;
    class_type: string;
    _meta: {
      title: string;
    };
  };
}

export function usePrompt() {
  const { instance } = useFlowStore();

  const queuePrompt = (number: number) => {
    if (!instance) {
      throw new Error('Flow instance not found');
    }
    const flow: ReactFlowJsonObject<NodeState> = instance.toObject();

    const prompt = flowToPrompt();

    // fetch('http://localhost:8188/prompt', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     client_id: crypto.randomUUID(),
    //     extra_info: {},
    //     prompt
    //   })
    // })
    //   .then((res) => res.json().then((res) => console.log({ res })))
    //   .catch(console.log);

    for (const node of flow.nodes) {
      publishEvent<{ nodeId: string }>('afterQueue', { nodeId: node.id });
    }
  };

  const flowToPrompt = () => {
    if (!instance) {
      throw new Error('Flow instance not found');
    }
    const flow: ReactFlowJsonObject<NodeState> = instance.toObject();

    const prompt: APIWorkflow = {};

    for (const node of flow.nodes) {
      if (!node.type) continue;

      const data: APIWorkflow[0] = {
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

  return { queuePrompt, flowToPrompt };
}
