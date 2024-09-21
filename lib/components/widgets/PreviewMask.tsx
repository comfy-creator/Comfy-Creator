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
            // getting the base64 from the value obj
            const base64 = value.base64;

            console.log('Base64>>>>', base64);
            displayImageFromBase64(base64);
         };
      }
   }, [value]);

   function displayImageFromBase64(base64: string) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      const img = new Image();
      img.src = base64;
      img.onload = () => {
         const width = 166;
         const height = (img.height / img.width) * width;
         canvas.width = width;
         canvas.height = height;

         ctx.fillStyle = 'black';
         ctx.fillRect(0, 0, width, height);

         // Draw the image (mask) in white
         ctx.globalCompositeOperation = 'source-over';
         ctx.drawImage(img, 0, 0, width, height);
      };
   }

   return (
      <div className="preview-masked-image-node">
         <canvas ref={canvasRef} />
      </div>
   );
};

export default PreviewMaskedImageWidget;
