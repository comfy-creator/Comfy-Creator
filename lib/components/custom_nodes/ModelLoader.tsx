import React, { useEffect, useState, useRef } from 'react';

type ModelLoaderProps = {
  label: string;
  value: string;
  disabled?: boolean;
  options: { values: string[] | (() => string[]) };
  onChange?: (value: string) => void;
  multiSelect?: boolean;
};

export const ModelLoader: React.FC = (
  nodeDef: NodeDefinition,
  updateInputData: UpdateInputData
) => {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [advanced] = useState(false);
  const [minWidth, setMinWidth] = useState(0);
  const [minHeight, setMinHeight] = useState(0);

  const { getActiveTheme, activeTheme } = useSettingsStore();
  const { executions } = useFlowStore();
  const theme = getActiveTheme();

  const { NODE_TEXT_SIZE, NODE_TITLE_COLOR, NODE_TEXT_COLOR } = theme.colors.appearance;

  useEffect(() => {
    const node = document.querySelector(`[data-id="${id}"]`);
    if (!node) return;

    nodeRef.current = node as HTMLDivElement;
  }, []);

  useEffect(() => {
    if (!nodeRef.current) return;

    setMinWidth(nodeRef.current.clientWidth);
    setMinHeight(nodeRef.current.clientHeight);
  }, [nodeRef]);

  useEffect(() => {
    if (!nodeRef.current) return;
    if (!containerRef.current) return;

    const { getActiveTheme } = useSettingsStore.getState();
    const appearance = getActiveTheme().colors.appearance;

    containerRef.current.style.backgroundColor = appearance.NODE_BG_COLOR;
    containerRef.current.style.color = appearance.NODE_TEXT_COLOR;
  }, [activeTheme]);

  // useEffect(() => {
  //   if (!nodeRef.current) return;
  //   const { currentNodeId } = execution;

  //   if (currentNodeId === id) {
  //     nodeRef.current.classList.add('executing');
  //   } else {
  //     if (nodeRef.current.classList.contains('executing')) {
  //       nodeRef.current.classList.remove('executing');
  //     }
  //   }
  // }, [execution]);

  useEffect(() => {
    if (!nodeRef.current) return;

    if (selected) {
      nodeRef.current.classList.add('selected');
    } else {
      nodeRef.current.classList.remove('selected');
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
  const displayWidgets: ReactNode[] = [];
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

    if (isDisplayType(input.type)) {
      displayWidgets.push(<DisplayWidget nodeDef={nodeDef} key={input.name} data={input} />);
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
            {/* {execution.currentNodeId === id && <ProgressBar />} */}

            <div className="flow_content">
              <div className="flow_input_output_container">
                <div className="flow_input_container">{inputHandles}</div>
                <div className="flow_output_container">{outputHandles}</div>
              </div>

              <div className="widgets_container">{inputWidgets}</div>
              <div className="widgets_container">{displayWidgets}</div>

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

export default ModelLoader;
