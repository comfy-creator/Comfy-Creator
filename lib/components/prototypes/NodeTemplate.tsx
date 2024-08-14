import React, { ComponentType, ReactNode, useEffect, useRef, useState } from 'react';
import {
   AppNode,
   HandleState,
   NodeData,
   NodeDefinition,
   ThemeConfig,
   UpdateInputData
} from '../../types/types';
import { toast } from 'react-toastify';
import {
   Handle,
   NodeProps,
   NodeResizeControl,
   Position,
   ReactFlowState,
   useStore
} from '@xyflow/react';
import { NumberWidget } from '../widgets/Number';
import { StringWidget } from '../widgets/String';
import { ToggleWidget } from '../widgets/Toggle';
import { EnumWidget } from '../widgets/Enum';
import { ImageWidget } from '../widgets/Image';
import { TextWidget } from '../widgets/Text';
import { useSettingsStore } from '../../store/settings';
import { useFlowStore } from '../../store/flow';
import { ProgressBar } from '../ProgressBar';
import {
   isDisplayType,
   isMultilineStringInput,
   isWidgetType,
   makeHandleId
} from '../../utils/node';
import { FilePickerWidget } from '../widgets/FilePicker';
import { TRANSFORM_POINT } from '../../config/constants';

const createWidgetFromSpec = (
   def: HandleState,
   label: string,
   data: HandleState,
   updateInputData?: (newState: Partial<HandleState>) => void
) => {
   const commonProps = { label };
   if (data.edge_type !== def.edge_type) return;

   const updateData = { display_name: data.display_name, edge_type: data.edge_type };
   switch (data.edge_type) {
      case 'BOOLEAN':
         return (
            <ToggleWidget
               {...commonProps}
               checked={(data.value as boolean) || false}
               disabled={data.isDisabled}
               onChange={(checked: boolean) => updateInputData?.({ ...updateData, value: checked })}
            />
         );

      case 'INT':
      case 'FLOAT':
         return (
            <NumberWidget
               {...commonProps}
               value={data.value as number}
               disabled={data.isDisabled}
               onChange={(value: number) => updateInputData?.({ ...updateData, value })}
            />
         );

      case 'STRING':
         if (def.isMultiline) {
            return (
               <TextWidget
                  {...commonProps}
                  value={data.value as string}
                  disabled={data.isDisabled}
                  onChange={(value: string) => updateInputData?.({ ...updateData, value })}
               />
            );
         }
         return (
            <StringWidget
               {...commonProps}
               value={data.value as string}
               disabled={data.isDisabled}
               onChange={(value: string) => updateInputData?.({ ...updateData, value })}
            />
         );

      case 'ENUM':
         return (
            <EnumWidget
               {...commonProps}
               value={data.value as string}
               onChange={(value: string) => updateInputData?.({ ...updateData, value })}
               // TODO: add options
               options={{ values: [] }}
               disabled={data.isDisabled}
               multiSelect={def.isMultiSelect}
            />
         );

      case 'IMAGE':
         return <ImageWidget {...commonProps} value={data.value as string} />;

      case 'FILEPICKER':
         return <FilePickerWidget />;

      // case 'VIDEO':
      // return <VideoWidget {...commonProps} value={data.value} />;

      default:
         console.warn(`Unsupported data type: ${(data as HandleState).edge_type}`);
         return null;
   }
};

