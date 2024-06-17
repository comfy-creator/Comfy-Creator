import { ReactFlowInstance, ReactFlowJsonObject, useReactFlow } from 'reactflow';
import { ConstantValue, HandleState, NodeData, RefValue, SerializedGraph } from '../types/types';
import { useApiContext } from '../contexts/api';
import { getHandleName, makeHandleId } from '../utils/node';
import { uuidv4 } from 'lib0/random';
import { useGraphContext } from '../contexts/graph';

// import { applyWidgetControl } from '../utils/widgets.ts';

// Second argument returned is a list of missing required input handles
// If any are missing, you should _not_ submit the workflow, as it is incomplete
// If you minimize the payload, a lot of information is lost and it will be
// difficult to reconstruct the original graph visually in the UI
export const serializeGraph = (
  instance: ReactFlowInstance<NodeData, string>,
  minimize_payload: boolean = false
): [SerializedGraph, Record<string, string[]> | undefined] => {
  const { nodes, edges, viewport } = instance.toObject();

  // edges and viewport will not be modified further
  const serializedGraph: SerializedGraph = minimize_payload
    ? { nodes: [] }
    : { nodes: [], edges, viewport };
  const missingInputHandles: Record<string, string[]> = {};

  // Iterate through all nodes
  for (const node of nodes) {
    if (!node.data || !node.type) continue; // Remove non-useful nodes

    const inputs: Record<string, HandleState> = {};
    const outputs: Record<string, HandleState> = {};

    // Iterate through all input handles for this node
    for (const [handle_name, handle_state] of Object.entries(node.data.inputs)) {
      // If the value is not provided, look for a reference
      if (!handle_state.value) {
        const targetHandleId = makeHandleId(node.id, handle_name);
        const edge = edges.find((edge) => edge.targetHandle === targetHandleId);

        if (edge && edge.sourceHandle) {
          const sourceNode = nodes.find((n) => n.id === edge.source);

          if (!sourceNode) {
            // This should never happen; it would indicate a malformed graph / bug
            console.error(`Error: Node with ID ${node.id} is referenced but does not exist.`);
            if (!handle_state.optional)
              missingInputHandles[node.id] = (missingInputHandles[node.id] || []).concat(
                handle_name
              );
          } else {
            const ref: RefValue = {
              nodeId: sourceNode.id,
              handleName: edge.sourceHandle
            };
            inputs[handle_name] = { value: ref }; // we reference another value
          }
        } else {
          if (!handle_state.optional) {
            console.error(`Missing edge for requried input handle: ${targetHandleId}`);
            missingInputHandles[node.id] = (missingInputHandles[node.id] || []).concat(handle_name);
          }
        }

        continue;
      }

      // value exists
      switch (handle_state.edge_type) {
        case 'INT':
        case 'FLOAT':
          {
            const value = Number(handle_state.value);
            if (!isNaN(value)) {
              inputs[handle_name] = { value };
            } else {
              console.error('Invalid number input value');
            }
          }
          break;

        case 'BOOLEAN':
          {
            if (typeof handle_state.value == 'string') {
              inputs[handle_name] = { value: handle_state.value === 'true' };
            } else if (typeof handle_state.value == 'boolean') {
              inputs[handle_name] = { value: handle_state.value };
            } else {
              throw new Error('Invalid boolean input value');
            }
          }
          break;

        case 'ENUM':
        case 'STRING':
          inputs[handle_name] = { value: handle_state.value };
          break;

        default: {
          inputs[handle_name] = { value: handle_state.value };
        }
      }
    }

    // Iterate through all output handles for this node This is only useful for when
    // a node's output handle's value is being held constant
    for (const [handle_name, handle_state] of Object.entries(node.data.outputs)) {
      if (handle_state.value !== undefined) {
        outputs[handle_name] = { value: handle_state.value };
      }
    }

    if (minimize_payload) {
      // Only include the essential properties for each node
      serializedGraph.nodes.push({
        id: node.id,
        data: { inputs, outputs }
        // position: node.position // note: the server doesn't really need this, but react flow wants it
      });
    } else {
      // Remove some non-essential properties but keep more than the minimized version
      const { selected, dragging, resizing, parentNode, ...essentialProps } = node;
      serializedGraph.nodes.push({ ...essentialProps, data: { inputs, outputs } });
    }
  }

  if (Object.keys(missingInputHandles).length > 0) {
    return [serializedGraph, missingInputHandles];
  } else {
    return [serializedGraph, undefined];
  }
};

export function useWorkflow() {
  const instance = useReactFlow();
  const { addGraphRun } = useGraphContext();
  const { runWorkflow } = useApiContext();

  const submitWorkflow = async () => {
    const [serializedGraph, missingInputHandles] = serializeGraph(instance, false);
    if (missingInputHandles) return missingInputHandles;

    const runId = uuidv4();

    await runWorkflow(serializedGraph, runId);

    addGraphRun(runId);

    // for (const node of flow.nodes) {
    //   applyWidgetControl(node, updateInputData);
    // }
  };

  // const serializeGraph = () => {
  //   if (!instance) throw new Error('Flow instance not found');
  //   return instance.toObject() as ReactFlowJsonObject<NodeData>;
  // };

  return { submitWorkflow };
}

// export type Node<T, U extends string> = {
//   id: string;
//   position: XYPosition;
//   data: T;
//   type?: U;
//   sourcePosition?: Position;
//   targetPosition?: Position;
//   hidden?: boolean;
//   selected?: boolean;
//   dragging?: boolean;
//   draggable?: boolean;
//   selectable?: boolean;
//   connectable?: boolean;
//   resizing?: boolean;
//   deletable?: boolean;
//   dragHandle?: string;
//   width?: number | null;
//   height?: number | null;
//   /** @deprecated - use `parentId` instead */
//   parentNode?: string;
//   parentId?: string;
//   zIndex?: number;
//   extent?: 'parent' | CoordinateExtent;
//   expandParent?: boolean;
//   positionAbsolute?: XYPosition;
//   ariaLabel?: string;
//   focusable?: boolean;
//   style?: React.CSSProperties;
//   className?: string;
// };
