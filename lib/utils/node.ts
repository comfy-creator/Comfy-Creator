import { EdgeType, HandleState, HandleType, NodeData, NodeDefinition } from '../types/types.ts';
import { DISPLAY_TYPES, WIDGET_TYPES } from '../config/constants.ts';
import { useFlowStore } from '../store/flow.ts';
import { createValueControlInput, isSeedInput } from './widgets.ts';
import { Edge, Node } from 'reactflow';

export function computeInitialNodeData(def: NodeDefinition) {
   const { display_name, inputs, outputs } = def;
   const state: NodeData = { display_name, inputs: {}, outputs: {}, widgets: {} };

   let currentSlot = 0;
   Object.keys(inputs).map((key) => {
      const input = inputs[key];
      const isWidget = isWidgetType(input.edge_type);

      if (isWidget) {
         const data: HandleState = {
            edge_type: input.edge_type,
            value: input.value,
            display_name: input.display_name,
            optional: input.optional
         };
         console.log('data', { data });

         state.inputs[input.display_name] = data;

         if (isSeedInput({ widget_type: input.edge_type, display_name: input.display_name })) {
            const nextValue = createValueControlInput({ input: data });
            state.inputs[nextValue.display_name] = {display_name: nextValue.display_name, edge_type: nextValue.widget_type};
            // data.linkedInputs = [nextValue.name];
         }
      } else {
         if (input.edge_type === 'IMAGE') {
            // TODO: add image display widget
            state.inputs[input.display_name] = {
               display_name: 'imageValue',
               edge_type: 'IMAGE',
               value: ''
            };
         }

         state.inputs[input.display_name] = {
            display_name: input.display_name,
            edge_type: input.edge_type,
            isHighlighted: false,
            optional: input.optional
         } as HandleState;

         currentSlot += 1;
      }
   });

   Object.keys(outputs).map((key) => {
      const { display_name, edge_type } = outputs[key];
      state.outputs[display_name] = { display_name, edge_type, isHighlighted: false };
   });

   return state;
}

export const isWidgetType = (type: EdgeType) => WIDGET_TYPES.includes(type);
export const isDisplayType = (type: EdgeType) => DISPLAY_TYPES.includes(type);

export const disconnectPrimitiveNode = (id: string) => {
   const { nodes, updateInputData, updateNodeData } = useFlowStore.getState();
   const primitive = nodes.find((node) => node.id === id);
   if (primitive?.type !== 'PrimitiveNode') return;

   const node = nodes.find((node) => node.id === primitive.data.targetNodeId);
   if (!node) return;

   const widget = Object.values(node.data.inputs).find((w) => w.primitiveNodeId === id);
   if (!widget) return;

   const primitiveWidget = Object.values(primitive.data.inputs).find((w) => w.display_name === widget.display_name);
   if (widget?.edge_type !== primitiveWidget?.edge_type) return;

   const updatedInputData = {
      ...widget,
      ...primitiveWidget,
      isDisabled: false,
      primitiveNodeId: null
   };

   updateNodeData(primitive.id, { targetNodeId: null });

   updateInputData({
      nodeId: node.id,
      display_name: widget.display_name,
      data: updatedInputData
   });
};

export function addWidgetToPrimitiveNode(
   primitiveNodeId: string,
   updateNodeData: (nodeId: string, newState: Partial<NodeData>) => void,
   { nodeId, widgetName }: { nodeId: string; widgetName: string }
) {
   const { nodeDefs, nodes, updateInputData } = useFlowStore.getState();
   const primitive = nodes.find((node) => node.id === primitiveNodeId);
   if (primitive?.type !== 'PrimitiveNode') return;

   const node = nodes.find((node) => node.id === nodeId);
   if (!node) return;

   const widget = node.data.inputs[widgetName];
   const definition = nodeDefs[node.type!]?.inputs?.[widget?.display_name];
   if (!widget || !definition) return;

   const outputState = { display_name: widget.edge_type, edge_type: widget.edge_type };
   const inputData = { ...widget, definition };
   updateNodeData(primitive.id, {
      outputs: { [outputState.display_name]: outputState },
      inputs: { [widget.display_name]: inputData },
      targetNodeId: nodeId
   });

   updateInputData({
      nodeId,
      display_name: widgetName,
      data: {
         ...widget,
         isDisabled: true,
         primitiveNodeId
      }
   });

   return outputState;
}

export function isWidgetHandleId(id: string) {
   return isWidgetType(id.split('::')[2] as EdgeType);
}

export function makeHandleId(nodeId: string, name: string) {
   return `${nodeId}::${name}`;
}

export function getHandleNodeId(id: string) {
   return id.split('::')[0];
}

export function getHandleName(id: string) {
   return id.split('::')[1];
}

export function isPrimitiveNode(node: Node<NodeData>) {
   return node.type === 'PrimitiveNode';
}

export function makeEdgeId({
   sourceHandle,
   targetHandle
}: {
   sourceHandle: string;
   targetHandle: string;
}) {
   const sourceNodeId = getHandleNodeId(sourceHandle);
   const targetNodeId = getHandleNodeId(targetHandle);

   return `${sourceNodeId}::${sourceHandle}-${targetNodeId}::${targetHandle}`;
}

export const createEdge = ({
   sourceHandle,
   targetHandle,
   type
}: {
   sourceHandle: string;
   targetHandle: string;
   type: EdgeType;
}): Edge => {
   const source = getHandleNodeId(sourceHandle);
   const target = getHandleNodeId(targetHandle);

   return {
      id: makeEdgeId({ sourceHandle, targetHandle }),
      source,
      sourceHandle,
      target,
      targetHandle,
      type
   };
};

export function isMultilineStringInput(input: HandleState) {
   return input.edge_type === 'STRING' && input.isMultiline;
}
