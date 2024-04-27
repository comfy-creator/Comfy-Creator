import React, { ComponentType, ReactNode, useEffect, useRef, useState } from 'react';
import {
  EnumInputDef,
  ImageInputData,
  InputData,
  InputDef,
  InputHandleData,
  NodeData,
  NodeDefinition,
  OutputData,
  StringInputDef,
  ThemeConfig,
  UpdateInputData
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
import { isMultilineStringInput, isWidgetType, makeHandleId } from '../../lib/utils/node.ts';

const createWidgetFromSpec = (
  def: InputDef,
  label: string,
  data: InputData,
  updateInputData: (newState: Partial<InputData>) => void
) => {
  const commonProps = { label };
  if (data.type !== def.type) return;

  switch (data.type) {
    case 'BOOLEAN':
      return (
        <ToggleWidget
          {...commonProps}
          checked={data.value || false}
          disabled={data.isDisabled}
          onChange={(checked: boolean) => updateInputData({ value: checked })}
        />
      );

    case 'INT':
    case 'FLOAT':
      return (
        <NumberWidget
          {...commonProps}
          value={data.value}
          disabled={data.isDisabled}
          onChange={(value: number) => updateInputData({ value })}
        />
      );

    case 'STRING':
      if ((def as StringInputDef).multiline) {
        return (
          <TextWidget
            {...commonProps}
            value={data.value}
            disabled={data.isDisabled}
            onChange={(value: string) => updateInputData({ value })}
          />
        );
      }
      return (
        <StringWidget
          {...commonProps}
          value={data.value}
          disabled={data.isDisabled}
          onChange={(value: string) => updateInputData({ value })}
        />
      );

    case 'ENUM':
      return (
        <EnumWidget
          {...commonProps}
          value={data.value}
          onChange={(value: string) => updateInputData({ value })}
          // TODO: add options
          options={{ values: [] }}
          disabled={data.isDisabled}
          multiSelect={(def as EnumInputDef).multiSelect}
        />
      );
    case 'IMAGE':
      return <ImageWidget {...commonProps} value={(data as ImageInputData).value} />;

    // case 'VIDEO':
    // return <VideoWidget {...commonProps} value={data.value} />;

    default:
      console.warn(`Unsupported data type: ${(data as InputData).type}`);
      return null;
  }
};

export const createNodeComponentFromDef = (
  nodeDef: NodeDefinition,
  updateInputData: UpdateInputData
): ComponentType<NodeProps<NodeData>> => {
  return ({ id, data, selected }: NodeProps<NodeData>) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [advanced] = useState(false);
    const [minWidth, setMinWidth] = useState(0);
    const [minHeight, setMinHeight] = useState(0);

    const { getActiveTheme, activeTheme } = useSettingsStore();
    const { execution } = useFlowStore();
    const theme = getActiveTheme();

    const { NODE_TEXT_SIZE, NODE_TITLE_COLOR, NODE_TEXT_COLOR } = theme.colors.appearance;

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

      container.style.backgroundColor = appearance.NODE_BG_COLOR;
      container.style.color = appearance.NODE_TEXT_COLOR;
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
    const { inputs, outputs } = data;
    const resizerStyle = {
      width: '12px',
      height: '12px',
      border: 'none',
      cursor: 'se-resize'
    };

    const inputHandles: ReactNode[] = [];
    const inputWidgets: ReactNode[] = [];
    const isOutputNode = nodeDef.output_node || data.isOutputNode;

    for (const name in inputs) {
      const input = inputs[name];

      if (isWidgetType(input.type)) {
        inputWidgets.push(
          <Widget
            nodeId={id}
            theme={theme}
            data={input}
            nodeDef={nodeDef}
            key={input.name}
            updateInputData={updateInputData}
          />
        );
      } else {
        inputHandles.push(
          <InputHandle
            nodeId={id}
            theme={theme}
            key={input.name}
            isConnected={input.isConnected}
            handle={input as InputHandleData}
          />
        );
      }
    }

    // Generate output handles
    const outputHandles = Object.values(outputs).map((handle, i) => (
      <OutputHandle
        nodeId={id}
        key={i}
        theme={theme}
        handle={handle}
        isConnected={handle.isConnected}
      />
    ));

    return (
      <>
        <NodeResizeControl
          style={resizerStyle}
          color="transparent"
          position="bottom-right"
          minWidth={minWidth}
          minHeight={minHeight}
        />

        <div
          style={{ fontSize: NODE_TEXT_SIZE, color: NODE_TEXT_COLOR }}
          className="node_container"
          ref={containerRef}
        >
          <div className="node_label_container">
            <span className="node_label" style={{ color: NODE_TITLE_COLOR }} onClick={onClick}>
              {nodeDef.display_name}
            </span>
          </div>

          {advanced ? (
            <>
              <div>Advanced options</div>
            </>
          ) : (
            <>
              {execution.currentNodeId === id && <ProgressBar />}

              <div className="flow_content">
                <div className="flow_input_output_container">
                  <div className="flow_input_container">{inputHandles}</div>
                  <div className="flow_output_container">{outputHandles}</div>
                </div>

                <div className="widgets_container">{inputWidgets}</div>

                <div className="node_footer">
                  {isOutputNode && <button className="comfy-btn">Run</button>}
                </div>
              </div>
            </>
          )}
        </div>
      </>
    );
  };
};

