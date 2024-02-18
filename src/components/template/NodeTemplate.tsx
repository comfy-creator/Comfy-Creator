import React, { useEffect, useState, ComponentType, useCallback } from 'react';
import {
  InputSpec,
  NodeDefinition,
  NodeWidget,
  WidgetTypes,
  canBeWidget,
  NodeState,
  EdgeType
} from '../../types';
import { Handle, Position, NodeProps } from 'reactflow';
import { Button } from '../widgets/Button';
import { Number } from '../widgets/Number';
import { String } from '../widgets/String';
import { Text } from '../widgets/Text';
import { Toggle } from '../widgets/Toggle';
import { Dropdown } from '../widgets/Dropdown';
import { toast } from 'react-toastify';
import { useStore, RFState } from '../../store';

const createWidgetFromSpec = (
  input: InputSpec,
  state: NodeState,
  updateNodeState: (newState: Partial<NodeState>) => void
) => {
  const commonProps = {
    label: input.label
  };

  switch (input.edgeType) {
    case 'BOOLEAN':
      return (
        <Toggle
          {...commonProps}
          checked={state.checked || false}
          onChange={(checked: boolean) => updateNodeState({ checked })}
        />
      );

    case 'INT':
    case 'FLOAT':
      return <div></div>; //<Number {...commonProps} value={data[input.label]} />;

    case 'STRING':
      return <div></div>; //<String {...commonProps} value={data[input.label]} />;

    case 'ENUM':
      return <div></div>; //<Dropdown {...commonProps} value={data[input.label]} options={input.options} />;

    default:
      console.warn(`Unsupported data type: ${(input as InputSpec).edgeType}`);
      return null;
  }
};

const selector = (state: RFState) => ({
  updateNodeState: state.updateNodeState
});

// TO DO: input isHandle will have to change

export const createNodeComponentFromDef = (
  def: NodeDefinition
): ComponentType<NodeProps<NodeState>> => {
  const CustomNode = ({ id, data }: NodeProps<NodeState>) => {
    const { updateNodeState } = useStore(selector);

    const update = useCallback(
      (newState: Partial<NodeState>) => updateNodeState(id, newState),
      [updateNodeState, id]
    );

    // Initialize node state from definition if not already present
    useEffect(() => {
      update({ ...initialState });
    }, [update]);

    // Test
    const onClick = () => toast.success('File uploaded successfully!');

    // Generate input handles
    const inputHandles = def.inputs
      .filter((input) => input.isHandle)
      .map((input, index) => (
        <div className="flow_input" key={index}>
          <Handle
            id={`input-${input.label}`}
            type="target"
            position={Position.Left}
            className={`flow_handler left ${input.edgeType}`}
          />
          <span className="flow_input_text">{input.label}</span>
        </div>
      ));

    // Generate output handles
    const outputHandles = def.outputs.map((output, index) => (
      <div className="flow_output" key={index}>
        <Handle
          id={`output-${output.label}`}
          type="source"
          position={Position.Right}
          className={`flow_handler right ${output.edgeType}`}
        />
        <span className="flow_output_text">{output.label}</span>
      </div>
    ));

    // Generate widgets
    const widgets = def.inputs
      .filter((input) => !input.isHandle)
      .map((input, index) => (
        <div key={index} className="widget_container">
          {createWidgetFromSpec(input, data, update)}
        </div>
      ));

    return (
      <div className="node">
        <div className="node_container">
          <div className="node_label" onClick={onClick}>
            {def.display_name}
          </div>
          <div className="flow_input_output_container">
            <div className="flow_input_container">{inputHandles}</div>
            <div className="flow_output_container">{outputHandles}</div>
          </div>
          <div className="widgets_container">{widgets}</div>
        </div>
      </div>
    );
  };

  return CustomNode;
};

// If true, this will return a widget, otherwise it will return a target-handle for an
// edge to connect into
// const isWidgetInput = (type: string) => {
//   return inputWidgetTypes.includes(type);
// };

const edgeTypeToWidgetType = (edgeType: EdgeType): WidgetTypes | undefined => {
  switch (edgeType) {
    case 'INT':
    case 'FLOAT':
      return 'number';

    case 'STRING':
      return 'string';

    case 'BOOLEAN':
      return 'toggle';

    // case 'IMAGEUPLOAD':
    //   return 'button';

    default:
      return undefined;
  }
};
