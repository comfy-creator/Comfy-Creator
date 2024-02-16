import React, { useEffect, useState } from 'react';
import {
  InputSpec,
  NodeDefinition,
  DataType,
  NodeWidget,
  WidgetTypes,
  canBeWidget
} from '../../types';
import { Handle, Position } from 'reactflow';
import { Button } from '../widgets/Button';
import { Number } from '../widgets/Number';
import { String } from '../widgets/String';
import { Text } from '../widgets/Text';
import { Toggle } from '../widgets/Toggle';
import { Dropdown } from '../widgets/Dropdown';
import { toast } from 'react-toastify';

const dataTypeToWidgetType = (dataType: DataType): WidgetTypes | undefined => {
  switch (dataType) {
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

const getWidget = (input: InputSpec) => {
  const { label, dataType } = input;
  // const widgetType = dataTypeToWidgetType(dataType);

  // const widgetProps = {
  //   dataType,
  //   label,
  //   value: input.default
  //   // onChange: inputSpec.onChange // Assuming onChange is part of InputSpec
  // };

  switch (input.dataType) {
    case 'BOOLEAN':
      widgetComponent = <Toggle {...commonProps} />;
      break;

    case 'INT':
    case 'FLOAT':
      widgetComponent = <Number {...commonProps} />;
      break;

    case 'STRING':
      widgetComponent = <String {...commonProps} />;
      break;

    case 'ENUM':
      const enumProps = { ...commonProps, options: input.options };
      widgetComponent = <Dropdown {...enumProps} />;
      break;

    default:
      console.warn(`Unsupported data type: ${input.dataType}`);
  }

  return widgetComponent;

  switch (widgetType) {
    case 'button':
      return <Button {...widgetProps} />;
    case 'number':
      return <Number {...widgetProps} />;
    case 'string':
      return <String {...widgetProps} />;
    case 'toggle':
      return <Toggle {...widgetProps} />;
    case 'combo':
      return <Dropdown {...widgetProps} />;
    default:
      return null; // Or any fallback component
  }
};

// If true, this will return a widget, otherwise it will return a target-handle for an
// edge to connect into
// const isWidgetInput = (type: string) => {
//   return inputWidgetTypes.includes(type);
// };

// This infers the `isHandle` property for each input based on the inputs DataType if
// 'isHandle' is currently undefined.
const inferIsHandle = (inputs: InputSpec[]): InputSpec[] => {
  return inputs.map((input, index) => {
    if (input.isHandle === undefined) {
      input.isHandle = !canBeWidget.includes(input.dataType);
    }
    return input;
  }, {});
};

export const NodeTemplate = ({ def }: { def: NodeDefinition }) => {
  const [inputs, setInputs] = useState(
    inferIsHandle([...def.inputs.required, ...(def.inputs.optional || [])])
  );
  const [outputs, setOutputs] = useState(def.outputs);

  // TO DO: the handles might be separate state from the input and output defs
  // const [isHandle, setIsHandle] = useState(false);

  // Update state if our node definition changes
  useEffect(() => {
    // TO DO: make sure we're not changing the state of a isHandle component
    setInputs(inferIsHandle([...def.inputs.required, ...(def.inputs.optional || [])]));
    setOutputs(def.outputs);
  }, [def.inputs, def.outputs]);

  // Test
  const onClick = () => toast.success('File uploaded successfully!');

  return (
    <div className="node">
      <div className="node_container">
        <div className="node_label" onClick={onClick}>
          {def.display_name}
        </div>

        <div className="flow_input_output_container">
          <div className="flow_input_container">
            {/* Render input handles */}
            {Object.entries(inputs)
              .filter(([_, value]) => value.isHandle)
              .map(([key, dataType], index) => (
                <div className="flow_input" key={index}>
                  <Handle
                    id={key}
                    type="target"
                    position={Position.Left}
                    className={`flow_handler left ${key}`}
                  />
                  <span className="flow_input_text">{key}</span>
                </div>
              ))}
          </div>

          <div className="flow_output_container">
            {/* Render output handles */}
            {Object.entries(outputs).map(([key, dataType], index) => (
              <div className="flow_output" key={index}>
                <Handle
                  id={key}
                  type="source"
                  position={Position.Right}
                  className={`flow_handler right ${dataType}`}
                />
                <span className="flow_output_text">{key}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="widgets_container">
          {getWidgetInputs({
            ...data.inputs.required,
            ...data.inputs.optional
          }).map(([key, value]) => {
            const widget = inputToWidget(key, value);

            return (
              <div className="widget_container">
                {widget.type === 'button' ? (
                  <Button {...widget} />
                ) : widget.type === 'number' ? (
                  <Number {...widget} />
                ) : widget.type === 'string' ? (
                  <String {...widget} />
                ) : widget.type === 'text' ? (
                  <Text {...widget} />
                ) : widget.type === 'toggle' ? (
                  <Toggle {...widget} />
                ) : widget.type === 'combo' ? (
                  <Combo {...widget} />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
