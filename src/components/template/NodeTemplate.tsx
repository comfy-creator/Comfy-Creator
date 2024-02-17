import React, { useEffect, useState, ComponentType } from 'react';
import {
  InputSpec,
  NodeDefinition,
  DataType,
  NodeWidget,
  WidgetTypes,
  canBeWidget
} from '../../types';
import { Handle, Position, NodeTypes, NodeProps } from 'reactflow';
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

// TO DO: input.label is incorrect here; we need another identifier for inputs, like num
const createWidgetFromSpec = (
  input: InputSpec,
  data: any,
  updateNodeData: (id: string, newData: any) => void,
  nodeId: string
) => {
  const commonProps = {
    key: input.label,
    label: input.label,
    // TO DO: get rid of 'any'
    onChange: (newValue: any) => updateNodeData(nodeId, { ...data, [input.label]: newValue })
  };

  switch (input.dataType) {
    case 'BOOLEAN':
      return <Toggle {...commonProps} checked={data[input.label]} />;

    case 'INT':
    case 'FLOAT':
      return <Number {...commonProps} value={data[input.label]} />;

    case 'STRING':
      return <String {...commonProps} value={data[input.label]} />;

    case 'ENUM':
      return <Dropdown {...commonProps} value={data[input.label]} options={input.options} />;

    default:
      console.warn(`Unsupported data type: ${input.dataType}`);
      return null;
  }
};

export const createCustomNodeComponent = (def: NodeDefinition): ComponentType<NodeProps> => {
  const CustomNode = ({ data, id, updateNodeData }) => {
    // Generate input handles
    const inputHandles = def.inputs
      .filter((input) => input.isHandle)
      .map((input, index) => (
        <div className="flow_input" key={index}>
          <Handle
            id={`input-${input.label}`}
            type="target"
            position={Position.Left}
            className={`flow_handler left ${input.dataType}`}
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
          className={`flow_handler right ${output.dataType}`}
        />
        <span className="flow_output_text">{output.label}</span>
      </div>
    ));

    // Generate widgets
    const widgets = def.inputs
      .filter((input) => !input.isHandle)
      .map((input) => (
        <div className="widget_container">
          {createWidgetFromSpec(input, data, updateNodeData, id)}
        </div>
      ));

    // Test
    const onClick = () => toast.success('File uploaded successfully!');

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
          {/* Additional logic for rendering handles or other parts of the node */}
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

// export const NodeTemplate = ({ def }: { def: NodeDefinition }) => {
//   const [inputs, setInputs] = useState(
//     inferIsHandle([...def.inputs.required, ...(def.inputs.optional || [])])
//   );
//   const [outputs, setOutputs] = useState(def.outputs);

//   // TO DO: the handles might be separate state from the input and output defs
//   // const [isHandle, setIsHandle] = useState(false);

//   // Update state if our node definition changes
//   useEffect(() => {
//     // TO DO: make sure we're not changing the state of a isHandle component
//     setInputs(inferIsHandle([...def.inputs.required, ...(def.inputs.optional || [])]));
//     setOutputs(def.outputs);
//   }, [def.inputs, def.outputs]);

//   // Test
//   const onClick = () => toast.success('File uploaded successfully!');

//   return (
//     <div className="node">
//       <div className="node_container">
//         <div className="node_label" onClick={onClick}>
//           {def.display_name}
//         </div>

//         <div className="flow_input_output_container">
//           <div className="flow_input_container">
//             {/* Render input handles */}
//             {Object.entries(inputs)
//               .filter(([_, value]) => value.isHandle)
//               .map(([key, dataType], index) => (
//                 <div className="flow_input" key={index}>
//                   <Handle
//                     id={key}
//                     type="target"
//                     position={Position.Left}
//                     className={`flow_handler left ${key}`}
//                   />
//                   <span className="flow_input_text">{key}</span>
//                 </div>
//               ))}
//           </div>

//           <div className="flow_output_container">
//             {/* Render output handles */}
//             {Object.entries(outputs).map(([key, dataType], index) => (
//               <div className="flow_output" key={index}>
//                 <Handle
//                   id={key}
//                   type="source"
//                   position={Position.Right}
//                   className={`flow_handler right ${dataType}`}
//                 />
//                 <span className="flow_output_text">{key}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="widgets_container">
//           {getWidgetInputs({
//             ...data.inputs.required,
//             ...data.inputs.optional
//           }).map(([key, value]) => {
//             const widget = inputToWidget(key, value);

//             return (
//               <div className="widget_container">
//                 {widget.type === 'button' ? (
//                   <Button {...widget} />
//                 ) : widget.type === 'number' ? (
//                   <Number {...widget} />
//                 ) : widget.type === 'string' ? (
//                   <String {...widget} />
//                 ) : widget.type === 'text' ? (
//                   <Text {...widget} />
//                 ) : widget.type === 'toggle' ? (
//                   <Toggle {...widget} />
//                 ) : widget.type === 'combo' ? (
//                   <Combo {...widget} />
//                 ) : null}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };
