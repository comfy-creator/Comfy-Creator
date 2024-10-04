import { useEffect, useMemo, useRef, useState } from 'react';
import { RefValue } from '../../types/types';
import { useFlowStore } from '../../store/flow';

type PreviewMaskedImageWidgetProps = {
   refValue?: RefValue;
   value?: any;
   nodeId?: string;
};

const PreviewMaskedImageWidget = ({  refValue }: PreviewMaskedImageWidgetProps) => {
   const { nodes } = useFlowStore((state) => state);
   const [base64, setBase64] = useState<string | null>(null);
   const canvasRef = useRef<HTMLCanvasElement | null>(null); // Create a ref for the canvas

   const refNode = useMemo(() => {
      if (refValue?.nodeId === undefined) return;
      return nodes.find((node) => node.id === refValue?.nodeId);
   }, [refValue, nodes]);

   useEffect(() => {
      if (!refValue?.nodeId) {
         canvasRef.current?.getContext('2d')?.reset()
         setBase64(null);
      }
   }, [refValue]);

   useMemo(() => {
      const base64 = refNode?.data?.outputs[refValue?.handleName!]?.value as any;
      setBase64(base64);
   }, [refNode, refValue]);

   useEffect(() => {
      if (base64) {
         displayImageFromBase64(base64);
      }
   }, [base64, canvasRef]);

   function displayImageFromBase64(base64: string) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;
      console.log('Here>>>>');
      const img = new Image();
      img.src = base64;
      img.onload = () => {
         console.log('Loading here>>>');
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
      <div className="">
         <canvas ref={canvasRef} />
      </div>
   );
};

export default PreviewMaskedImageWidget;