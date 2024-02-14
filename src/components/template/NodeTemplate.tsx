import React, { useEffect, useState } from "react";
import { InputSpec, NodeData, NodeWidget, WidgetTypes } from "../../types";
import { Handle, Position } from "reactflow";
import { Button } from "../widgets/Button.tsx";
import { Number } from "../widgets/Number.tsx";
import { String } from "../widgets/String.tsx";
import { Text } from "../widgets/Text.tsx";
import { Toggle } from "../widgets/Toggle.tsx";
import { Combo } from "../widgets/Combo.tsx";
import { toast } from "react-toastify";

const inputWidgetTypes = [
  "INT",
  "STRING",
  "BOOLEAN",
  "FLOAT",
  "IMAGEUPLOAD",
  "INT:seed",
  "INT:noise_seed",
];

export const NodeTemplate = ({ data }: { data: NodeData }) => {
  const [inputs, setInputs] = useState({});

  useEffect(() => {
    const {} = data;
  }, []);

  const isWidgetInput = (type: string) => {
    return inputWidgetTypes.includes(type);
  };

  const getNonWidgetInputs = (inputs: Record<string, InputSpec>) => {
    return Object.entries(inputs).filter(
      ([key, value]) => !isWidgetInput(value.type)
    );
  };

  const getWidgetInputs = (inputs: Record<string, InputSpec>) => {
    return Object.entries(inputs).filter(([key, value]) =>
      isWidgetInput(value.type)
    );
  };

  const getWidgetType = (type: string): WidgetTypes => {
    if (type === "INT" || type === "FLOAT") {
      return "number";
    } else if (type === "STRING") {
      return "string";
    } else if (type === "BOOLEAN") {
      return "toggle";
    } else if (type === "IMAGEUPLOAD") {
      return "button";
    } else if (type === "INT:seed" || type === "INT:noise_seed") {
      return "number";
    }

    return "combo";
  };

  const inputToWidget = (key: string, value: InputSpec) => {
    return {
      name: key,
      label: key,
      value: value.default || "",
      type: getWidgetType(value.type),
      onChange: (value: any) => setInputs({ ...inputs, [key]: value }),
    } as NodeWidget;
  };

  const onClick = () => toast.success("File uploaded successfully!")

  return (
    <div className="node">
      <div className="node_container">
        <div className="node_label" onClick={onClick}>{data.label}</div>

        <div className="flow_input_output_container">
          <div className="flow_input_container">
            {/* Render input handles */}
            {getNonWidgetInputs({
              ...data.inputs.required,
              ...data.inputs.optional,
            }).map(([key], index, array) => (
              <div className="flow_input">
                <Handle
                  key={key}
                  type="source"
                  position={Position.Left}
                  id={key}
                  className={`flow_handler left ${key}`}
                />
                <span className="flow_input_text">{key}</span>
              </div>
            ))}
          </div>

          <div className="flow_output_container">
            {/* Render output handles */}
            {data.outputs.map((output, index) => (
              <div className="flow_output">
                <Handle
                  key={output}
                  type="source"
                  position={Position.Right}
                  id={output}
                  className={`flow_handler right ${output}`}
                />
                <span className="flow_output_text">{output}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="widgets_container">
          {getWidgetInputs({
            ...data.inputs.required,
            ...data.inputs.optional,
          }).map(([key, value]) => {
            const widget = inputToWidget(key, value);

            return (
              <div className="widget_container">
                {widget.type === "button" ? (
                  <Button {...widget} />
                ) : widget.type === "number" ? (
                  <Number {...widget} />
                ) : widget.type === "string" ? (
                  <String {...widget} />
                ) : widget.type === "text" ? (
                  <Text {...widget} />
                ) : widget.type === "toggle" ? (
                  <Toggle {...widget} />
                ) : widget.type === "combo" ? (
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