export const createNodeComponentFromDef = (
   nodeDef: NodeDefinition,
   updateInputData: UpdateInputData
): ComponentType<NodeProps<AppNode>> => {
   return ({ id, data, selected }: NodeProps<AppNode>) => {
      const nodeRef = useRef<HTMLDivElement | null>(null);
      const containerRef = useRef<HTMLDivElement>(null);

      const [advanced] = useState(false);
      const [minWidth, setMinWidth] = useState(0);
      const [minHeight, setMinHeight] = useState(0);

      const { getActiveTheme, activeTheme } = useSettingsStore();
      const { executions } = useFlowStore();
      const theme = getActiveTheme();

      const { NODE_TEXT_SIZE, NODE_TITLE_COLOR, NODE_TEXT_COLOR } = theme.colors.appearance;

      const zoomSelector = useStore((s: ReactFlowState) => s.transform[2]);

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
      const isOutputNode = nodeDef.output_node || data.output_node;

      for (const name in inputs) {
         const input = inputs[name];

         if (isWidgetType(input.edge_type)) {
            inputWidgets.push(
               <Widget
                  nodeId={id}
                  theme={theme}
                  data={input}
                  nodeDef={nodeDef}
                  key={input.display_name}
                  updateInputData={updateInputData}
               />
            );
         } else {
            inputHandles.push(
               <InputHandle
                  nodeId={id}
                  theme={theme}
                  key={input.display_name}
                  // isConnected={input.isConnected}
                  handle={input as HandleState}
               />
            );
         }

         if (isDisplayType(input.edge_type)) {
            displayWidgets.push(
               <DisplayWidget nodeDef={nodeDef} key={input.display_name} data={input} />
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
            // isConnected={handle.isConnected}
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
                  <span
                     className="node_label"
                     style={{ ...getTransformStyle(zoomSelector), color: NODE_TITLE_COLOR }}
                     onClick={onClick}
                  >
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
};

export const GroupNode = () => {
   const resizerStyle = {
      width: '12px',
      height: '12px',
      border: 'none',
      cursor: 'se-resize'
   };
   const { getActiveTheme } = useSettingsStore();

   const theme = getActiveTheme();

   const { NODE_TEXT_SIZE, NODE_TITLE_COLOR, NODE_TEXT_COLOR } = theme.colors.appearance;
   const zoomSelector = useStore((s: ReactFlowState) => s.transform[2]);

   return (
      <>
         <NodeResizeControl
            style={resizerStyle}
            color="transparent"
            position="bottom-right"
            minWidth={400}
            minHeight={400}
         />
         <div
            style={{ fontSize: NODE_TEXT_SIZE, color: NODE_TEXT_COLOR, width: '400px', height: '400px' }}
            className="node_container"
         >
            <div className="node_label_container">
               <span
                  className="node_label"
                  style={{ ...getTransformStyle(zoomSelector), color: NODE_TITLE_COLOR }}
               >
                  Group
               </span>
            </div>
         </div>
      </>
   );
};

interface InputHandleProps {
   nodeId: string;
   theme: ThemeConfig;
   isConnected?: boolean;
   handle: HandleState;
}

function InputHandle({ nodeId, handle, theme, isConnected }: InputHandleProps) {
   const transform = useStore((s: ReactFlowState) => s.transform[2]);
   const transformScale = Math.max(1, 1 / transform);
   const showInput = transformScale < TRANSFORM_POINT;

   const appearance = theme.colors.types;
   const { NODE_TEXT_COLOR } = theme.colors.appearance;

   const handleStyle = isConnected
      ? { background: appearance[handle.edge_type], border: '1px solid transparent' }
      : { border: `1.5px solid ${appearance[handle.edge_type]}`, backgroundColor: 'transparent' };

   return showInput ? (
      <div className={`flow_input ${handle.isHighlighted ? 'edge_opacity' : ''}`}>
         <Handle
            type="target"
            style={{ ...handleStyle }}
            position={Position.Left}
            id={makeHandleId(nodeId, handle.display_name)}
            className={`flow_handler left ${handle.edge_type}`}
         />
         <span className="flow_input_text" style={{ color: NODE_TEXT_COLOR }}>
            {handle.display_name}
         </span>
      </div>
   ) : (
      <div className="flow_input_output_container"></div>
   );
}

interface OutputHandleProps {
   nodeId: string;
   handle: HandleState;
   theme: ThemeConfig;
   isConnected?: boolean;
}

function OutputHandle({ nodeId, handle, theme, isConnected }: OutputHandleProps) {
   const transform = useStore((s: ReactFlowState) => s.transform[2]);
   const transformScale = Math.max(1, 1 / transform);
   const showOutput = transformScale < TRANSFORM_POINT;

   const appearance = theme.colors.types;
   const { NODE_TEXT_COLOR } = theme.colors.appearance;

   const handleStyle = isConnected
      ? { backgroundColor: appearance[handle.edge_type], border: '1px solid transparent' }
      : { border: `1.5px solid ${appearance[handle.edge_type]}`, backgroundColor: 'transparent' };

   return showOutput ? (
      <div className={`flow_output ${handle.isHighlighted ? 'edge_opacity' : ''}`}>
         <Handle
            type="source"
            position={Position.Right}
            style={{ ...handleStyle }}
            id={makeHandleId(nodeId, handle.display_name)}
            className={`flow_handler right ${handle.edge_type}`}
         />
         <span className="flow_output_text" style={{ color: NODE_TEXT_COLOR }}>
            {handle.display_name}
         </span>
      </div>
   ) : (
      <div className="flow_input_output_container"></div>
   );
}

interface WidgetProps {
   nodeId: string;
   data: HandleState;
   theme: ThemeConfig;
   nodeDef: NodeDefinition;
   updateInputData: UpdateInputData;
}

function Widget({ theme, nodeId, data, nodeDef, updateInputData }: WidgetProps) {
   const transform = useStore((s: ReactFlowState) => s.transform[2]);
   const transformScale = Math.max(1, 1 / transform);
   const showWidget = transformScale < TRANSFORM_POINT;

   const inputDef = nodeDef.inputs[data.display_name] ?? data;
   if (!inputDef) return null;

   const update = (data: Partial<HandleState>) => {
      if (!data.edge_type || !data.display_name) return;
      updateInputData({ nodeId, display_name: data.display_name, data });
   };

   const isMultiline = isMultilineStringInput(data);
   const containerStyle = !isMultiline ? { display: 'flex', alignItems: 'center' } : {};

   return showWidget ? (
      <div className="widget_container" style={{ ...containerStyle }}>
         <WidgetHandle nodeId={nodeId} data={data} theme={theme} />
         <div style={{ marginLeft: isMultiline ? '0px' : '10px', width: '100%' }}>
            {createWidgetFromSpec(inputDef, data.display_name, data, update)}
         </div>
      </div>
   ) : (
      <div className="widget_container" style={{ ...containerStyle }}>
         <div className="widget_box"></div>
      </div>
   );
}

export interface WidgetHandleProps {
   nodeId: string;
   data: HandleState;
   theme: ThemeConfig;
}

function WidgetHandle({ nodeId, data, theme }: WidgetHandleProps) {
   const appearance = theme.colors.types;

   const handleStyle = data.primitiveNodeId
      ? { background: appearance[data.edge_type], border: '1px solid transparent' }
      : { border: `1.5px solid ${appearance[data.edge_type]}`, background: 'transparent' };

   return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
         <Handle
            type="target"
            position={Position.Left}
            style={{ ...handleStyle }}
            className={`flow_handler left`}
            id={makeHandleId(nodeId, data.display_name)}
         />

         {isMultilineStringInput(data) && (
            <div className="flow_input_text">{data.display_name}</div>
         )}
      </div>
   );
}

interface DisplayProps {
   data: HandleState;
   nodeDef: NodeDefinition;
}

function DisplayWidget({ data, nodeDef }: DisplayProps) {
   const inputDef = nodeDef.inputs[data.display_name] ?? (data as HandleState);
   if (!inputDef) return null;

   return (
      <div className="widget_container">
         <div style={{ width: '100%' }}>
            {createWidgetFromSpec(inputDef, data.display_name, data)}
         </div>
      </div>
   );
}

export function getTransformStyle(scale: number) {
   const transform = Math.max(1, 1 / scale);
   if (transform > 1.9) {
      return {
         display: 'none'
      };
   }
   if (transform > 1.65) {
      return {
         transform: `scale(${transform})`,
         transformOrigin: '0 90%',
         top: -16,
         left: 0,
         fontSize: 8
      };
   }
   if (transform > 1.5) {
      return {
         transform: `scale(${transform})`,
         transformOrigin: '0 90%',
         top: -16,
         left: 0,
         fontSize: 8
      };
   }
   if (transform > 1.3) {
      return {
         transformOrigin: '0 50%',
         transform: `scale(${transform})`,
         fontSize: 10
      };
   }

   return {
      transformOrigin: '0 50%',
      transform: `scale(${transform})`
   };
}
