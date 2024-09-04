import React, { ComponentType, ReactNode, useEffect, useRef, useState, useCallback } from 'react';
import {
   AppNode,
   HandleState,
   NodeData,
   NodeDefinition,
   ThemeConfig,
   UpdateInputData,
   EdgeType,
   WidgetDefinition
} from '../../types/types';
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
import { isDisplayType, makeHandleId } from '../../utils/node';
import { FilePickerWidget, FileProps } from '../widgets/FilePicker';
import { TRANSFORM_POINT } from '../../config/constants';
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from '@nextui-org/react';

const createWidgetFromSpec = (
   def: HandleState,
   label: string,
   data: HandleState,
   updateInputData?: (newState: Partial<HandleState>) => void
) => {
   const commonProps = { label };
   if (data.edge_type !== def.edge_type) return null; // ????? Do we need defs AND data?

   const updateData = { display_name: data.display_name, edge_type: data.edge_type };
   if (data.widget === 'hidden') return null;

   // Check if widget is defined and not 'hidden'
   if (data.widget) {
      switch (data.widget.type) {
         case 'TOGGLE':
            console.log('In data widget', data);
            return (
               <ToggleWidget
                  {...commonProps}
                  checked={((data.value || data?.widget?.checked) as boolean) || true}
                  disabled={data.isDisabled}
                  onChange={(checked: boolean) =>
                     updateInputData?.({ ...updateData, value: checked })
                  }
               />
            );
         case 'NUMBER':
            return (
               <NumberWidget
                  {...commonProps}
                  value={data.value as number}
                  disabled={data.isDisabled}
                  onChange={(value: number) => updateInputData?.({ ...updateData, value })}
               />
            );
         case 'TEXT':
            return (
               <TextWidget
                  {...commonProps}
                  value={data.value as string}
                  disabled={data.isDisabled}
                  onChange={(value: string) => updateInputData?.({ ...updateData, value })}
               />
            );
         case 'FILEPICKER':
            return (
               <FilePickerWidget
                  onChange={(value: string | string[]) =>
                     updateInputData?.({ ...updateData, value })
                  }
                  value={data.value as string | string[]}
                  {...(data.widget as FileProps)}
               />
            );
         case 'DROPDOWN':
            return (
               <EnumWidget
                  {...commonProps}
                  value={data.value as string}
                  onChange={(value: string) => updateInputData?.({ ...updateData, value })}
                  options={data.widget.options || { values: [] }}
                  disabled={data.isDisabled}
                  multiSelect={data.widget.multiSelect}
               />
            );
         // Add cases for other widget types as needed
      }
   }

   // If no widget is defined, use the default widget for this edge_type, if one exists
   switch (data.edge_type) {
      case 'BOOLEAN':
         console.log('In data edge type');
         return (
            <ToggleWidget
               {...commonProps}
               checked={(data.value as boolean) || true}
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
               options={[]}
               disabled={data.isDisabled}
            />
         );

      default:
         console.warn(`Unsupported data type: ${data.edge_type}`);
         return null;
   }
};

