import {
  EdgeType,
  InputDef,
  InputHandle,
  NodeDefinition,
  NodeState,
  NodeStateConfig,
  WidgetState
} from '../types.ts';
import { CONVERTABLE_WIDGET_TYPES, WIDGET_TYPES } from '../config/constants.ts';
import { Node } from 'reactflow';
import { useFlowStore } from '../store/flow.ts';

export function computeInitialNodeState(
  def: NodeDefinition,
  widgetValues: Record<string, any>,
  config: NodeStateConfig
) {
  const { display_name: name, inputs, outputs } = def;
  const state: NodeState = { name, config, inputs: [], outputs: [], widgets: {} };

  inputs.forEach((input) => {
    const isWidget = isWidgetInput(input.type);
    if (isWidget) {
      state.widgets[input.name] = {
        ...widgetStateFromDef(input, widgetValues)
      };
    } else {
      state.inputs.push({
        name: input.name,
        type: input.type,
        isHighlighted: false,
        optional: input.optional
      });
    }
  });

  outputs.forEach((output) => {
    state.outputs.push({
      name: output.name,
      type: output.type,
      isHighlighted: false
    });
  });

  return state;
}

export function widgetStateFromDef(def: InputDef, values: Record<string, any>): WidgetState {
  const state = { name: def.name, optional: def.optional };

  switch (def.type) {
    case 'BOOLEAN':
      return {
        ...state,
        type: def.type,
        value: values[def.type] ?? def.defaultValue
      };

    case 'INT':
      return {
        ...state,
        type: def.type,
        value: values[def.type] ?? def.defaultValue
      };

    case 'FLOAT':
      return {
        ...state,
        type: def.type,
        value: values[def.type] ?? def.defaultValue
      };

    case 'STRING':
      return {
        ...state,
        type: def.type,
        value: values[def.type] ?? def.defaultValue
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
        value: def.defaultValue ?? firstOptionValue
      };

    case 'IMAGE':
      return {
        ...state,
        type: def.type,
        value: values[def.name] ?? def.defaultValue
      };

    case 'VIDEO':
      return {
        ...state,
        type: def.type,
        value: values[def.name] ?? def.defaultValue ?? {}
      };

    default:
      throw new Error(`Unsupported input type: ${(def as InputDef).type}`);
  }
}

const isWidgetInput = (type: EdgeType) => WIDGET_TYPES.includes(type);

const isConvertableWidget = (widget: WidgetState) => CONVERTABLE_WIDGET_TYPES.includes(widget.type);

export function hideNodeWidget(node: Node<NodeState>, name: string) {
  const widget = node.data.widgets[name];
  if (!widget) {
    throw new Error(`Widget ${name} not found in Node "${node.id}"`);
  }

  // already hidden?
  if (widget.hidden) return;

  const { updateWidgetState } = useFlowStore.getState();
  updateWidgetState({
    name,
    nodeId: node.id,
    newState: { type: widget.type, hidden: true }
  });

  console.log(useFlowStore.getState().nodes);
}

export function showNodeWidget(node: Node<NodeState>, name: string) {
  const widget = node.data.widgets[name];
  if (!widget) {
    throw new Error(`Widget ${name} not found in Node "${node.id}"`);
  }

  // not already hidden?
  if (!widget.hidden) return;

  const { updateWidgetState } = useFlowStore.getState();
  updateWidgetState({
    name,
    nodeId: node.id,
    newState: { type: widget.type, hidden: false }
  });
}

export function convertNodeWidgetToInput(node: Node<NodeState>, name: string) {
  if (!node.type) return;

  const widget = node.data.widgets[name];
  if (!widget) {
    throw new Error(`Widget ${name} not found in Node "${node.id}"`);
  }

  if (!isConvertableWidget(widget)) {
    throw new Error(`Widget ${widget.type} cannot be converted to input`);
  }

  const { nodeDefs } = useFlowStore.getState();
  const definition = nodeDefs[node.type]?.inputs.find((input) => input.name === name);
  if (!definition) {
    throw new Error(`No definition found for widget ${widget.type} in ${node.type}`);
  }

  return {
    type: '*',
    name: widget.name,
    optional: widget.optional,
    widget: { ...widget, definition }
  } as InputHandle;
}

export function convertNodeInputToWidget(node: Node<NodeState>, slot: number) {
  if (!node.type) return;

  const input = node.data.inputs[slot];
  if (!input) {
    throw new Error(`Input Slot ${slot} not found in Node "${node.id}"`);
  }

  const { nodes } = useFlowStore.getState();

  let widget;
  if (input.primitiveNodeId) {
    const node = nodes.find((node) => node.id === input.primitiveNodeId);
    if (node) {
      widget = node.data.widgets[input.name];
    }
  }

  if (!widget && input.widget) {
    widget = input.widget;
  } else {
    throw new Error(`Input Slot ${slot} does not contain a widget or a primitive node`);
  }

  return widget;
}

interface ExchangeInputForWidgetArgs {
  inputSlot: number;
  sourceNode: Node<NodeState>;
  targetNode: Node<NodeState>;
}

export function exchangeInputForWidget({
  inputSlot,
  sourceNode,
  targetNode
}: ExchangeInputForWidgetArgs) {
  const { updateNodeState } = useFlowStore.getState();
  const widget = convertNodeInputToWidget(sourceNode, inputSlot);
  if (!widget) return;

  sourceNode.data.inputs = sourceNode.data.inputs.map((input) => {
    if (input.name === widget.name) {
      return {
        ...input,
        type: widget.type,
        primitiveNodeId: targetNode.id
      };
    }

    return input;
  });

  // hide widget from source node (or should we remove it?)
  updateNodeState(sourceNode.id, sourceNode.data);

  // add widget to target node
  const output = { name: widget.type, type: widget.type };
  updateNodeState(targetNode.id, {
    widgets: {
      [widget.name]: {
        ...widget,
        hidden: false
      }
    },
    outputs: [output]
  });
}

export function removeNodeInput(node: Node<NodeState>, slot: number) {
  const { updateNodeState } = useFlowStore.getState();
  node.data.inputs = node.data.inputs.filter((_, i) => i !== slot);
  updateNodeState(node.id, node.data);
}
