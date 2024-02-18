import React, { useEffect, useState, ComponentType, useCallback } from 'react';
import {
  NodeDefinition,
  NodeState,
  EdgeType,
  BoolInputState,
  WidgetState,
  InputDef,
  EnumInputDef,
  UpdateWidgetState
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
  def: InputDef,
  label: string,
  state: WidgetState,
  updateNodeState: (newState: Partial<WidgetState>) => void
) => {
  const commonProps = { label };

  switch (state.edgeType) {
    case 'BOOLEAN':
      return (
        <Toggle
          {...commonProps}
          checked={(state as BoolInputState).value || false}
          onChange={(checked: boolean) => updateNodeState({ value: checked })}
        />
      );

    case 'INT':
    case 'FLOAT':
      return (
        <Number
          {...commonProps}
          value={state.value}
          onChange={(value: number) => updateNodeState({ value })}
        />
      );

    case 'STRING':
      return (
        <String
          {...commonProps}
          value={state.value}
          onChange={(value: string) => updateNodeState({ value })}
        />
      );

    case 'ENUM':
      return (
        <Dropdown
          {...commonProps}
          value={state.value}
          onChange={(value: string | string[]) => updateNodeState({ value })}
          options={{ values: (def as EnumInputDef).options }}
          multiSelect={(def as EnumInputDef).multiSelect}
        />
      );

    default:
      console.warn(`Unsupported data type: ${(state as WidgetState).edgeType}`);
      return null;
  }
};

// const selector = (state: RFState) => ({
//   updateNodeState: state.updateNodeState
// });

export const createNodeComponentFromDef = (
  def: NodeDefinition,
  updateWidgetState: UpdateWidgetState
): ComponentType<NodeProps<NodeState>> => {
  const CustomNode = ({ id, data }: NodeProps<NodeState>) => {
    // const { updateNodeState } = useStore(selector);

    // const update = useCallback(
    //   (newState: Partial<NodeState>) => updateWidgetState(id, newState),
    //   [id]
    // );

    // Initialize node state from definition if not already present
    // useEffect(() => {
    //   update({ ...initialState });
    // }, [update]);

    // Test
    const onClick = () => toast.success('File uploaded successfully!');

    // Generate input handles
    const inputHandles = Object.entries(data.inputEdges).map(([label, handle], index) => (
      <div className="flow_input" key={index}>
        <Handle
          id={`input-${label}-${index}`}
          type="target"
          position={Position.Left}
          className={`flow_handler left ${handle.edgeType}`}
        />
        <span className="flow_input_text">{label}</span>
      </div>
    ));

    // Generate output handles
    const outputHandles = Object.entries(data.outputEdges).map(([label, handle], index) => (
      <div className="flow_output" key={index}>
        <Handle
          id={`output-${label}`}
          type="source"
          position={Position.Right}
          className={`flow_handler right ${handle.edgeType}`}
        />
        <span className="flow_output_text">{label}</span>
      </div>
    ));

    // Generate widgets
    const widgets = Object.entries(data.inputWidgets).map(([label, inputState], index) => {
      const inputDef = def.inputs.find((input) => input.label === label);
      if (!inputDef) return;

      const update = (newState: Partial<WidgetState>) => updateWidgetState(id, label, newState);

      return (
        <div key={index} className="widget_container">
          {createWidgetFromSpec(inputDef, label, inputState, update)}
        </div>
      );
    });

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

// const edgeTypeToWidgetType = (edgeType: EdgeType): WidgetTypes | undefined => {
//   switch (edgeType) {
//     case 'INT':
//     case 'FLOAT':
//       return 'number';

//     case 'STRING':
//       return 'string';

//     case 'BOOLEAN':
//       return 'toggle';

//     // case 'IMAGEUPLOAD':
//     //   return 'button';

//     default:
//       return undefined;
//   }
// };
