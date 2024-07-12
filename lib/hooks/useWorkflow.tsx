import { ReactFlowInstance, ReactFlowJsonObject, useReactFlow, Edge } from '@xyflow/react';
import { AppNode, HandleState, NodeData, RefValue, SerializedGraph } from '../types/types';
import { useApiContext } from '../contexts/api';
import { getHandleName, makeHandleId } from '../utils/node';
import { uuidv4 } from 'lib0/random';
import { useGraphContext } from '../contexts/graph';

// Second argument returned is a list of missing required input handles
// If any are missing, you should _not_ submit the workflow, as it is incomplete
//
// If you minimize the payload, a lot of information is lost and it will be
// difficult to reconstruct the original graph visually in the UI
export const newSerializeGraph = (
   instance: ReactFlowInstance<AppNode, Edge>,
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

            // TO DO: check to see if the 'outputs' are already specified, in which case we can perform
            // a constant folding optimization here

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
                  inputs[handle_name] = { ...handle_state, value: ref }; // we reference another value
               }
            } else {
               if (!handle_state.optional) {
                  console.error(`Missing edge for requried input handle: ${targetHandleId}`);
                  missingInputHandles[node.id] = (missingInputHandles[node.id] || []).concat(
                     handle_name
                  );
               }
            }

            continue;
         }

         // value is a constant
         switch (handle_state.edge_type) {
            case 'INT':
            case 'FLOAT':
               {
                  const value = Number(handle_state.value);
                  if (!isNaN(value)) {
                     inputs[handle_name] = { ...handle_state, value };
                  } else {
                     console.error('Invalid number input value');
                  }
               }
               break;

            case 'BOOLEAN':
               {
                  if (typeof handle_state.value == 'string') {
                     inputs[handle_name] = { ...handle_state, value: handle_state.value === 'true' };
                  } else if (typeof handle_state.value == 'boolean') {
                     inputs[handle_name] = { ...handle_state, value: handle_state.value };
                  } else {
                     throw new Error('Invalid boolean input value');
                  }
               }
               break;

            case 'ENUM':
            case 'STRING':
               inputs[handle_name] = { ...handle_state, value: handle_state.value };
               break;

            default: {
               inputs[handle_name] = { ...handle_state, value: handle_state.value };
            }
         }
      }

      // Iterate through all output handles for this node This is only useful for when
      // a node's output handle's value is being held constant
      for (const [handle_name, handle_state] of Object.entries(node.data.outputs)) {
         if (handle_state.value !== undefined) {
            outputs[handle_name] = { ...handle_state, value: handle_state.value };
         }
      }

      if (minimize_payload) {
         // Only include the essential properties for each node
         serializedGraph.nodes.push({
            id: node.id,
            data: { inputs, outputs, widgets: {} },
            // position: node.position // note: the server doesn't really need this, but react flow wants it
         });
      } else {
         // Remove some non-essential properties but keep more than the minimized version
         const { selected, dragging, resizing, parentId, ...essentialProps } = node;
         serializedGraph.nodes.push({ ...essentialProps, data: { inputs, outputs, widgets: {} } });
      }
   }

   if (Object.keys(missingInputHandles).length > 0) {
      return [serializedGraph, missingInputHandles];
   } else {
      return [serializedGraph, undefined];
   }
};

export function useWorkflow() {
   const rflInstance = useReactFlow<AppNode, Edge>();
   const { addGraphRun } = useGraphContext();
   const { runWorkflow } = useApiContext();

   const submitWorkflow = async () => {
      const [serializedGraph, missingInputHandles] = newSerializeGraph(rflInstance, false);
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

   const serializeGraphToWorkflow = () => {
      if (!rflInstance) throw new Error('Flow instance not found');
      const { nodes, edges }: ReactFlowJsonObject<AppNode> = rflInstance.toObject();
      const workflow: Record<string, any> = {};

      for (const node of nodes) {
         if (!node.data || !node.type) continue;
         const inputs: Record<string, any> = {};
         const outputs: Record<string, any> = {};

         for (const input of Object.values(node.data.inputs)) {
            switch (input.edge_type) {
               case 'INT':
               case 'FLOAT':
                  {
                     const value = Number(input.value);
                     if (isNaN(value)) {
                        throw new Error('Invalid number input value');
                     }
                     inputs[input.display_name] = value;
                  }
                  break;
               case 'BOOLEAN':
                  {
                     if (typeof input.value == 'string') {
                        inputs[input.display_name] = input.value === 'true';
                     } else if (typeof input.value == 'boolean') {
                        inputs[input.display_name] = input.value;
                     } else {
                        throw new Error('Invalid boolean input value');
                     }
                  }
                  break;
               case 'ENUM':
               case 'STRING':
                  inputs[input.display_name] = input.value;
                  break;
               default: {
                  const handleId = makeHandleId(node.id, input.display_name);
                  const edge = edges.find((edge) => edge.targetHandle == handleId);
                  if (!edge) {
                     throw new Error(`Missing edge for input "${input.display_name}" on node "${node.id}"`);
                  }

                  const source = nodes.find((node) => node.id == edge.source);
                  if (!source) {
                     throw new Error(
                        `Missing source node for input "${input.display_name}" on node "${node.id}"`
                     );
                  }

                  const handle = source.data.outputs[getHandleName(edge.sourceHandle!)];
                  if (!handle) {
                     throw new Error(
                        `Missing source handle for input "${input.display_name}" on node "${node.id}"`
                     );
                  }

                  inputs[input.display_name] = [edge.source, handle.display_name];
               }
            }
         }

         for (const value of Object.values(node.data.outputs)) {
            outputs[value.display_name] = [node.id, value.display_name];
         }

         workflow[node.id] = { type: node.type, inputs, outputs };
      }

      return workflow;
   };

   const serializeGraph = () => {
      if (!rflInstance) throw new Error('Flow instance not found');
      return rflInstance.toObject() as ReactFlowJsonObject<AppNode>;
   };

   return { submitWorkflow, serializeGraphToWorkflow, serializeGraph };
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
