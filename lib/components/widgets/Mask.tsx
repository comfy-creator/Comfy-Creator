import { ChangeEvent, useRef, useState, useEffect, createRef } from 'react';
import { Modal } from 'antd';
import {
   ChevronLeftIcon,
   ChevronRightIcon,
   Cross1Icon,
   EraserIcon,
   Pencil2Icon
} from '@radix-ui/react-icons';
import { useApiContext } from '../../contexts/api';
import { API_URL } from '../../config/constants';
import { useFlowStore } from '../../store/flow';
import { ProgressBar } from '../ProgressBar';
import { Button } from '@/components/ui/button';
import { Spinner } from '@nextui-org/react';
import { Stage, Layer, Image as KonvaImage, Shape } from 'react-konva';
import Konva from 'konva';
import { Slider } from '@/components/ui/slider';
import { LuRedo2, LuUndo2 } from 'react-icons/lu';
import { BsBrush, BsCheck } from 'react-icons/bs';

export type MaskProps = {
   onChange?: (value: string) => void;
   imageUrl?: string;
};

const brushColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
const imageToBASE64 = (file: File) =>
   new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
   });

type Label = {
   name: string;
   color: string;
   shapes: Array<{
      points: number[][];
      size: number;
      color: string;
      isEraser?: boolean;
   }>;
};

