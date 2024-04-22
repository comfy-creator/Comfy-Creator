import {
  EdgeType,
  HandleType,
  InputData,
  InputDef,
  InputHandleData,
  NodeData,
  NodeDefinition
} from '../types.ts';
import { WIDGET_TYPES } from '../config/constants.ts';
import { useFlowStore } from '../../store/flow.ts';
import { isSeedInput } from './widgets.ts';
import { Node } from 'reactflow';

export function computeInitialNodeData(def: NodeDefinition, widgetValues: Record<string, any>) {
  const { display_name: name, inputs, outputs } = def;
  const state: NodeData = { name, inputs: {}, outputs: {} };

  let currentSlot = 0;
  for (const input of inputs) {
    const isWidget = isWidgetType(input.type);

    if (isWidget) {
      const data: InputData = inputDataFromDef(input, widgetValues);
      state.inputs[input.name] = data;

      if (isSeedInput(input)) {
        // const afterGenWidget = createValueControlWidget({ widget });
        // state.widgets[input.name] = {
        //   type: 'GROUP',
        //   name: input.name,
        //   widgets: [widget, afterGenWidget]
        // };
        // const afterGenWidget = createValueControlWidget({ widget });
        // widget.linkedWidgets = [afterGenWidget.name];
        // state.widgets[afterGenWidget.name] = afterGenWidget;
      }
    } else {
      if (input.type === 'IMAGE') {
        if (input.imageUpload) {
          // TODO: add image upload widget
        }

        // TODO: add image display widget
        state.inputs[input.name] = { name: 'imageValue', type: 'IMAGE', value: '' };
      }

      state.inputs[input.name] = {
        name: input.name,
        type: input.type,
        isHighlighted: false,
        optional: input.optional
      } as InputHandleData;

      currentSlot += 1;
    }
  }

  for (let i = 0; i < outputs.length; i++) {
    const { name, type } = outputs[i];
    state.outputs[name] = { slot: i, name, type, isHighlighted: false };
  }

  return state;
}

export function inputDataFromDef(def: InputDef, values: Record<string, any>): InputData {
  const state = { name: def.name, optional: def.optional };
  const value = values[def.name];

  switch (def.type) {
    case 'BOOLEAN':
      return {
        ...state,
        type: def.type,
        value: value ?? def.defaultValue
      };

    case 'INT':
      return {
        ...state,
        type: def.type,
        value: value ?? def.defaultValue
      };

    case 'FLOAT':
      return {
        ...state,
        type: def.type,
        value: value ?? def.defaultValue
      };

    case 'STRING':
      return {
        ...state,
        type: def.type,
        value: value ?? def.defaultValue
      };

    case 'ENUM':
      let firstOptionValue;
      if (typeof def.options === 'function') {
        firstOptionValue = def.options()[0];
      } else {
        firstOptionValue = def.options[0];
      }

      return {
        ...state,
        type: def.type,
        value: value ?? def.defaultValue ?? firstOptionValue
      };

    case 'IMAGE':
      return {
        ...state,
        type: def.type,
        value: value ?? def.defaultValue
      };

    case 'VIDEO':
      return {
        ...state,
        type: def.type,
        value: value ?? def.defaultValue ?? {}
      };

    default:
      throw new Error(`Unsupported input type: ${(def as InputDef).type}`);
  }
}

export const isWidgetType = (type: EdgeType) => WIDGET_TYPES.includes(type);

export const disconnectPrimitiveNode = (id: string) => {
  const { nodes, updateInputData, updateNodeData } = useFlowStore.getState();
  const primitive = nodes.find((node) => node.id === id);
  if (primitive?.type !== 'PrimitiveNode') return;

  const node = nodes.find((node) => node.id === primitive.data.targetNodeId);
  if (!node) return;

  const widget = Object.values(node.data.inputs).find((w) => w.primitiveNodeId === id);
  if (!widget) return;

  const primitiveWidget = Object.values(primitive.data.inputs).find((w) => w.name === widget.name);
  if (widget?.type !== primitiveWidget?.type) return;

  const updatedInputData = {
    ...widget,
    ...primitiveWidget,
    primitiveNodeId: null
  } as InputData;

  updateNodeData(primitive.id, { targetNodeId: null });

  updateInputData({
    nodeId: node.id,
    name: widget.name,
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
  const definition = nodeDefs[node.type!]?.inputs?.find?.((input) => input.name == widget?.name);
  if (!widget || !definition) return;

  const outputState = { name: widget.type, type: widget.type, slot: 0 };
  const inputData = { ...widget, definition };
  updateNodeData(primitive.id, {
    targetNodeId: nodeId,
    outputs: { [outputState.name]: outputState }
    // TODO: fix this
    // widgets: { [widget.name]: inputData }
  });

  updateInputData({
    nodeId,
    name: widgetName,
    data: {
      ...widget,
      primitiveNodeId
    }
  });

  return outputState;
}

export function isWidgetHandleId(id: string) {
  return isWidgetType(id.split('::')[2] as EdgeType);
}

export function makeHandleId(nodeId: string, type: HandleType, name: string) {
  return `${nodeId}::${type}::${name}`;
}

export function getHandleNodeId(id: string) {
  return id.split('::')[0];
}

export function getHandleType(id: string) {
  return id.split('::')[1] as HandleType;
}

export function getHandleName(id: string) {
  return id.split('::')[2];
}

export function isPrimitiveNode(node: Node<NodeData>) {
  return node.type === 'PrimitiveNode';
}
