import { useEffect, useMemo, useState } from 'react';
import { useFlowStore } from '../../store/flow';
import { RefValue } from '../../types/types';
import { makeHandleId } from '../../utils/node';

export const ImageRouterWidget = ({
   nodeId,
   value,
   refValue
}: {
   nodeId?: string;
   value?: any;
   refValue?: RefValue;
}) => {
   const { nodes, edges, setNodes } = useFlowStore((state) => state);
   const [images, setImages] = useState<string[]>(value || []);

   const refNode = useMemo(() => {
      if (refValue?.nodeId === undefined) return;
      return nodes.find((node) => node.id === refValue?.nodeId);
   }, [refValue, nodes]);

   useEffect(() => {
      if (!refValue?.nodeId) {
         const newNodes = nodes.map((node) => {
            if (node.id == nodeId) {
               return {
                  ...node,
                  data: {
                     ...node.data,
                     outputs: {}
                  }
               };
            }
            return node;
         });
         setNodes(newNodes);
      }
   }, [refValue]);

   useMemo(() => {
      const images = refNode?.data?.outputs[refValue?.handleName!]?.value as any;
      setImages(images ? images : []);
   }, [refNode, refValue]);

   const updateOutputData = () => {
      let outputs: any = {};
      const node = nodes.find((node) => node.id === nodeId);
      if (node) {
         outputs = node.data.outputs;
      }
      const outputArray = Object.entries(outputs);
      if (images.length > 0 && images.length > outputArray.length) {
         const newData = [...images].reverse().slice(0, images.length - outputArray.length);
         for (const image of newData) {
            // no need to update the node, since it's an object clone, it updates the output object
            const imageTitle = `image${outputArray.length + 1}`;
            outputs[imageTitle] = {
               display_name: imageTitle,
               edge_type: 'IMAGE',
               isHighlighted: false,
               value: image
            };
         }
      } else if (images.length < outputArray.length) {
         const newData = outputArray.slice(images.length);
         for (const [key, _] of newData) {
            delete outputs[key];
         }
      }

      outputArray.forEach(([key, _], index) => {
         const edge = edges.find((e) => e.sourceHandle === makeHandleId(nodeId!, key));
         if (images[index]) {
            outputs[key] = {
               ...outputs[key],
               value: images[index],
               isConnected: edge ? true : false
            };
         }
      });
   };

   useEffect(() => {
      updateOutputData();
   }, [images]);

   return (
      <div>
         <p className="text-[0.6rem] mt-[0.3rem] text-dragText">images</p>
         {refValue?.nodeId && images?.length <= 0 && (
            <p className="text-[0.4rem] text-inputText">Add image to ref node to get output handles</p>
         )}
      </div>
   );
};