import React, { ComponentType, useEffect, useRef, useState } from 'react';
import {
  BoolInputState,
  EnumInputDef,
  InputDef,
  NodeDefinition,
  NodeState,
  StringInputDef,
  UpdateWidgetState,
  WidgetState
} from '../../types.ts';
import { toast } from 'react-toastify';
import { Handle, NodeProps, NodeResizeControl, Position } from 'reactflow';
import { NumberWidget } from '../widgets/Number';
import { StringWidget } from '../widgets/String';
import { ToggleWidget } from '../widgets/Toggle';
import { EnumWidget } from '../widgets/Enum';
import { ImageWidget } from '../widgets/Image';
import { VideoWidget } from '../widgets/Video';
import { TextWidget } from '../widgets/Text';
import { themes } from '../../config/themes';
import { IconPlayCircle } from '../icons/PlayIcon';

const createWidgetFromSpec = (
  def: InputDef,
  label: string,
  state: WidgetState,
  updateWidgetState: (newState: Partial<WidgetState>) => void
) => {
  const commonProps = { label };
  if (state.type !== def.type) return;

  switch (state.type) {
    case 'BOOLEAN':
      return (
        <ToggleWidget
          {...commonProps}
          checked={(state as BoolInputState).value || false}
          onChange={(checked: boolean) => updateWidgetState({ value: checked })}
        />
      );

    case 'INT':
    case 'FLOAT':
      return (
        <NumberWidget
          {...commonProps}
          value={state.value}
          onChange={(value: number) => updateWidgetState({ value })}
        />
      );

    case 'STRING':
      if ((def as StringInputDef).multiline) {
        return (
          <TextWidget
            {...commonProps}
            value={state.value}
            onChange={(value: string) => updateWidgetState({ value })}
          />
        );
      }
      return (
        <StringWidget
          {...commonProps}
          value={state.value}
          onChange={(value: string) => updateWidgetState({ value })}
        />
      );

    case 'ENUM':
      return (
        <EnumWidget
          {...commonProps}
          value={state.value}
          onChange={(value: string | string[]) => updateWidgetState({ value })}
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
  return ({ id, data, selected }: NodeProps<NodeState>) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [minWidth, setMinWidth] = useState(0);
    const [minHeight, setMinHeight] = useState(0);

    useEffect(() => {
      if (divRef.current) {
        // Get the width of the div
        // Set the minWidth style based on the div width

        const divWidth = divRef?.current?.offsetWidth;
        const divHeight = divRef?.current?.offsetHeight;

        setMinWidth(divWidth || 0);
        setMinHeight(divHeight || 0);
      }
    }, []);

    const onClick = () => toast.success('File uploaded successfully!');

    const handleNodeClick = () => {
      console.log('Node clicked');
    };

    // Generate input handles
    const inputHandles = Object.entries(data.inputs || []).map(([label, handle], index) => {
      if (handle.hidden) return null;
      const {
        dark: {
          colors: { node_slot }
        }
      } = themes;

      return (
        <div className={`flow_input ${handle.isHighlighted ? 'edge_opacity' : ''}`} key={index}>
          <Handle
            style={{
              backgroundColor:
                node_slot[handle.type as keyof typeof node_slot] ?? node_slot['DEFAULT']
            }}
            id={`input::${index}::${handle.type}`}
            type="target"
            position={Position.Left}
            className={`flow_handler left ${handle.type}`}
          />
          <span className="flow_input_text">{handle.name}</span>
        </div>
      );
    });

    // Generate output handles
    const outputHandles = Object.entries(data.outputs || []).map(([label, handle], index) => {
      if (handle.hidden) return null;
      const {
        dark: {
          colors: { node_slot }
        }
      } = themes;

      return (
        <div className={`flow_output ${handle.isHighlighted ? 'edge_opacity' : ''}`} key={index}>
          <Handle
            style={{
              backgroundColor:
                node_slot[handle.type as keyof typeof node_slot] ?? node_slot['DEFAULT']
            }}
            id={`output::${label}::${handle.type}`}
            type="source"
            position={Position.Right}
            className={`flow_handler right ${handle.type}`}
          />
          <span className="flow_output_text">{handle.name}</span>
        </div>
      );
    });

    // Generate widgets
    const widgets = Object.entries(data.widgets || []).map(([name, inputState], index) => {
      if (inputState.hidden) return null;

      let inputDef: InputDef | undefined;
      if (inputState.definition) {
        inputDef = inputState.definition;
      } else {
        inputDef = def.inputs.find((input) => input.name === name);
      }

      if (!inputDef) return null;

      const update = (newState: Partial<WidgetState>) => {
        if (!inputState.type) return;

        updateWidgetState({
          nodeId: id,
          name,
          newState: {
            ...newState,
            type: inputState.type
          } as WidgetState
        });
      };

      return (
        <div key={index} className="widget_container">
          {createWidgetFromSpec(inputDef, name, inputState, update)}
        </div>
      );
    });

    return (
      <>
        <NodeResizeControl
          style={{
            background: 'transparent',
            cursor: 'se-resize',
            border: 'none'
          }}
          minWidth={minWidth}
          minHeight={minHeight}
          maxHeight={minHeight}
        />
        <div
          style={{
            backgroundColor: data.config.bgColor ? data.config.bgColor : undefined,
            color: data.config.textColor ? data.config.textColor : undefined
          }}
          className={`node_container ${selected ? 'selected' : ''}`}
          ref={divRef}
        >
          {!data.config?.hideLabel && (
            <div className="node_label_container">
              <span className="node_label" onClick={onClick}>
                {def.display_name}
              </span>

              <span className="run_icon">
                <IconPlayCircle />
              </span>
            </div>
          )}

          <div className="flow_input_output_container">
            <div className="flow_input_container">{inputHandles}</div>
            <div className="flow_output_container">{outputHandles}</div>
          </div>
          <div className="widgets_container">{widgets}</div>
        </div>
      </>
    );
  };
};
