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
} from '../../lib/types.ts';
import { toast } from 'react-toastify';
import { Handle, NodeProps, NodeResizeControl, Position } from 'reactflow';
import { NumberWidget } from '../widgets/Number';
import { StringWidget } from '../widgets/String';
import { ToggleWidget } from '../widgets/Toggle';
import { EnumWidget } from '../widgets/Enum';
import { ImageWidget } from '../widgets/Image';
import { TextWidget } from '../widgets/Text';
import { useSettingsStore } from '../../store/settings.ts';

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

    // case 'VIDEO':
    // return <VideoWidget {...commonProps} value={state.value} />;

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

    const { getActiveTheme, activeTheme } = useSettingsStore();
    const theme = getActiveTheme();

    const appearance = theme.colors.appearance;

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

    useEffect(() => {
      const node = document.querySelector(`[data-id="${id}"]`) as HTMLDivElement;
      if (!node) return;

      const { getActiveTheme } = useSettingsStore.getState();
      const appearance = getActiveTheme().colors.appearance;

      node.style.backgroundColor = data.config?.bgColor
        ? data.config.bgColor
        : appearance.NODE_BG_COLOR;

      node.style.color = data.config?.textColor
        ? data.config.textColor
        : appearance.NODE_TEXT_COLOR;
    }, [activeTheme]);

    useEffect(() => {
      const node = document.querySelector(`[data-id="${id}"]`) as HTMLDivElement;
      if (!node) return;

      if (selected) {
        node.classList.add('selected');
      } else {
        node.classList.remove('selected');
      }
    }, [selected]);

    const onClick = () => toast.success('File uploaded successfully!');

    const handleNodeClick = () => {
      console.log('Node clicked');
    };

    // Generate input handles
    const inputHandles = Object.entries(data.inputs || []).map(([label, handle], index) => {
      if (handle.hidden) return null;

      return (
        <div className={`flow_input ${handle.isHighlighted ? 'edge_opacity' : ''}`} key={index}>
          <Handle
            style={{
              backgroundColor:
                theme.colors.types[handle.type as keyof typeof theme.colors.types] ??
                theme.colors.types['DEFAULT']
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

      return (
        <div className={`flow_output ${handle.isHighlighted ? 'edge_opacity' : ''}`} key={index}>
          <Handle
            style={{
              backgroundColor:
                theme.colors.types[handle.type as keyof typeof theme.colors.types] ??
                theme.colors.types['DEFAULT']
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
            cursor: 'se-resize',
            border: 'none',
            width: '12px',
            height: '12px'
          }}
          color="transparent"
          position="bottom-right"
          minWidth={minWidth}
          minHeight={minHeight}
        />
        <div
          style={{ fontSize: appearance.NODE_TEXT_SIZE }}
          className={`node_container`}
          ref={divRef}
        >
          {!data.config?.hideLabel && (
            <div className="node_label_container">
              <span
                className="node_label"
                style={{ color: appearance.NODE_TITLE_COLOR }}
                onClick={onClick}
              >
                {def.display_name}
              </span>
            </div>
          )}

          <div className="flow_input_output_container">
            <div className="flow_input_container">{inputHandles}</div>
            <div className="flow_output_container">{outputHandles}</div>
          </div>
          <div className="widgets_container">{widgets}</div>

          <div className="node_footer">
            {(def.output_node || data.config?.isOutputNode) && (
              <button className="comfy-btn">Run</button>
            )}
          </div>
        </div>
      </>
    );
  };
};