interface InputHandleProps {
  nodeId: string;
  theme: ThemeConfig;
  isConnected?: boolean;
  handle: InputHandleData;
}

function InputHandle({ nodeId, handle, theme, isConnected }: InputHandleProps) {
  const appearance = theme.colors.types;
  const { NODE_TEXT_COLOR } = theme.colors.appearance;

  const handleStyle = isConnected
    ? { background: appearance[handle.type], border: '1px solid transparent' }
    : { border: `1.5px solid ${appearance[handle.type]}`, backgroundColor: 'transparent' };

  return (
    <div className={`flow_input ${handle.isHighlighted ? 'edge_opacity' : ''}`}>
      <Handle
        type="target"
        style={{ ...handleStyle }}
        position={Position.Left}
        id={makeHandleId(nodeId, 'input', handle.name)}
        className={`flow_handler left ${handle.type}`}
      />
      <span className="flow_input_text" style={{ color: NODE_TEXT_COLOR }}>
        {handle.name}
      </span>
    </div>
  );
}

interface OutputHandleProps {
  nodeId: string;
  handle: OutputData;
  theme: ThemeConfig;
  isConnected?: boolean;
}

function OutputHandle({ nodeId, handle, theme, isConnected }: OutputHandleProps) {
  const appearance = theme.colors.types;
  const { NODE_TEXT_COLOR } = theme.colors.appearance;

  const handleStyle = isConnected
    ? { backgroundColor: appearance[handle.type], border: '1px solid transparent' }
    : { border: `1.5px solid ${appearance[handle.type]}`, backgroundColor: 'transparent' };

  return (
    <div className={`flow_output ${handle.isHighlighted ? 'edge_opacity' : ''}`}>
      <Handle
        type="source"
        position={Position.Right}
        style={{ ...handleStyle }}
        id={makeHandleId(nodeId, 'output', handle.name)}
        className={`flow_handler right ${handle.type}`}
      />
      <span className="flow_output_text" style={{ color: NODE_TEXT_COLOR }}>
        {handle.name}
      </span>
    </div>
  );
}

interface WidgetProps {
  nodeId: string;
  data: InputData;
  theme: ThemeConfig;
  nodeDef: NodeDefinition;
  updateInputData: UpdateInputData;
}

function Widget({ theme, nodeId, data, nodeDef, updateInputData }: WidgetProps) {
  const inputDef = nodeDef.inputs.find((input) => input.name === data.name) ?? (data as InputDef);
  if (!inputDef) return null;

  const update = (data: Partial<InputData>) => {
    if (!data.type || !data.name) return;
    updateInputData({ nodeId, name: data.name, data });
  };

  const isMultiline = isMultilineStringInput(data);
  const containerStyle = !isMultiline ? { display: 'flex', alignItems: 'center' } : {};

  return (
    <div className="widget_container" style={{ ...containerStyle }}>
      <WidgetHandle nodeId={nodeId} data={data} theme={theme} />
      <div style={{ marginLeft: isMultiline ? '0px' : '10px', width: '100%' }}>
        {createWidgetFromSpec(inputDef, data.name, data, update)}
      </div>
    </div>
  );
}

export interface WidgetHandleProps {
  nodeId: string;
  data: InputData;
  theme: ThemeConfig;
}

function WidgetHandle({ nodeId, data, theme }: WidgetHandleProps) {
  const appearance = theme.colors.types;

  const handleStyle = data.primitiveNodeId
    ? { background: appearance[data.type], border: '1px solid transparent' }
    : { border: `1.5px solid ${appearance[data.type]}`, background: 'transparent' };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ ...handleStyle }}
        className={`flow_handler left`}
        id={makeHandleId(nodeId, 'input', data.name)}
      />

      {isMultilineStringInput(data) && <div className="flow_input_text">{data.name}</div>}
    </div>
  );
}