export function MaskWidget({
   onChange,
   imageUrl = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D'
}: MaskProps) {
   const { setAppLoading } = useFlowStore((state) => state);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedImage, setSelectedImage] = useState<string | null>(null);
   const [image, setImage] = useState<HTMLImageElement | null>(null);
   const [isDrawing, setIsDrawing] = useState<boolean>(false);
   const [brushSize, setBrushSize] = useState<number>(2.5);
   const [brushColor, setBrushColor] = useState<string>(
      brushColors[Math.floor(Math.random() * brushColors.length)]
   );
   const [konvaImage, setKonvaImage] = useState<Konva.Image | null>(null);

   const maskCanvasRef = useRef<HTMLCanvasElement>(null);
   const imgRef = useRef<HTMLImageElement>(null);

   const [shapes, setShapes] = useState<Label['shapes']>([]);

   const [undoStack, setUndoStack] = useState<Array<typeof shapes>>([]);
   const [redoStack, setRedoStack] = useState<Array<typeof shapes>>([]);
   const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);
   const [initialImage, setInitialImage] = useState<string | null>(null);
   const [labels, setLabels] = useState<Label[]>([]);
   const [newLabel, setNewLabel] = useState<string>('');
   const [activeLabel, setActiveLabel] = useState<Label | null>(null);
   const [availableColors, setAvailableColors] = useState<string[]>([...brushColors]);
   const stageRef = createRef<Konva.Stage>();
   const [labelError, setLabelError] = useState<string | null>(null);
   const [showAllShapes, setShowAllShapes] = useState(false);
   const [isEraserActive, setIsEraserActive] = useState<boolean>(false);
   const [maskedImage, setMaskedImage] = useState(null);
   const eraserSize = 20; // Define a specific size for the eraser

   useEffect(() => {
      if (imageUrl) {
         setSelectedImage(imageUrl);
         setInitialImage(imageUrl);
      }
   }, [imageUrl]);

   const toggleModal = () => setIsModalOpen(!isModalOpen);

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

   useEffect(() => {
      if (initialImage) {
         const img = new Image();
         img.src = initialImage;
         img.crossOrigin = 'anonymous';
         img.onload = () => {
            setImage(img);
            const konvaImg = new Konva.Image({
               image: img,
               width: img.width,
               height: img.height
            });
            setKonvaImage(konvaImg);
         };
      }
   }, [initialImage]);

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
               color: activeLabel.color,
               isEraser: false
            }
         ]);
      }
   };

   const handleMouseMove = (evt: any) => {
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
   };

   const handleMouseUp = () => {
      setIsDrawing(false);
      handleGetMaskClick(shapes);

      if (activeLabel) {
         const updatedLabels = labels.map((label) =>
            label === activeLabel ? { ...label, shapes } : label
         );
         setLabels(updatedLabels);
         setActiveLabel({ ...activeLabel, shapes });
      }
   };

   const handleCheckmarkClick = async () => {
      if (!imgRef.current) return;

      setIsSubmittingUpdate(true);
      const base64Image = await imageToBASE64(
         new File([await (await fetch(imgRef.current.src)).blob()], 'updated_image.png', {
            type: 'image/png'
         })
      );

      await new Promise((resolve) => setTimeout(resolve, 3000));

      setSelectedImage(base64Image);
      setIsSubmittingUpdate(false);
      setIsModalOpen(false);
      onChange?.(base64Image);
   };

   const handleReopenModal = () => {
      setSelectedImage(initialImage);
      setIsModalOpen(true);
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
            shapes: []
         };
         setLabels([...labels, newLabelObject]);
         setNewLabel('');
         setActiveLabel(newLabelObject);
         setShapes([]);
         setAvailableColors(availableColors.slice(1));
         setBrushColor(newColor);
         setLabelError(null);
      }
   };

   const handleRemoveLabel = (index: number) => {
      const removedLabel = labels[index];
      const updatedLabels = labels.filter((_, i) => i !== index);
      setLabels(updatedLabels);
      setAvailableColors([...availableColors, removedLabel.color]);

      if (activeLabel === removedLabel) {
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
      setActiveLabel(label);
      setShapes(label.shapes);
      setBrushColor(label.color);
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
         setShapes(activeLabel ? activeLabel.shapes : []);
      }
   };

   const toggleEraser = () => {
      setIsEraserActive(!isEraserActive);
      // if (isEraserActive) {
      //    setBrushColor(brushColors[Math.floor(Math.random() * brushColors.length)]); // Restore a random brush color when switching back
      // }
   };

   useEffect(() => {
      if (isModalOpen) {
         setShapes(activeLabel ? activeLabel.shapes : []);
      } else {
         const allShapes = labels.flatMap((label) =>
            label.shapes.map((shape) => ({
               ...shape,
               color: label.color
            }))
         );
         setShapes(allShapes);
      }
   }, [isModalOpen]);

   const hasMasks = labels.some((label) => label.shapes.length > 0);

   // preview image height and width
   const previewImageHeight = 270;
   const previewImageWidth = 190;
   // konva image height
   const konvaImageHeight = 500;

   return (
      <>
         <p className="text-[9px] mt-[7px]">image</p>
         {/* <img
            src={selectedImage || ''}
            alt="preview"
            style={{ width: '100%' }}
            className="mt-2"
            onClick={handleReopenModal}
         /> */}
         {image && (
            <div className="mt-3" onClick={() => handleReopenModal()}>
               <Stage ref={stageRef} width={previewImageWidth} height={previewImageHeight}>
                  <Layer>
                     <KonvaImage
                        image={image}
                        width={previewImageWidth}
                        height={previewImageHeight}
                     />
                     {shapes.map((shape, i) => (
                        <Shape
                           key={i}
                           sceneFunc={(context, shapeNode) => {
                              context.beginPath();
                              const scaleX =
                                 previewImageWidth /
                                 ((image.width / image.height) * konvaImageHeight);
                              const scaleY = previewImageHeight / konvaImageHeight;
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
         )}

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
                     className={`bg-borderColor hover:bg-borderColor text-xs p-2 h-[25px] `}
                     onClick={toggleEraser}
                  >
                     {isEraserActive ? <BsBrush /> : <EraserIcon />}
                  </Button>
               </div>
            </div>

            {selectedImage && (
               <div className="flex gap-5 items-center justify-center h-full overflow-auto">
                  <div className="flex gap-5 relative">
                     {image && (
                        <div
                           className="relative"
                           style={{ width: (image.width / image.height) * konvaImageHeight }}
                        >
                           {/* {shapes.length > 0 && (
                              <button
                                 disabled={isSubmittingUpdate}
                                 className="text-xs flex items-center 
                                 justify-center w-[30px] h-[30px] 
                                 absolute top-3 left-3 bg-borderColor 
                                 hover:bg-borderColor text-white 
                                 rounded disabled:opacity-50"
                                 onClick={handleCheckmarkClick}
                              >
                                 {isSubmittingUpdate ? (
                                    <Spinner size="sm" color="white" />
                                 ) : (
                                    <BsCheck size={20} color="white" />
                                 )}
                              </button>
                           )} */}

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
                                          activeLabel === label ? 'border-2 border-blue-500' : ''
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
                           width={(image.width / image.height) * konvaImageHeight}
                           height={konvaImageHeight}
                           onMouseDown={handleMouseDown}
                           onMouseMove={handleMouseMove}
                           onMouseUp={handleMouseUp}
                           className={`border border-borderColor ${
                              activeLabel || isEraserActive
                                 ? 'hover:cursor-context-menu'
                                 : 'hover:cursor-not-allowed'
                           } max-w-full`}
                        >
                           <Layer>
                              <KonvaImage
                                 image={image}
                                 width={(image.width / image.height) * konvaImageHeight}
                                 height={konvaImageHeight}
                              />
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
