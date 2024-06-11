import { useFlowStore } from '../../store/flow';
import { ReactFlowJsonObject } from 'reactflow';
import { NodeData, Workflow, WorkflowInput, WorkflowOutput } from '../types';
import { useApiContext } from '../../contexts/api';
import { getHandleName, makeHandleId } from '../utils/node';
import { uuidv4 } from 'lib0/random';
import { useGraphContext } from '../../contexts/graph';

// import { applyWidgetControl } from '../utils/widgets.ts';

export function useWorkflow() {
  const { instance } = useFlowStore();
  const { addGraphRun } = useGraphContext();
  const { runWorkflow } = useApiContext();

  const submitWorkflow = async () => {
    const flow = serializeGraph();
    const workflow = serializeGraphToWorkflow();

    if (!workflow) return;

    const runId = uuidv4();

    await runWorkflow(workflow, runId);

    addGraphRun(runId);

    for (const node of flow.nodes) {
      // applyWidgetControl(node, updateInputData);
    }
  };

  const serializeGraphToWorkflow = () => {
    if (!instance) throw new Error('Flow instance not found');
    const { nodes, edges }: ReactFlowJsonObject<NodeData> = instance.toObject();
    const workflow: Workflow = {};

    for (const node of nodes) {
      if (!node.data || !node.type) continue;
      const inputs: Record<string, WorkflowInput> = {};
      const outputs: Record<string, WorkflowOutput> = {};

      for (const input of Object.values(node.data.inputs)) {
        switch (input.type) {
          case 'INT':
          case 'FLOAT':
            {
              const value = Number(input.value);
              if (isNaN(value)) {
                throw new Error('Invalid number input value');
              }
              inputs[input.name] = value;
            }
            break;
          case 'BOOLEAN':
            {
              if (typeof input.value == 'string') {
                inputs[input.name] = input.value === 'true';
              } else if (typeof input.value == 'boolean') {
                inputs[input.name] = input.value;
              } else {
                throw new Error('Invalid boolean input value');
              }
            }
            break;
          case 'ENUM':
          case 'STRING':
            inputs[input.name] = input.value;
            break;
          default: {
            const handleId = makeHandleId(node.id, 'input', input.name);
            const edge = edges.find((edge) => edge.targetHandle == handleId);
            if (!edge) {
              throw new Error(`Missing edge for input "${input.name}" on node "${node.id}"`);
            }

            const source = nodes.find((node) => node.id == edge.source);
            if (!source) {
              throw new Error(`Missing source node for input "${input.name}" on node "${node.id}"`);
            }

            const handle = source.data.outputs[getHandleName(edge.sourceHandle!)];
            if (!handle) {
              throw new Error(
                `Missing source handle for input "${input.name}" on node "${node.id}"`
              );
            }

            inputs[input.name] = [edge.source, handle.name];
          }
        }
      }

      for (const value of Object.values(node.data.outputs)) {
        outputs[value.name] = [node.id, value.name];
      }

      workflow[node.id] = { type: node.type, inputs, outputs };
    }

    return workflow;
  };

  const serializeGraph = () => {
    if (!instance) throw new Error('Flow instance not found');
    return instance.toObject() as ReactFlowJsonObject<NodeData>;
  };

  return { submitWorkflow, serializeGraphToWorkflow, serializeGraph };
}
