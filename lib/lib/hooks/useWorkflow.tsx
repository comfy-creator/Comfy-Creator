import { useFlowStore } from '../../store/flow';
import { ReactFlowJsonObject } from 'reactflow';
import { NodeData, WorkflowAPI } from '../types';
import { useApiContext } from '../../contexts/api.tsx';
import { getHandleName, isWidgetType, makeHandleId } from '../utils/node.ts';

// import { applyWidgetControl } from '../utils/widgets.ts';

export function useWorkflow() {
  const { instance, updateInputData } = useFlowStore();
  const { runWorkflow } = useApiContext();

  const submitWorkflow = async () => {
    const flow = serializeGraph();
    const workflow = graphToWorkflow();
    if (!workflow) return;

    await runWorkflow(workflow);

    for (const node of flow.nodes) {
      // applyWidgetControl(node, updateInputData);
    }
  };

  const graphToWorkflow = () => {
    const flow = serializeGraph();
    const workflow: WorkflowAPI = {};

    for (const node of flow.nodes) {
      if (!node.type) continue;

      const data: WorkflowAPI[0] = {
        class_type: node.type,
        _meta: { title: node.data.name },
        inputs: {}
      };

      const { inputs } = node.data;
      const widgets = Object.values(inputs).filter((input) => isWidgetType(input.type));

      for (const name in inputs) {
        const input = inputs[name];
        if (!input) continue;

        const handleId = makeHandleId(node.id, 'input', name);
        const edge = flow.edges.find(
          (edge) => edge.target === node.id && edge.targetHandle === handleId
        );
        if (!edge || !edge.source || !edge.sourceHandle) return;

        const sourceNodeId = getHandleName(edge.sourceHandle);
        if (edge.source !== sourceNodeId) return;

        const sourceHandleName = getHandleName(edge.sourceHandle);
        const sourceNode = flow.nodes.find((node) => node.id === sourceNodeId);
        if (!sourceNode) return;

        const sourceHandle = sourceNode.data.outputs[sourceHandleName];
        if (!sourceHandle) return;

        const value = [edge.source, sourceHandle.slot] as [string, number];
        data.inputs[name] = value;
      }

      for (const name in widgets) {
        const widget = widgets[name];
        if (widget.serialize === false) continue;

        if ('value' in widget) {
          data.inputs[name] = widget.value as any;
        }
      }

      workflow[node.id] = data;
    }

    return workflow;
  };

  const serializeGraph = () => {
    if (!instance) throw new Error('Flow instance not found');
    return instance.toObject() as ReactFlowJsonObject<NodeData>;
  };

  return { submitWorkflow, graphToWorkflow, serializeGraph };
}
