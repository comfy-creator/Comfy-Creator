import React from 'react';
import { NodeDefinition, InputSpec } from '../../types';
import { Handle, Position } from 'reactflow';
// Import your widget components here

// Helper function to dynamically create widget components based on InputSpec
const createWidgetFromSpec = (input: InputSpec) => {
  switch (input.dataType) {
    case 'BOOLEAN':
      return <Toggle label={input.label} defaultValue={input.defaultValue} />;

    case 'INT':
    case 'FLOAT':
      return (
        <Number
          label={input.label}
          defaultValue={input.defaultValue}
          min={input.min}
          max={input.max}
          step={input.step}
        />
      );

    case 'STRING':
      return <String label={input.label} defaultValue={input.defaultValue} />;

    case 'ENUM':
      return (
        <Dropdown label={input.label} defaultValue={input.defaultValue} options={input.options} />
      );

    default:
      console.warn(`Unsupported data type: ${input.dataType}`);
      return null;
  }
};

export const NodeTemplate = ({ def }: { def: NodeDefinition }) => {
  // Assuming def.inputs is an array of InputSpec
  const widgets = def.inputs.map(createWidgetFromSpec);

  return (
    <div className="node">
      {/* Node rendering logic */}
      <div className="widgets_container">{widgets}</div>
    </div>
  );
};
