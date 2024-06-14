import { useFlowStore } from '../store/flow';
import { ReactFlowInstance, ReactFlowJsonObject } from 'reactflow';
import { NodeData, Workflow, WorkflowInput, WorkflowOutput } from '../types/types';
import { useApiContext } from '../contexts/api';
import { getHandleName, makeHandleId } from '../utils/node';
import { uuidv4 } from 'lib0/random';
import { useGraphContext } from '../contexts/graph';

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

// NEW
const serializeGraph = (
  instance: ReactFlowInstance<NodeData, string>,
  minimize_payload: boolean = false
) => {
  const { nodes, edges, viewport } = instance.toObject();

  const lightweightNodes = nodes.map((node) => {
    if (minimize_payload) {
      // Ignore all properties other than id and data
      return { id: node.id, data: node.data };
    } else {
      const { selected, dragging, resizing, parentNode, ...remainder } = node;
      return remainder;
    }
  });

  return { nodes: lightweightNodes, edges, viewport };
};

export type Node<T, U extends string> = {
  id: string;
  position: XYPosition;
  data: T;
  type?: U;
  sourcePosition?: Position;
  targetPosition?: Position;
  hidden?: boolean;
  selected?: boolean;
  dragging?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  connectable?: boolean;
  resizing?: boolean;
  deletable?: boolean;
  dragHandle?: string;
  width?: number | null;
  height?: number | null;
  /** @deprecated - use `parentId` instead */
  parentNode?: string;
  parentId?: string;
  zIndex?: number;
  extent?: 'parent' | CoordinateExtent;
  expandParent?: boolean;
  positionAbsolute?: XYPosition;
  ariaLabel?: string;
  focusable?: boolean;
  style?: React.CSSProperties;
  className?: string;
};
