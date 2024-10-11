import { ReactFlowInstance, ReactFlowJsonObject, useReactFlow, Edge } from '@xyflow/react';
import { AppNode, ConstantValue, HandleState, RefValue, SerializedGraph } from '../types/types';
import { useApiContext } from '../contexts/api';
import { getHandleName, isRefInputType, makeHandleId } from '../utils/node';
import { uuidv4 } from 'lib0/random';
import { useGraphContext } from '../contexts/graph';
import { toast } from 'react-toastify';
import { useFlowStore } from '../store/flow';

// Second argument returned is a list of missing required input handles
// If any are missing, you should _not_ submit the workflow, as it is incomplete
//
// If you minimize the payload, a lot of information is lost and it will be
// difficult to reconstruct the original graph visually in the UI
type InputValues = {
   value?: ConstantValue;
   ref?: RefValue;
};

type AnyObject = Record<string, any>;

const removeFieldsFromFirstLevelObjects = (obj: AnyObject, fieldsToRemove: string[]): AnyObject => {
   if (Array.isArray(obj)) {
      return obj.map((item) => {
         if (item && typeof item === 'object' && item.type === 'MaskImage') {
            return removeSpecifiedFieldsRecursively(item, fieldsToRemove);
         }

         return removeFieldsFromFirstLevelObjects(item, fieldsToRemove);
      });
   }

   // If it's an object, recurse deeper
   if (typeof obj === 'object' && obj !== null) {
      const newObj: AnyObject = {};

      Object.keys(obj).forEach((key) => {
         newObj[key] = removeFieldsFromFirstLevelObjects(obj[key], fieldsToRemove);
      });

      return newObj;
   }

   return obj;
};

const removeSpecifiedFieldsRecursively = (obj: AnyObject, fieldsToRemove: string[]): AnyObject => {
   if (Array.isArray(obj)) {
      return obj.map((item) => removeSpecifiedFieldsRecursively(item, fieldsToRemove));
   }

   if (typeof obj === 'object' && obj !== null) {
      const newObj: AnyObject = {};

      Object.keys(obj).forEach((key) => {
         if (!fieldsToRemove.includes(key)) {
            newObj[key] = removeSpecifiedFieldsRecursively(obj[key], fieldsToRemove);
         }
      });

      return newObj;
   }

   return obj;
};

export const serializeGraph = (
   instance: ReactFlowInstance<AppNode, Edge>,
   minimize_payload: boolean = false,
   refValueNodes: string[]
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

      const inputs: Record<string, InputValues> = {};
      const outputs: Record<string, InputValues> = {};

      // Iterate through all input handles for this node
      for (const [handle_name, handle_state] of Object.entries(node.data.inputs)) {
         // If the value is not provided, look for a reference
         if (refValueNodes.includes(node.type) && isRefInputType(handle_state.display_name)) {
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
                     handleName: edge.sourceHandle?.split('::')[1] || ''
                  };
                  inputs[handle_name] = { ref }; // we reference another value
               }
            } else {
               if (!handle_state.optional) {
                  console.error(`Missing edge for required input handle: ${targetHandleId}`);
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
                     inputs[handle_name] = { value };
                  } else {
                     console.error('Invalid number input value');
                  }
               }
               break;

            case 'BOOLEAN':
               {
                  if (typeof handle_state.value === 'string') {
                     inputs[handle_name] = { value: handle_state.value === 'true' };
                  } else if (typeof handle_state.value === 'boolean') {
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
            case 'IMAGE':
            case 'VIDEO':
               inputs[handle_name] = { ref: handle_state.ref };
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
            type: node?.type || '',
            inputs,
            outputs
         });
      } else {
         // Remove some non-essential properties but keep more than the minimized version
         const { selected, dragging, resizing, parentId, ...essentialProps } = node;
         serializedGraph.nodes.push({
            ...essentialProps,
            type: node?.type || '',
            inputs,
            outputs
         });
      }
   }

   const cleanedGraph = removeFieldsFromFirstLevelObjects(
      serializedGraph.nodes.filter((node) => node.type !== 'PreviewMaskedImage'),
      ['shapes', 'color', 'size', 'name']
   ) as SerializedGraph;

   console.log('Serialized graph>>', JSON.stringify(cleanedGraph, null, 2));

   if (Object.keys(missingInputHandles).length > 0) {
      return [cleanedGraph, missingInputHandles];
   } else {
      return [cleanedGraph, undefined];
   }
};

export function useWorkflow() {
   const rflInstance = useReactFlow<AppNode, Edge>();
   const { addGraphRun } = useGraphContext();
   const { runWorkflow } = useApiContext();
   const { refValueNodes } = useFlowStore();

   const submitWorkflow = async () => {
      const [serializedGraph, missingInputHandles] = serializeGraph(
         rflInstance,
         true,
         refValueNodes
      );

      if (missingInputHandles) {
         if (missingInputHandles) {
            for (const [nodeId, missingHandles] of Object.entries(missingInputHandles)) {
               const node = rflInstance.getNode(nodeId);
               if (node) {
                  for (const handle of missingHandles) {
                     toast.error(
                        `Node ${node.data.display_name} is missing input for handle ${handle}`,
                        {
                           autoClose: 10000
                        }
                     );
                  }
               }
            }
         }
         return missingInputHandles;
      }

      const runId = uuidv4();

      await runWorkflow(serializedGraph, runId);

      addGraphRun(runId);

      // for (const node of flow.nodes) {
      //   applyWidgetControl(node, updateInputData);
      // }
   };

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
                     throw new Error(
                        `Missing edge for input "${input.display_name}" on node "${node.id}"`
                     );
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

   const generateWorkflow = () => {
      if (!rflInstance) throw new Error('Flow instance not found');
      return rflInstance.toObject() as ReactFlowJsonObject<AppNode>;
   };

   return { submitWorkflow, serializeGraphToWorkflow, generateWorkflow };
}