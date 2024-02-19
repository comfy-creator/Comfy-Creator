import {
  InputDef,
  WidgetState,
  NodeDefinition,
  NodeState,
  InputHandle,
  OutputHandle,
  EdgeType
} from './types';
import { SUPPORTED_IMAGE_TYPES, SUPPORTED_VIDEO_TYPES } from './constants.ts';

// This returns the 'data' property of a React Flow Node
export function initialNodeState(
  nodeDef: NodeDefinition,
  inputWidgetValues: Record<string, any>
): NodeState {
  const inputEdges = nodeDef.inputs.reduce(
    (acc, def, index) => {
      const defaultToWidget = canBeWidget(def.edgeType);

      if (def.isHandle === true || (def.isHandle === undefined && !defaultToWidget)) {
        acc[index] = {
          label: def.label,
          edgeType: def.edgeType,
          isHandle: true,
          optional: def.optional
        };
      }

      return acc;
    },
    {} as Record<number, InputHandle>
  );

  // Initialize output handles from output definitions
  const outputEdges = nodeDef.outputs.reduce(
    (acc, def, index) => {
      acc[index] = {
        label: def.label,
        edgeType: def.edgeType,
        isHandle: true
      };
      return acc;
    },
    {} as Record<number, OutputHandle>
  );

  // Initialize input widgets from input definitions
  const inputWidgets = nodeDef.inputs.reduce(
    (acc, def) => {
      const defaultToWidget = canBeWidget(def.edgeType);

      if (def.isHandle === false || (def.isHandle === undefined && defaultToWidget)) {
        acc[def.label] = defToWidgetState(def, inputWidgetValues);
      }

      return acc;
    },
    {} as Record<string, WidgetState>
  );

  // Construct and return the node state
  return {
    display_name: nodeDef.display_name,
    inputEdges,
    outputEdges,
    inputWidgets
  };
}

export function defToWidgetState(def: InputDef, values: Record<string, any>): WidgetState {
  const state = {
    label: def.label,
    optional: def.optional
  };

  switch (def.edgeType) {
    case 'BOOLEAN':
      return {
        ...state,
        edgeType: def.edgeType,
        value: values[def.edgeType] ?? def.defaultValue
      };

    case 'INT':
      return {
        ...state,
        edgeType: def.edgeType,
        value: values[def.edgeType] ?? def.defaultValue
      };

    case 'FLOAT':
      return {
        ...state,
        edgeType: def.edgeType,
        value: values[def.edgeType] ?? def.defaultValue
      };

    case 'STRING':
      return {
        ...state,
        edgeType: def.edgeType,
        value: values[def.edgeType] ?? def.defaultValue
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
        edgeType: def.edgeType,
        value: def.defaultValue ?? firstOptionValue
      };

    case 'IMAGE':
      return {
        ...state,
        edgeType: def.edgeType,
        value: values[def.label] ?? def.defaultValue
      };

    case 'VIDEO':
      return {
        ...state,
        edgeType: def.edgeType,
        value: values[def.label] ?? def.defaultValue ?? {}
      };

    default:
      throw new Error(`Unsupported input type: ${(def as InputDef).edgeType}`);
  }
}

// This infers the 'isHandle' property based on edgeType if 'isHandle' is undefined
// in the input definition
const supportsWidgets: EdgeType[] = ['INT', 'STRING', 'BOOLEAN', 'FLOAT', 'ENUM'];

const canBeWidget = (edgeType: EdgeType): boolean => {
  return supportsWidgets.includes(edgeType);
};

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
