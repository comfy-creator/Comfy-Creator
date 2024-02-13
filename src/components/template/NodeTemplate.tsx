import React, { useEffect, useState } from "react";
import { InputSpec, NodeData, NodeWidget, WidgetTypes } from "../../types";
import { Handle, Position } from "reactflow";
import { Button } from "../widgets/Button.tsx";
import { Number } from "../widgets/Number.tsx";
import { String } from "../widgets/String.tsx";
import { Text } from "../widgets/Text.tsx";
import { Toggle } from "../widgets/Toggle.tsx";
import { Combo } from "../widgets/Combo.tsx";

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
      ([key, value]) => !isWidgetInput(value.type),
    );
  };

  const getWidgetInputs = (inputs: Record<string, InputSpec>) => {
    return Object.entries(inputs).filter(([key, value]) =>
      isWidgetInput(value.type),
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

  return (
    <div
      style={{
        fontSize: "10px",
        width: "180px",
        border: "1px solid #ddd",
        padding: "3px",
        borderRadius: "5px",
        background: "#353535",
      }}
    >
      <div
        style={{
          fontSize: ".5em",
          fontFamily: "unset",
          fontWeight: "normal",
          textAlign: "center",
        }}
      >
        {data.label}
      </div>

      {/* Render input handles */}
      {getNonWidgetInputs({
        ...data.inputs.required,
        ...data.inputs.optional,
      }).map(([key], index, array) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Handle
            key={key}
            type="source"
            position={Position.Left}
            id={key}
            style={{
              left: 0,
              background: "purple",
              top: "unset",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              border: "1px solid transparent",
            }}
          />
          <div
            style={{
              marginLeft: "8px",
              fontWeight: "normal",
              fontSize: "0.5em",
            }}
          >
            {key}
          </div>
        </div>
      ))}

      {/* Render output handles */}
      {data.outputs.map((output, index) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Handle
            key={output}
            type="source"
            position={Position.Right}
            id={output}
            style={{
              background: "yellow",
              top: "unset",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              border: "1px solid transparent",
            }}
          />
          <span style={{ marginLeft: "5px", fontSize: "0.8em" }}>{output}</span>
        </div>
      ))}
      <div style={{ marginTop: "3px" }}>
        {getWidgetInputs({
          ...data.inputs.required,
          ...data.inputs.optional,
        }).map(([key, value]) => {
          const widget = inputToWidget(key, value);

          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              <div
                style={{
                  marginLeft: "8px",
                  fontWeight: "normal",
                  fontSize: "0.5em",
                  width: "100%",
                }}
              >
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
            </div>
          );
        })}
      </div>
    </div>
  );
};
