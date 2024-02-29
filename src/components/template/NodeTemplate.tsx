import React, { ComponentType } from 'react';
import {
  BoolInputState,
  EnumInputDef,
  InputDef,
  NodeDefinition,
  NodeState,
  StringInputDef,
  UpdateWidgetState,
  WidgetState
} from '../../types';
import { Handle, NodeProps, Position } from 'reactflow';
import { Number as NumberWidget } from '../widgets/Number';
import { String as StringWidget } from '../widgets/String';
import { Toggle as ToggleWidget } from '../widgets/Toggle';
import { Enum as EnumWidget } from '../widgets/Enum.tsx';
import { toast } from 'react-toastify';
import { Image as ImageWidget } from '../widgets/Image.tsx';
import { Video as VideoWidget } from '../widgets/Video.tsx';
import { Text as TextWidget } from '../widgets/Text.tsx';

const createWidgetFromSpec = (
  def: InputDef,
  label: string,
  state: WidgetState,
  updateNodeState: (newState: Partial<WidgetState>) => void
) => {
  const commonProps = { label };
  if (state.type !== def.type) return;

  switch (state.type) {
    case 'BOOLEAN':
      return (
        <ToggleWidget
          {...commonProps}
          checked={(state as BoolInputState).value || false}
          onChange={(checked: boolean) => updateNodeState({ value: checked })}
        />
      );

    case 'INT':
    case 'FLOAT':
      return (
        <NumberWidget
          {...commonProps}
          value={state.value}
          onChange={(value: number) => updateNodeState({ value })}
        />
      );

    case 'STRING':
      if ((def as StringInputDef).multiline) {
        return <TextWidget {...commonProps} value={state.value} />;
      }
      return (
        <StringWidget
          {...commonProps}
          value={state.value}
          onChange={(value: string) => updateNodeState({ value })}
        />
      );

    case 'ENUM':
      return (
        <EnumWidget
          {...commonProps}
          value={state.value}
          onChange={(value: string | string[]) => updateNodeState({ value })}
          options={{ values: (def as EnumInputDef).options }}
          multiSelect={(def as EnumInputDef).multiSelect}
        />
      );
    case 'IMAGE':
      return <ImageWidget {...commonProps} value={state.value} />;

    case 'VIDEO':
      return <VideoWidget {...commonProps} value={state.value} />;

    default:
      console.warn(`Unsupported data type: ${(state as WidgetState).type}`);
      return null;
  }
};

export const createNodeComponentFromDef = (
  def: NodeDefinition,
  updateWidgetState: UpdateWidgetState
): ComponentType<NodeProps<NodeState>> => {
  const CustomNode = ({ id, data }: NodeProps<NodeState>) => {
    // Test
    const onClick = () => toast.success('File uploaded successfully!');

    // Generate input handles
    const inputHandles = Object.entries(data.inputs || []).map(([label, handle], index) => (
      <div className="flow_input" key={index}>
        <Handle
          id={`input-${label}-${index}`}
          type="target"
          position={Position.Left}
          className={`flow_handler left ${handle.type}`}
        />
        <span className="flow_input_text">{handle.name}</span>
      </div>
    ));

    // Generate output handles
    const outputHandles = Object.entries(data.outputs || []).map(([label, handle], index) => (
      <div className="flow_output" key={index}>
        <Handle
          id={`output-${label}`}
          type="source"
          position={Position.Right}
          className={`flow_handler right ${handle.type}`}
        />
        <span className="flow_output_text">{handle.name}</span>
      </div>
    ));

    // Generate widgets
    const widgets = Object.entries(data.widgets || []).map(([name, inputState], index) => {
      const inputDef = def.inputs.find((input) => input.name === name);
      if (!inputDef) return;

      const update = (newState: Partial<WidgetState>) =>
        updateWidgetState({ nodeId: id, name, newState });

      return (
        <div key={index} className="widget_container">
          {createWidgetFromSpec(inputDef, name, inputState, update)}
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

// const typeToWidgetType = (type: EdgeType): WidgetTypes | undefined => {
//   switch (type) {
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
