import { EdgeType, InputDef, NodeDefinition, NodeState, WidgetState } from './types';
import { SUPPORTED_IMAGE_TYPES, SUPPORTED_VIDEO_TYPES, WIDGET_TYPES } from './constants.ts'; // This returns the 'data' property of a React Flow Node

// This returns the 'data' property of a React Flow Node
export function initialNodeState(
  nodeDef: NodeDefinition,
  widgetValues: Record<string, any>
): NodeState {
  const state: NodeState = { name: nodeDef.display_name, inputs: {}, outputs: {}, widgets: {} };

  let i = 0;
  for (const input of nodeDef.inputs) {
    const isWidget = isWidgetInput(input.type);
    if (isWidget) {
      state.widgets[input.name] = widgetStateFromDef(input, widgetValues);
    } else {
      state.inputs[i] = {
        name: input.name,
        type: input.type,
        optional: input.optional,
        isHighlighted: false
      };

      i += 1;
    }
  }

  let j = 0;
  for (const output of nodeDef.outputs) {
    state.outputs[j] = {
      name: output.name,
      type: output.type,
      isHighlighted: false
    };

    j += 1;
  }

  console.log(state);
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

export function getFileKind(file: File) {
  if (file.type === 'application/json') {
    return 'json';
  } else if (SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return 'image';
  } else if (SUPPORTED_VIDEO_TYPES.includes(file.type)) {
    return 'video';
  }

  throw new Error(`Unsupported file type ${file.type}`);
}

export function getFileAsDataURL(file: File) {
  return new Promise<string | ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      if (!e.target?.result) {
        reject('Failed to load file data');
      } else {
        resolve(e.target.result);
      }
    };

    reader.readAsDataURL(file);
  });
}
