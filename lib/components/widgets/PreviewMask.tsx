import { createRef, useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { Label } from '../../types/types';

type PreviewMaskedImageWidgetProps = {
   value?: any;
   label?: string;
};

const PreviewMaskedImageWidget = ({ value }: PreviewMaskedImageWidgetProps) => {
   const [image, setImage] = useState<HTMLImageElement | null>(null);

   const [shapes, setShapes] = useState<Label['shapes']>([]);
   const stageRef = createRef<Konva.Stage>();
   const imageRef = useRef<Konva.Image>(null);
   const canvasRef = useRef<HTMLCanvasElement | null>(null); // Create a ref for the canvas

   useEffect(() => {
      if (image) {
         if (imageRef?.current) {
            imageRef?.current.cache();
         }
      }
   }, [image, imageRef.current]);

   useEffect(() => {
      console.log('Value>>>>', value);
      if (value && value.shapes) {
         setShapes(
            value.shapes.map((shape: Label['shapes']) => ({
               ...shape,
               color: 'white',
               fill: 'white'
            }))
         );
      }
      if (value && value.imageUrl) {
         const img = new Image();
         img.src = value.imageUrl;
         img.crossOrigin = 'anonymous';
         img.onload = () => {
            setImage(img);
            // Call displayImageFromBinary here with appropriate bitmap
            const bitmap = value.bitmap;

            console.log('Bitmap>>>>', bitmap);
            displayImageFromBinary(bitmap);
         };
      }
   }, [value]);

   function displayImageFromBinary(bitmap: number[][]) {
      const width = 166;
      const height = bitmap.length * (166 / bitmap[0].length);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      canvas.width = width;
      canvas.height = height;
      const imageData = ctx.createImageData(width, height);

      for (let y = 0; y < height; y++) {
         for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const value =
               bitmap[Math.floor((y * bitmap.length) / height)][
                  Math.floor((x * bitmap[0].length) / width)
               ] === 1
                  ? 255
                  : 0; // White or black
            imageData.data[index] = value; // R
            imageData.data[index + 1] = value; // G
            imageData.data[index + 2] = value; // B
            imageData.data[index + 3] = 255; // A
         }
      }

      ctx.putImageData(imageData, 0, 0);
   }

   return (
      <div className="preview-masked-image-node">
         <canvas ref={canvasRef} />
      </div>
   );
};

export default PreviewMaskedImageWidget;
