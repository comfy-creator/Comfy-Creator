import { ChangeEvent, useRef, useState, useEffect, useCallback } from 'react';
import { Modal } from 'antd';
import { ChevronLeftIcon, ChevronRightIcon, Cross1Icon, Pencil2Icon } from '@radix-ui/react-icons';
import { useApiContext } from '../../contexts/api';
import { API_URL } from '../../config/constants';
import { useFlowStore } from '../../store/flow';
import { ProgressBar } from '../ProgressBar';
import { Button } from '@/components/ui/button';
import { Spinner } from '@nextui-org/react';
import { Stage, Layer, Line, Image as KonvaImage } from 'react-konva';
import Konva from 'konva';
import { Slider } from '@/components/ui/slider';
import { LuRedo2, LuUndo2 } from 'react-icons/lu';
import { BsCheck } from 'react-icons/bs';

export type MaskProps = {
   onChange?: (value: string) => void;
   imageUrl?: string;
};

const imageToBASE64 = (file: File) =>
   new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
   });

export function MaskWidget({
   onChange,
   imageUrl = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D'
}: MaskProps) {
   const { setAppLoading } = useFlowStore((state) => state);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedImage, setSelectedImage] = useState<string | null>(null);
   const [image, setImage] = useState<HTMLImageElement | null>(null);
   const [isDrawing, setIsDrawing] = useState<boolean>(false);
   const [currentLine, setCurrentLine] = useState<
      { points: number[][]; size: number; color: string }[]
   >([]);
   const [brushSize, setBrushSize] = useState<number>(2.5);
   const [brushColor, setBrushColor] = useState<string>('#ff0000');
   const [konvaImage, setKonvaImage] = useState<Konva.Image | null>(null);
   const maskCanvasRef = useRef<HTMLCanvasElement>(null);
   const imgRef = useRef<HTMLImageElement>(null);
   const [isEditing, setIsEditing] = useState(true);
   const [undoStack, setUndoStack] = useState<
      { points: number[][]; size: number; color: string }[][]
   >([]);
   const [redoStack, setRedoStack] = useState<
      { points: number[][]; size: number; color: string }[][]
   >([]);
   const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);
   const [initialImage, setInitialImage] = useState<string | null>(null);
   const [brushColors, setBrushColors] = useState<string[]>([
      '#ff0000',
      '#00ff00',
      '#0000ff',
      '#ffff00',
      '#ff00ff'
   ]);

   useEffect(() => {
      if (imageUrl) {
         setSelectedImage(imageUrl);
         setInitialImage(imageUrl);
      }
   }, [imageUrl]);

   const toggleModal = () => setIsModalOpen(!isModalOpen);

   const handleGetMaskClick = (lines: { points: number[][]; size: number; color: string }[]) => {
      if (!maskCanvasRef.current || !image || !imgRef.current) return;
      const ctx = maskCanvasRef.current.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);

      ctx.globalCompositeOperation = 'source-over';

      lines.forEach((line) => {
         ctx.lineWidth = line.size;
         ctx.strokeStyle = '#ff0000';
         ctx.beginPath();
         line.points.forEach(([x, y], index) => {
            if (index === 0) {
               ctx.moveTo(x, y);
            } else {
               ctx.lineTo(x, y);
            }
         });
         ctx.stroke();
      });

      ctx.globalCompositeOperation = 'source-in';

      ctx.drawImage(image, 0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);

      ctx.globalCompositeOperation = 'source-over';

      imgRef.current.src = maskCanvasRef.current.toDataURL();
   };

   useEffect(() => {
      if (selectedImage) {
         const img = new Image();
         img.src = selectedImage;
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
   }, [selectedImage]);

   const handleUndo = () => {
      if (currentLine.length === 0) return;
      setRedoStack((prev) => [currentLine, ...prev]);
      const newCurrentLine = undoStack[undoStack.length - 1] || [];
      setCurrentLine(newCurrentLine);
      setUndoStack((prev) => prev.slice(0, -1));
      handleGetMaskClick(newCurrentLine);
   };

   const handleRedo = () => {
      if (redoStack.length === 0) return;
      setUndoStack((prev) => [...prev, currentLine]);
      const newCurrentLine = redoStack[0];
      setCurrentLine(newCurrentLine);
      setRedoStack((prev) => prev.slice(1));
      handleGetMaskClick(newCurrentLine);
   };

   const handleMouseDown = (evt: any) => {
      const stage = evt.target.getStage();
      const point = stage.getPointerPosition();
      setIsDrawing(true);
      setUndoStack((prev) => [...prev, currentLine]);
      setRedoStack([]);
      setCurrentLine((prevLines) => [
         ...prevLines,
         { points: [[point.x, point.y]], size: brushSize, color: brushColor }
      ]);
   };

   const handleMouseMove = (evt: any) => {
      if (!isDrawing) return;
      const stage = evt.target.getStage();
      const point = stage.getPointerPosition();
      setCurrentLine((prevLines) => {
         const newLines = [...prevLines];
         newLines[newLines.length - 1].points = [
            ...newLines[newLines.length - 1].points,
            [point.x, point.y]
         ];
         handleGetMaskClick(newLines);
         return newLines;
      });
   };

   const handleMouseUp = () => {
      setIsDrawing(false);
      if (currentLine.length > 0) {
         const lastLine = currentLine[currentLine.length - 1];
         const points = lastLine.points;

         const minX = Math.min(...points.map((p) => p[0]));
         const maxX = Math.max(...points.map((p) => p[0]));
         const minY = Math.min(...points.map((p) => p[1]));
         const maxY = Math.max(...points.map((p) => p[1]));

         const filledPoints = [];
         const gridSpacing = 5;

         for (let x = minX; x <= maxX; x += gridSpacing) {
            for (let y = minY; y <= maxY; y += gridSpacing) {
               if (isPointInPolygon([x, y], points as [number, number][])) {
                  filledPoints.push([x, y]);
               }
            }
         }

         const filledLine = {
            ...lastLine,
            points: filledPoints,
            size: 7.9,
            color: `${lastLine.color}60`
         };

         const updatedLines = [...currentLine, filledLine];
         setCurrentLine(updatedLines);
         handleGetMaskClick(updatedLines);
      } else {
         handleGetMaskClick(currentLine);
      }
   };

   const isPointInPolygon = (point: [number, number], polygon: [number, number][]): boolean => {
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
         const xi = polygon[i][0],
            yi = polygon[i][1];
         const xj = polygon[j][0],
            yj = polygon[j][1];
         const intersect =
            yi > point[1] !== yj > point[1] &&
            point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;
         if (intersect) inside = !inside;
      }
      return inside;
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

   return (
      <>
         <p className="text-[9px] mt-[5px]">image</p>
         <img
            src={selectedImage || ''}
            alt="preview"
            style={{ width: '100%' }}
            className="mt-2"
            onClick={handleReopenModal}
         />
         <Modal
            open={isModalOpen}
            onCancel={toggleModal}
            footer={null}
            className="menu_modal "
            width={'fit-content'}
            centered
            height="90vh"
            style={{
               justifyContent: 'center',
               alignItems: 'center'
            }}
         >
            <div
               onClick={() => setIsEditing(!isEditing)}
               className={`bg-bg w-fit p-2.5 absolute ${isEditing ? 'top-7' : 'top-4'} left-4 rounded cursor-pointer`}
            >
               <Pencil2Icon className="text-fg" />
            </div>
            {isEditing && (
               <div className="flex items-center gap-2 p-3 px-5 rounded-lg bg-bg text-fg border border-borderColor justify-between mx-10 w-fit">
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-1">
                        <Button
                           disabled={currentLine.length < 1}
                           className="bg-borderColor hover:bg-borderColor text-xs p-2 h-[25px]"
                           onClick={handleUndo}
                        >
                           <LuUndo2 color="white" />
                        </Button>
                        <Button
                           className="bg-borderColor hover:bg-borderColor text-xs p-2 h-[25px]"
                           disabled={redoStack.length < 1}
                           onClick={handleRedo}
                        >
                           <LuRedo2 color="white" />
                        </Button>
                     </div>
                     {/* <div>
                        <div className="flex items-center justify-between mb-2 text-[9px]">
                           <p className="opacity-50">Brush Size</p>
                           <p>{brushSize}</p>
                        </div>
                        <Slider
                           step={1}
                           max={50}
                           min={0}
                           aria-label={'Brush Size'}
                           defaultValue={[5]}
                           className="w-[150px]"
                           onValueChange={(number) => setBrushSize(number[0])}
                        />
                     </div> */}
                     <label htmlFor="color">
                        <div className="flex flex-col gap-1 cursor-pointer">
                           <p className="text-[9px] opacity-50">Brush Color</p>
                           <div className="flex items-center gap-1">
                              {brushColors.map((color, id) => {
                                 return (
                                    <div
                                       key={id}
                                       className={`w-[20px] h-[20px] rounded-md bg-white flex items-center justify-center ${brushColor == color && 'border border-primary'}`}
                                       onClick={() => setBrushColor(color)}
                                    >
                                       <div
                                          style={{ backgroundColor: color }}
                                          className={`border-none h-[16px] w-[16px] cursor-pointer rounded-full`}
                                          id="color"
                                          // type="color"
                                          // onChange={(e) => setBrushColor(e.target.value)}
                                       ></div>
                                    </div>
                                 );
                              })}
                           </div>
                        </div>
                     </label>
                  </div>
               </div>
            )}
            {selectedImage && (
               <div className="flex gap-5 items-center justify-center h-full max-w-full overflow-auto">
                  {isEditing ? (
                     <div className="flex gap-5 max-w-full">
                        {image && (
                           <Stage
                              width={(image.width / image.height) * 500}
                              height={500}
                              onMouseDown={handleMouseDown}
                              onMouseMove={handleMouseMove}
                              onMouseUp={handleMouseUp}
                              className="border border-borderColor hover:cursor-context-menu max-w-full "
                           >
                              <Layer>
                                 <KonvaImage
                                    image={image}
                                    width={(image.width / image.height) * 500}
                                    height={500}
                                 />
                                 {currentLine.map((line, i) => (
                                    <Line
                                       key={i}
                                       points={line.points.flat()}
                                       stroke={line.color}
                                       strokeWidth={line.size}
                                       tension={0.5}
                                       lineCap="round"
                                       globalCompositeOperation="source-over"
                                    />
                                 ))}
                              </Layer>
                           </Stage>
                        )}
                        {image && (
                           <canvas
                              ref={maskCanvasRef}
                              style={{ display: 'none' }}
                              width={(image.width / image.height) * 500}
                              height={500}
                           />
                        )}
                        {image && (
                           <div
                              className="bg-black relative max-w-full"
                              style={{ width: (image.width / image.height) * 500 }}
                           >
                              {currentLine.length > 0 && (
                                 <button
                                    disabled={isSubmittingUpdate}
                                    className=" text-xs flex items-center 
                                    justify-center w-[30px] h-[30px] 
                                    absolute top-3 right-3 bg-borderColor 
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
                              )}
                              <img
                                 ref={imgRef}
                                 className="h-[500px] flex items-center justify-center max-w-full"
                                 alt="Masked Output"
                              />
                           </div>
                        )}
                     </div>
                  ) : (
                     <img
                        src={selectedImage}
                        className="h-[500px] max-w-full"
                        alt="Masked Output"
                     />
                  )}
               </div>
            )}
         </Modal>
      </>
   );
}
