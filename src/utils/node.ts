import {
  EdgeType,
  InputDef,
  NodeDefinition,
  NodeState,
  NodeStateConfig,
  WidgetState
} from '../types.ts';
import { WIDGET_TYPES } from '../constants.ts';

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
