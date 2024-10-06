import { ChangeEvent, useRef, useState, useEffect, createRef, useMemo, useCallback } from 'react';
import { Modal, Tooltip } from 'antd';
import { EraserIcon } from '@radix-ui/react-icons';
import { useFlowStore } from '../../store/flow';
import { Button } from '@/components/ui/button';
import { Stage, Layer, Image as KonvaImage, Shape } from 'react-konva';
import Konva from 'konva';
import { LuRedo2, LuUndo2 } from 'react-icons/lu';
import { BsBrush } from 'react-icons/bs';
import { getHandleName, makeHandleId } from '../../utils/node';
import { Label, RefValue } from '../../types/types';
import { throttle } from 'lodash';
import CursorBrush from '../icons/CursorBrush.svg';
import CursorEraser from '../icons/CursorEraser.svg';

export type MaskProps = {
   refValue?: RefValue;
   value: any;
   nodeId: string;
   onChange?: (value: any) => void;
};

const brushColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];

// preview image height and width
export const PreviewImageHeight = 255;
export const PreviewImageWidth = 166;

export function MaskWidget({ nodeId, onChange, value, refValue }: MaskProps) {
   const [imageWidth, setImageWidth] = useState<number>(PreviewImageWidth);
   const [imageHeight, setImageHeight] = useState<number>(PreviewImageHeight);
   const [KonvaImageHeight, setKonvaImageHeight] = useState<number>(350);
   const { updateInputData, nodes, edges, setEdges, updateNodeData } = useFlowStore(
      (state) => state
   );
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [imageUrl, setImageUrl] = useState<string>('');
   const [image, setImage] = useState<HTMLImageElement | null>(null);
   const [isDrawing, setIsDrawing] = useState<boolean>(false);
   const [brushColor, setBrushColor] = useState<string>(
      brushColors[Math.floor(Math.random() * brushColors.length)]
   );

   const maskCanvasRef = useRef<HTMLCanvasElement>(null);
   const imgRef = useRef<HTMLImageElement>(null);

   const [shapes, setShapes] = useState<Label['shapes']>([]);

   const [undoStack, setUndoStack] = useState<Array<typeof shapes>>([]);
   const [redoStack, setRedoStack] = useState<Array<typeof shapes>>([]);
   const [labels, setLabels] = useState<Label[]>([]);
   const [newLabel, setNewLabel] = useState<string>('');
   const [activeLabel, setActiveLabel] = useState<string | null>(null);
   const [availableColors, setAvailableColors] = useState<string[]>([...brushColors]);
   const stageRef = createRef<Konva.Stage>();
   const [labelError, setLabelError] = useState<string | null>(null);
   const [showAllShapes, setShowAllShapes] = useState(false);
   const [isEraserActive, setIsEraserActive] = useState<boolean>(false);
   const eraserSize = 20; // Define a specific size for the eraser
   const brushSize: number = 2.5;

   const refNode = useMemo(() => {
      if (refValue?.nodeId === undefined) return;
      return nodes.find((node) => node.id === refValue?.nodeId);
   }, [refValue, nodes]);

   useEffect(() => {
      if (!refValue?.nodeId) {
         setLabels([]);
         setShapes([]);
         setImageUrl('');
         const outputs = nodes.find((node) => node.id === nodeId)?.data.outputs;
         for (const output in outputs) {
            if (outputs[output].isConnected) {
               const edgeConnected = edges.find(
                  (e) => e.sourceHandle === makeHandleId(nodeId, output)
               );
               if (edgeConnected) {
                  updateInputData({
                     nodeId: edgeConnected.target,
                     display_name: getHandleName(edgeConnected.targetHandle!),
                     data: {
                        isConnected: false,
                        ref: undefined,
                        value: ''
                     }
                  });
               }
            }
         }
         updateNodeData(nodeId, { outputs: {} });
      }
   }, [refValue]);

   const loadImage = useCallback(
      (url: string) => {
         const img = new Image();
         img.src = url;
         img.crossOrigin = 'anonymous';

         const aspectRatio = img.height / img.width;
         setImageWidth(163);
         setImageHeight(163 * aspectRatio);
         // setting the konva image height to the image height
         setKonvaImageHeight(350 * aspectRatio);

         img.onload = () => {
            setImage(img);
         };
      },
      [setImage, setImageWidth, setImageHeight]
   );

   useMemo(() => {
      const image = refNode?.data?.outputs[refValue?.handleName!]?.value as any;
      console.log('image>>>>', image)
      const theImage = Array.isArray(image) ? image?.[0] : image;
      if (theImage) {
         loadImage(theImage);
         setImageUrl(theImage);
      } else {
         setLabels([]);
         setShapes([]);
         setImageUrl('');
      }
   }, [refNode, refValue]);

   useEffect(() => {
      if (!imageUrl) {
         // making it run last
         setTimeout(() => {
            setImage(null);
         }, 0);
      }
   }, [imageUrl]);

   useEffect(() => {
      if (value && Array.isArray(value?.labels)) {
         const allShapes = value?.labels.flatMap((label: any) =>
            label.shapes.map((shape: any) => ({
               ...shape,
               color: label.color
            }))
         );
         setShapes(allShapes);
         setActiveLabel(value?.labels?.[value.length - 1] || null);
         setLabels(value?.labels);
         setShowAllShapes(true);
      }
      if (value?.imageUrl) {
         const theImage = Array.isArray(value?.imageUrl) ? value.imageUrl?.[0] : value.imageUrl;
         loadImage(theImage);
         setImageUrl(theImage);
      }
   }, []);

   const updateOutputData = () => {
      let outputs: any = {};
      const node = nodes.find((node) => node.id === nodeId);
      if (node) {
         outputs = node.data.outputs;
      }
      const outputArray = Object.entries(outputs);
      if (labels.length > 0 && labels.length > outputArray.length) {
         const newData = [...labels].reverse().slice(0, labels.length - outputArray.length);
         for (const label of newData) {
            // no need to update the node, since it's an object clone, it updates the output object
            outputs[label.name] = {
               display_name: label.name,
               edge_type: 'MASK',
               isHighlighted: false,
               value: label?.base64 || ''
            };
         }
      } else if (labels.length < outputArray.length) {
         const newData = outputArray.slice(labels.length);
         for (const [key, _] of newData) {
            delete outputs[key];
         }
      }

      outputArray.forEach(([key, _], index) => {
         const edge = edges.find((e) => e.sourceHandle === makeHandleId(nodeId, key));
         if (labels[index]) {
            outputs[key] = {
               ...outputs[key],
               value: labels[index]?.base64 || '',
               isConnected: edge ? true : false
            };
         }
      });
   };

   useEffect(() => {
      onChange?.({
         imageUrl: Array.isArray(value?.imageUrl) ? value?.imageUrl?.[0] : value?.imageUrl,
         labels
      });
      updateOutputData();
   }, [labels]);

   const toggleModal = () => {
      setIsModalOpen((prev) => {
         if (!prev && activeLabel && !showAllShapes) {
            setShapes(labels.find((l) => l.name === activeLabel)?.shapes || []);
         } else if (!prev && showAllShapes) {
            const allShapes = labels.flatMap((label) =>
               label.shapes.map((shape) => ({
                  ...shape,
                  color: label.color
               }))
            );
            setShapes(allShapes);
         } else if (prev) {
            const allShapes = labels.flatMap((label) =>
               label.shapes.map((shape) => ({
                  ...shape,
                  color: label.color
               }))
            );
            setShapes(allShapes);
         }
         return !prev;
      });
   };

   const handleGetMaskClick = (shapesToDraw: typeof shapes) => {
      if (!maskCanvasRef.current || !image || !imgRef.current) return;
      const ctx = maskCanvasRef.current.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);

      ctx.globalCompositeOperation = 'source-over';

      shapesToDraw.forEach((shape) => {
         ctx.lineWidth = shape.size;
         ctx.strokeStyle = shape.color;
         ctx.fillStyle = `${shape.color}60`;
         ctx.beginPath();
         shape.points.forEach(([x, y], index) => {
            if (index === 0) {
               ctx.moveTo(x, y);
            } else {
               ctx.lineTo(x, y);
            }
         });
         ctx.closePath();
         ctx.fill();
         ctx.stroke();
      });

      ctx.globalCompositeOperation = 'source-in';

      ctx.drawImage(image, 0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);

      ctx.globalCompositeOperation = 'source-over';

      imgRef.current.src = maskCanvasRef.current.toDataURL();
   };

   const handleUndo = () => {
      if (undoStack.length === 0) return;
      const previousShapes = undoStack[undoStack.length - 1];
      setRedoStack((prev) => [shapes, ...prev]);
      setShapes(previousShapes);
      setUndoStack((prev) => prev.slice(0, -1));
      handleGetMaskClick(previousShapes);
   };

   const handleRedo = () => {
      if (redoStack.length === 0) return;
      const nextShapes = redoStack[0];
      setUndoStack((prev) => [...prev, shapes]);
      setShapes(nextShapes);
      setRedoStack((prev) => prev.slice(1));
      handleGetMaskClick(nextShapes);
   };

   const generateBase64 = () => {
      if (!image || !stageRef.current) return;

      const stageWidth = Math.floor((image.width / image.height) * KonvaImageHeight);
      const stageHeight = KonvaImageHeight;

      // Create a temporary canvas
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = stageWidth;
      tempCanvas.height = stageHeight;
      const tempContext = tempCanvas.getContext('2d');

      if (!tempContext) return;

      // Calculate scaling factors
      const scaleX = stageWidth / 350;
      const scaleY = stageHeight / KonvaImageHeight;

      // Update each label with its base64
      setLabels((prevLabels) =>
         prevLabels.map((label) => {
            // Clear the temporary canvas
            tempContext.clearRect(0, 0, stageWidth, stageHeight);

            // Draw all shapes for this label
            label.shapes.forEach((shape) => {
               tempContext.beginPath();
               shape.points.forEach(([x, y], pointIndex) => {
                  const scaledX = x * scaleX;
                  const scaledY = y * scaleY;
                  if (pointIndex === 0) {
                     tempContext.moveTo(scaledX, scaledY);
                  } else {
                     tempContext.lineTo(scaledX, scaledY);
                  }
               });
               tempContext.closePath();
               tempContext.fillStyle = 'white';
               tempContext.fill();
            });

            // Resize the temporary canvas to 1200px width while maintaining aspect ratio
            const resizeCanvas = document.createElement('canvas');
            resizeCanvas.width = image.width;
            resizeCanvas.height = image.height;
            const resizeContext = resizeCanvas.getContext('2d');

            if (resizeContext) {
               resizeContext.imageSmoothingEnabled = true;
               resizeContext.imageSmoothingQuality = 'high';

               // Draw the original canvas onto the resized canvas
               resizeContext.drawImage(
                  tempCanvas,
                  0,
                  0,
                  tempCanvas.width,
                  tempCanvas.height,
                  0,
                  0,
                  resizeCanvas.width,
                  resizeCanvas.height
               );
            }
            const base64 = resizeCanvas.toDataURL('image/png');
            label.base64 = base64;

            return label;
         })
      );
   };

   const handleMouseDown = (evt: any) => {
      const stage = evt.target.getStage();
      if (!stage) return;
      const point = stage.getPointerPosition();
      if (!point) return;

      setIsDrawing(true);
      setUndoStack((prev) => [...prev, shapes]);
      setRedoStack([]);

      if (!isEraserActive && activeLabel) {
         setShapes((prevShapes) => [
            ...prevShapes,
            {
               points: [[point.x, point.y]],
               size: brushSize,
               color: labels.filter((label) => label.name == activeLabel)[0].color,
               isEraser: false
            }
         ]);
      }
   };

   const handleMouseMove = useCallback(
      throttle((evt: any) => {
         if (!isDrawing) return;
         const stage = evt.target.getStage();
         const point = stage.getPointerPosition();
         if (!point) return;

         if (isEraserActive) {
            setShapes((prevShapes) =>
               prevShapes.map((shape) => ({
                  ...shape,
                  points: shape.points.filter(([x, y]) => {
                     const distance = Math.hypot(x - point.x, y - point.y);
                     return distance > eraserSize;
                  })
               }))
            );
         } else if (activeLabel) {
            setShapes((prevShapes) => {
               const newShapes = [...prevShapes];
               const lastShape = newShapes[newShapes.length - 1];
               lastShape.points = [...lastShape.points, [point.x, point.y]];
               return newShapes;
            });
         }
      }, 65), // Throttle the function to run at most once every 50ms
      [isDrawing, isEraserActive, activeLabel, eraserSize] // dependencies
   );

   const handleMouseUp = () => {
      setIsDrawing(false);
      handleGetMaskClick(shapes);

      if (activeLabel) {
         const updatedLabels = labels.map((label) =>
            label.name === activeLabel ? { ...label, shapes } : label
         );
         setLabels(updatedLabels);
         setActiveLabel(activeLabel);
      }

      generateBase64(); // Update this line
   };

   const handleLabelChange = (e: ChangeEvent<HTMLInputElement>) => {
      setNewLabel(e.target.value);
      setLabelError(null);
   };

   const handleAddLabel = () => {
      const trimmedLabel = newLabel.trim();
      if (trimmedLabel !== '' && labels.length < 5 && availableColors.length > 0) {
         // Check if the label name already exists
         if (labels.some((label) => label.name.toLowerCase() === trimmedLabel.toLowerCase())) {
            setLabelError('A label with this name already exists. Please choose a unique name.');
            return;
         }

         const newColor = availableColors[0];
         const newLabelObject: Label = {
            name: trimmedLabel,
            color: newColor,
            shapes: [],
            base64: undefined // It will be generated when shapes are added
         };
         setLabels([...labels, newLabelObject]);
         setNewLabel('');
         setActiveLabel(trimmedLabel);
         setShapes([]);
         setAvailableColors(availableColors.slice(1));
         setBrushColor(newColor);
         setLabelError(null);
      }
   };

   const handleRemoveLabel = (index: number) => {
      const removedLabel = labels[index];

      // once label is removed we have to update the node that was connected to it if any
      const edgeConnectedToLabel = edges.find(
         (e) => e.sourceHandle === makeHandleId(nodeId, removedLabel.name)
      );
      if (edgeConnectedToLabel) {
         const targetNode = nodes.find((node) => node.id === edgeConnectedToLabel.target);
         updateInputData({
            nodeId: edgeConnectedToLabel.target,
            display_name:
               targetNode?.data.inputs[getHandleName(edgeConnectedToLabel.targetHandle!)]
                  ?.display_name!,
            data: { isConnected: false, value: '' }
         });
         setEdges((edges) => edges.filter((e) => e.id !== edgeConnectedToLabel.id));
      }

      const updatedLabels = labels.filter((_, i) => i !== index);
      setLabels(updatedLabels);
      setAvailableColors([...availableColors, removedLabel.color]);

      if (activeLabel === removedLabel.name) {
         setActiveLabel(null);
         setShapes([]);
      } else if (showAllShapes) {
         // Update shapes to exclude the removed label's shapes
         const remainingShapes = shapes.filter((shape) =>
            updatedLabels.some((label) => label.color === shape.color)
         );
         setShapes(remainingShapes);
      }

      // Always update showAllShapes when a label is removed
      setShowAllShapes(updatedLabels.length > 0);
   };

   const handleLabelClick = (label: Label) => {
      setActiveLabel(label.name);
      setShapes(label.shapes);
      setBrushColor(label.color);
      setShowAllShapes(false);
   };

   const handleShowAllShapes = () => {
      setShowAllShapes(!showAllShapes);
      if (!showAllShapes) {
         const allShapes = labels.flatMap((label) =>
            label.shapes.map((shape) => ({
               ...shape,
               color: label.color
            }))
         );
         setShapes(allShapes);
      } else {
         setShapes(
            activeLabel ? labels.find((label) => label.name === activeLabel)?.shapes || [] : []
         );
      }
   };

   const toggleEraser = () => {
      setIsEraserActive(!isEraserActive);
   };

   useEffect(() => {
      if (activeLabel) {
         const updatedLabels = labels.map((label) =>
            label.name === activeLabel
               ? { ...label, shapes: shapes.filter((shape) => shape.color === label.color) }
               : label
         );
         setLabels(updatedLabels);
      }
   }, [shapes]);

   const hasMasks = labels.some((label) => label.shapes.length > 0);

   const DisplayShapes = useMemo(
      () =>
         image && (
            <div className="mt-3" onClick={() => toggleModal()}>
               <Stage ref={stageRef} width={imageWidth} height={imageHeight}>
                  <Layer>
                     <KonvaImage image={image} width={imageWidth} height={imageHeight} />
                     {shapes.map((shape, i) => (
                        <Shape
                           key={i}
                           sceneFunc={(context, shapeNode) => {
                              context.beginPath();
                              const scaleX = imageWidth / 350;
                              const scaleY = imageHeight / KonvaImageHeight;
                              shape.points.forEach(([x, y], index) => {
                                 const scaledX = x * scaleX;
                                 const scaledY = y * scaleY;
                                 if (index === 0) {
                                    context.moveTo(scaledX, scaledY);
                                 } else {
                                    context.lineTo(scaledX, scaledY);
                                 }
                              });
                              context.closePath();
                              context.fillStrokeShape(shapeNode);
                           }}
                           fill={`${shape.color}60`}
                           stroke={shape.color}
                           strokeWidth={shape.size}
                        />
                     ))}
                  </Layer>
               </Stage>
            </div>
         ),
      [shapes, image, imageWidth, imageHeight]
   );

   return (
      <>
         <p className="text-[9px] mt-[7px] text-inputText">image</p>
         {DisplayShapes}

         <Modal
            open={isModalOpen}
            onCancel={toggleModal}
            footer={null}
            className="menu_modal"
            width={'800px'}
            centered
            height="90vh"
            style={{
               justifyContent: 'center',
               alignItems: 'center'
            }}
         >
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-1">
                  <Button
                     disabled={undoStack.length === 0}
                     className="bg-borderColor hover:bg-borderColor text-xs p-2 h-[25px]"
                     onClick={handleUndo}
                  >
                     <LuUndo2 color="white" />
                  </Button>
                  <Button
                     className="bg-borderColor hover:bg-borderColor text-xs p-2 h-[25px]"
                     disabled={redoStack.length === 0}
                     onClick={handleRedo}
                  >
                     <LuRedo2 color="white" />
                  </Button>
                  <Button
                     className={`bg-borderColor hover:bg-borderColor text-xs p-2 h-[25px]`}
                     onClick={toggleEraser}
                  >
                     {isEraserActive ? (
                        <Tooltip title="Brush">
                           <BsBrush />
                        </Tooltip>
                     ) : (
                        <Tooltip title="Eraser">
                           <EraserIcon />
                        </Tooltip>
                     )}
                  </Button>
               </div>
            </div>

            {image && (
               <div className="flex gap-5 items-center justify-center h-full overflow-auto">
                  <div className="flex gap-5 relative">
                     {image && (
                        <div className="relative w-[350px]">
                           <div className="">
                              <div className="flex flex-col gap-1 p-3">
                                 <h3 className="text-base font-semibold mb-1 text-fg">
                                    Select Mask
                                 </h3>
                                 <p className="text-xs text-gray-300 mb-2">Add up to 5 masks</p>
                                 <input
                                    type="text"
                                    value={newLabel}
                                    onChange={handleLabelChange}
                                    placeholder="Enter label"
                                    className="px-3 py-2 w-full bg-borderColor text-fg text-xs border border-borderColor rounded-md focus:outline-none mb-2"
                                 />
                                 <Button
                                    onClick={handleAddLabel}
                                    className="bg-bg hover:bg-bg text-xs px-3 py-2 h-[36px] w-full text-fg transition-transform duration-200 ease-in-out hover:scale-95 active:scale-105"
                                    disabled={labels.length >= 5}
                                 >
                                    Add Label
                                 </Button>
                                 {labelError && (
                                    <p className="text-[10px] text-red-500 mt-1">{labelError}</p>
                                 )}
                                 {labels.length >= 5 && (
                                    <p className="text-[10px] text-yellow-500 mt-1">
                                       Maximum number of labels reached. Remove a label to add a new
                                       one.
                                    </p>
                                 )}
                              </div>

                              <div className="mt-2 flex flex-col gap-2 px-3 pb-3">
                                 {labels.map((label, index) => (
                                    <div
                                       key={index}
                                       className={`flex items-center justify-between bg-borderColor text-fg px-3 py-2 rounded-md text-xs w-full animate-fadeIn transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
                                          activeLabel === label.name && !showAllShapes
                                             ? 'border-2 border-blue-500'
                                             : ''
                                       }`}
                                       onClick={() => handleLabelClick(label)}
                                    >
                                       <div className="flex items-center">
                                          <span
                                             className="w-4 h-4 rounded-full mr-3 animate-pulse"
                                             style={{ backgroundColor: label.color }}
                                          ></span>
                                          <span className="animate-fadeIn">{label.name}</span>
                                       </div>
                                       <button
                                          onClick={(e) => {
                                             e.stopPropagation();
                                             handleRemoveLabel(index);
                                          }}
                                          className="ml-2 text-red-500 hover:text-red-700 text-sm transition-all duration-200 ease-in-out hover:scale-110 active:scale-95"
                                       >
                                          ×
                                       </button>
                                    </div>
                                 ))}

                                 <Button
                                    disabled={!hasMasks}
                                    onClick={handleShowAllShapes}
                                    className="bg-bg hover:bg-bg text-xs px-3 py-2 h-[36px] w-auto max-w-[200px] text-fg transition-transform duration-200 ease-in-out hover:scale-95 active:scale-105 mt-2"
                                 >
                                    {showAllShapes ? 'Hide All Shapes' : 'Show All Shapes'}
                                 </Button>
                              </div>
                           </div>
                        </div>
                     )}

                     {image && (
                        <Stage
                           ref={stageRef}
                           width={350}
                           height={KonvaImageHeight}
                           onMouseDown={handleMouseDown}
                           onMouseMove={handleMouseMove}
                           onMouseUp={handleMouseUp}
                           className={`my-auto ${
                              activeLabel || isEraserActive
                                 ? 'hover:cursor-context-menu'
                                 : 'hover:cursor-not-allowed'
                           } max-w-full`}
                           style={{
                              cursor: isEraserActive
                                 ? `url(${CursorEraser}) 0 100, auto`
                                 : `url(${CursorBrush}) 0 100, auto`
                           }}
                        >
                           <Layer>
                              <KonvaImage image={image} width={350} height={KonvaImageHeight} />
                              {shapes.map((shape, i) => (
                                 <Shape
                                    key={i}
                                    sceneFunc={(context, shapeNode) => {
                                       context.beginPath();
                                       shape.points.forEach(([x, y], index) => {
                                          if (index === 0) {
                                             context.moveTo(x, y);
                                          } else {
                                             context.lineTo(x, y);
                                          }
                                       });
                                       context.closePath();
                                       context.fillStrokeShape(shapeNode);
                                    }}
                                    fill={`${shape.color}60`}
                                    stroke={shape.color}
                                    strokeWidth={shape.size}
                                 />
                              ))}
                           </Layer>
                        </Stage>
                     )}
                  </div>
               </div>
            )}
         </Modal>
      </>
   );
}