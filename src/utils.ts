import {
  InputDef,
  WidgetState,
  NodeDefinition,
  NodeState,
  InputHandle,
  OutputHandle,
  EdgeType
} from './types';

// This returns the 'data' property of a React Flow Node
export function initialNodeState(nodeDef: NodeDefinition): NodeState {
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
        acc[def.label] = defToWidgetState(def);
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

export function defToWidgetState(def: InputDef): WidgetState {
  const state = {
    label: def.label,
    optional: def.optional
  };

  switch (def.edgeType) {
    case 'BOOLEAN':
      return {
        ...state,
        edgeType: def.edgeType,
        value: def.defaultValue
      };

    case 'INT':
      return {
        ...state,
        edgeType: def.edgeType,
        value: def.defaultValue
      };

    case 'FLOAT':
      return {
        ...state,
        edgeType: def.edgeType,
        value: def.defaultValue
      };

    case 'STRING':
      return {
        ...state,
        edgeType: def.edgeType,
        value: def.defaultValue ?? ''
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