export const createNodeComponentFromDef = (
   nodeDef: NodeDefinition,
   updateInputData: UpdateInputData
): ComponentType<NodeProps<AppNode>> => {
   return ({ id, data, selected, width: nodeWidth, height: nodeHeight }: NodeProps<AppNode>) => {
      const { onNodesChange } = useFlowStore((state) => state);

      const nodeRef = useRef<HTMLDivElement | null>(null);
      const containerRef = useRef<HTMLDivElement>(null);
      const nodeContainerRef = useRef<HTMLDivElement>(null);

      const [advanced] = useState(false);
      const [minWidth, setMinWidth] = useState(0);
      const [minHeight, setMinHeight] = useState(0);
      const [isResizing, setIsResizing] = useState(false);

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
         if (!nodeContainerRef.current) return;

         const { getActiveTheme } = useSettingsStore.getState();
         const appearance = getActiveTheme().colors.appearance;

         nodeContainerRef.current.style.backgroundColor = appearance.NODE_BG_COLOR;
         nodeContainerRef.current.style.color = appearance.NODE_TEXT_COLOR;
      }, [activeTheme]);

      useEffect(() => {
         if (!nodeRef.current) return;

         if (selected) {
            nodeRef.current.classList.add('selected');
         } else {
            nodeRef.current.classList.remove('selected');
         }
      }, [selected]);

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

      for (const name in inputs) {
         const input = inputs[name];
         const inputDef = nodeDef.inputs[name];

         if (inputDef?.widget && inputDef?.widget !== 'hidden') {
            inputWidgets.push(
               <Widget
                  nodeId={id}
                  theme={theme}
                  data={{ ...input, widget: input?.widget || inputDef.widget }}
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
      const outputHandles = Object.entries(outputs).map(([name, handle]) => (
         <OutputHandle nodeId={id} key={name} theme={theme} handle={handle} />
      ));

      const updateMinHeight = useCallback(async () => {
         if (containerRef.current) {
            await new Promise((resolve) => {
               setTimeout(() => {
                  resolve(null);
               }, 100);
            });
            if (!containerRef.current) {
               return;
            }
            const height = containerRef.current.offsetHeight + 50;
            const width = containerRef.current.offsetWidth;

            if (!nodeHeight || nodeHeight < height) {
               onNodesChange([
                  {
                     type: 'dimensions',
                     id,
                     dimensions: {
                        width: !!nodeWidth ? nodeWidth : width,
                        height
                     }
                  }
               ]);
            }
            setMinHeight(height);
         }
      }, [setMinHeight, id]);

      useEffect(() => {
         updateMinHeight();

         if (containerRef.current) {
            const resizeObserver = new ResizeObserver((entries) => {
               entries.forEach((entry) => {
                  if (entry.target === containerRef.current && !isResizing) {
                     updateMinHeight();
                  }
               });
            });

            resizeObserver.observe(containerRef.current);

            // Cleanup
            return () => {
               if (resizeObserver && containerRef.current) {
                  resizeObserver.unobserve(containerRef.current);
               }
            };
         }
      }, [containerRef]);

      const images = data.inputs?.file?.value as string[];

      useEffect(() => {
         const isImage = isDisplayImage(data);

         if (isImage && images && Array.isArray(images) && images.length > 1) {
            console.log('Changing dimensions>>>')
            if ((nodeHeight || 0) > 420) {
               return;
            }
            onNodesChange([
               {
                  type: 'dimensions',
                  id,
                  dimensions: {
                     width: 420,
                     height: nodeHeight!
                  }
               }
            ]);
         }
      }, [images]);

      return (
         <>
            <NodeResizeControl
               style={resizerStyle}
               color="transparent"
               position="bottom-right"
               minWidth={minWidth}
               minHeight={minHeight}
               onResizeStart={() => {
                  setIsResizing(true);
               }}
               onResizeEnd={() => {
                  setIsResizing(false);
               }}
            />
            <Card
               style={{ fontSize: NODE_TEXT_SIZE, color: NODE_TEXT_COLOR }}
               className="flex-col"
               ref={nodeContainerRef}
               onDoubleClickCapture={(e) => e.stopPropagation()}
            >
               <CardHeader className="flex gap-3">
                  <p
                     className="!text-[11px]"
                     style={{
                        // ...getTransformStyle(zoomSelector),
                        color: NODE_TITLE_COLOR
                     }}
                  >
                     {typeof nodeDef.display_name === 'string'
                        ? nodeDef.display_name
                        : nodeDef.display_name.en}
                  </p>
               </CardHeader>

               <Divider />

               <CardBody>
                  {advanced ? (
                     <>
                        <div>Advanced options</div>
                     </>
                  ) : (
                     <>
                        <div className="flow_content" ref={containerRef}>
                           <div className="flow_input_output_container">
                              <div className="flow_input_container">{inputHandles}</div>
                              <div className="flow_output_container">{outputHandles}</div>
                           </div>

                           <div className="widgets_container">{inputWidgets}</div>
                           <div className="widgets_container">{displayWidgets}</div>
                        </div>
                     </>
                  )}
               </CardBody>
            </Card>
         </>
      );
   };
};

const isDisplayImage = (data: NodeData) => {
   return Object.values(data.inputs).some((input) => input['display_name'] === 'file');
};

interface InputHandleProps {
   nodeId: string;
   theme: ThemeConfig;
   handle: HandleState;
}

function InputHandle({ nodeId, handle, theme }: InputHandleProps) {
   const transform = useStore((s: ReactFlowState) => s.transform[2]);
   const transformScale = Math.max(1, 1 / transform);
   const showInput = transformScale < TRANSFORM_POINT;

   const appearance = theme.colors.types;
   const { NODE_TEXT_COLOR } = theme.colors.appearance;

   const handleStyle = handle.isConnected
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
         <span
            className="flow_input_text"
            style={{ color: NODE_TEXT_COLOR, opacity: handle.isConnected ? 0.7 : 1 }}
         >
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
}

function OutputHandle({ nodeId, handle, theme }: OutputHandleProps) {
   const transform = useStore((s: ReactFlowState) => s.transform[2]);
   const transformScale = Math.max(1, 1 / transform);
   const showOutput = transformScale < TRANSFORM_POINT;

   const appearance = theme.colors.types;
   const { NODE_TEXT_COLOR } = theme.colors.appearance;

   const handleStyle = handle.isConnected
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
         <span
            className="flow_output_text"
            style={{ color: NODE_TEXT_COLOR, opacity: handle.isConnected ? 0.7 : 1 }}
         >
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

   const isMultiline = (inputDef.widget as WidgetDefinition)?.type === 'TEXT';
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

   const handleStyle = data.isConnected
      ? { background: appearance[data.edge_type], border: '1px solid transparent' }
      : { border: `1.5px solid ${appearance[data.edge_type]}`, background: 'transparent' };

   return (
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
         <Handle
            type="target"
            position={Position.Left}
            style={{ ...handleStyle }}
            className={`flow_handler left`}
            id={makeHandleId(nodeId, data.display_name)}
         />

         {(data.widget as WidgetDefinition)?.type === 'TEXT' && (
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
