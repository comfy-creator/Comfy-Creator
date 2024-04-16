import React, { ComponentType, useEffect, useRef, useState } from 'react';
import {
  BoolInputState,
  EnumInputDef,
  InputDef,
  InputHandle as IInputHandle,
  NodeDefinition,
  NodeState,
  OutputHandle as IOutputHandle,
  StringInputDef,
  ThemeConfig,
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
import { useFlowStore } from '../../store/flow.ts';
import { ProgressBar } from '../ProgressBar.tsx';

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
          onChange={(value: string) => updateWidgetState({ value })}
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
  nodeDef: NodeDefinition,
  updateWidgetState: UpdateWidgetState
): ComponentType<NodeProps<NodeState>> => {
  return ({ id, data, selected }: NodeProps<NodeState>) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [minWidth, setMinWidth] = useState(0);
    const [minHeight, setMinHeight] = useState(0);

    const { getActiveTheme, activeTheme } = useSettingsStore();
    const { execution } = useFlowStore();
    const theme = getActiveTheme();

    const { NODE_TEXT_SIZE, NODE_TITLE_COLOR } = theme.colors.appearance;

    useEffect(() => {
      const node = document.querySelector(`[data-id="${id}"]`);
      if (!node) return;

      setMinWidth(node.clientWidth);
      setMinHeight(node.clientHeight);
    }, []);

    useEffect(() => {
      const node = document.querySelector(`[data-id="${id}"]`);
      const container = node?.querySelector('.node_container') as HTMLDivElement;
      if (!container) return;

      const { getActiveTheme } = useSettingsStore.getState();
      const appearance = getActiveTheme().colors.appearance;

      container.style.backgroundColor = data.config?.bgColor
        ? data.config.bgColor
        : appearance.NODE_BG_COLOR;

      container.style.color = data.config?.textColor
        ? data.config.textColor
        : appearance.NODE_TEXT_COLOR;
    }, [activeTheme]);

    useEffect(() => {
      const node = document.querySelector(`[data-id="${id}"]`) as HTMLDivElement;
      if (!node) return;

      const { currentNodeId } = execution;

      if (currentNodeId === id) {
        node.classList.add('executing');
      } else {
        if (node.classList.contains('executing')) {
          node.classList.remove('executing');
        }
      }
    }, [execution]);

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
    const { inputs, outputs, widgets } = data;
    const resizerStyle = {
      width: '12px',
      height: '12px',
      border: 'none',
      cursor: 'se-resize'
    };

    // Generate input handles
    const inputHandles = inputs.map(
      (handle, index) =>
        !handle.hidden && <InputHandle key={index} index={index} theme={theme} handle={handle} />
    );

    // Generate output handles
    const outputHandles = outputs.map(
      (handle, index) =>
        !handle.hidden && <OutputHandle key={index} index={index} theme={theme} handle={handle} />
    );

    // Generate widgets
    const displayWidgets = Object.entries(widgets).map(
      ([name, state], index) =>
        !state.hidden && (
          <Widget
            key={index}
            name={name}
            nodeId={id}
            state={state}
            nodeDef={nodeDef}
            updateWidgetState={updateWidgetState}
          />
        )
    );

    return (
      <>
        <NodeResizeControl
          style={resizerStyle}
          color="transparent"
          position="bottom-right"
          minWidth={minWidth}
          minHeight={minHeight}
        />

        <div style={{ fontSize: NODE_TEXT_SIZE }} className={`node_container`} ref={divRef}>
          {!data.config?.hideLabel && (
            <div className="node_label_container">
              <span className="node_label" style={{ color: NODE_TITLE_COLOR }} onClick={onClick}>
                {nodeDef.display_name}
              </span>
            </div>
          )}

          {execution.currentNodeId === id && <ProgressBar />}

          <div className="flow_content">
            <div className="flow_input_output_container">
              <div className="flow_input_container">{inputHandles}</div>
              <div className="flow_output_container">{outputHandles}</div>
            </div>

            <div className="widgets_container">{displayWidgets}</div>

            <div className="node_footer">
              {(nodeDef.output_node || data.config?.isOutputNode) && (
                <button className="comfy-btn">Run</button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };
};

interface InputHandleProps {
  handle: IInputHandle;
  theme: ThemeConfig;
  index: number;
}

function InputHandle({ index, handle, theme }: InputHandleProps) {
  return (
    <div className={`flow_input ${handle.isHighlighted ? 'edge_opacity' : ''}`}>
      <Handle
        style={{
          backgroundColor:
            theme.colors.types[handle.type as keyof typeof theme.colors.types] ??
            theme.colors.types['DEFAULT']
        }}
        id={`input::${index}::${handle.type}`}
        type="target"
        position={Position.Left}
        className={`flow_handler flow_input_output_handler left ${handle.type}`}
      />
      <span className="flow_input_text">{handle.name}</span>
    </div>
  );
}

interface OutputHandleProps {
  handle: IOutputHandle;
  theme: ThemeConfig;
  index: number;
}

function OutputHandle({ index, handle, theme }: OutputHandleProps) {
  return (
    <div className={`flow_output ${handle.isHighlighted ? 'edge_opacity' : ''}`}>
      <Handle
        style={{
          backgroundColor:
            theme.colors.types[handle.type as keyof typeof theme.colors.types] ??
            theme.colors.types['DEFAULT']
        }}
        id={`output::${index}::${handle.type}`}
        type="source"
        position={Position.Right}
        className={`flow_handler flow_input_output_handler right ${handle.type}`}
      />
      <span className="flow_output_text">{handle.name}</span>
    </div>
  );
}

interface WidgetProps {
  name: string;
  nodeId: string;
  state: WidgetState;
  nodeDef: NodeDefinition;
  updateWidgetState: UpdateWidgetState;
}

function Widget({ name, nodeId, state, nodeDef, updateWidgetState }: WidgetProps) {
  let inputDef: InputDef | undefined = state.definition;
  if (!inputDef) {
    inputDef = nodeDef.inputs.find((input) => input.name === name);
  }

  if (!inputDef) return null;

  const update = (data: Partial<WidgetState>) => {
    if (!state.type) return;
    updateWidgetState({ nodeId, name, data });
  };

  return (
    <div className="widget_container">
      <Handle
        type="target"
        position={Position.Left}
        id={`${nodeId}::widget::${name}`}
        className={`flow_handler left`}
        style={{ border: `1.5px solid red` }}
      />

      <div style={{ width: '1px' }} />

      <div className="flow_input_text" style={{ width: '100%' }}>
        {createWidgetFromSpec(inputDef, name, state, update)}
      </div>
    </div>
  );
}
