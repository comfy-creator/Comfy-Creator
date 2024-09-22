import { useEffect, useState } from 'react';
import { useFlowStore } from '../../store/flow';

export const ImageRouterWidget = ({ nodeId, value }: { nodeId?: string; value?: any }) => {
   const { nodes, setNodes, edges } = useFlowStore((state) => state);
   const [images, setImages] = useState<string[]>(value || []);

   useEffect(() => {
      const connectedEdge = edges.find(
         (edge) => edge.target === nodeId && edge.targetHandle === `${nodeId}::image`
      );

      if (connectedEdge) {
         const filePickerNode = nodes.find((node) => node.id === connectedEdge.source);

         if (filePickerNode) {
            const outputImages = filePickerNode.data.inputs['file']?.value || [];

            setImages(Array.isArray(outputImages) ? outputImages : [outputImages]);
         } else {
            setImages([]);
         }
      } else {
         setImages([]);
      }
   }, [nodeId, nodes, edges]);

   useEffect(() => {
      const updatedNodes = nodes.map((node) => {
         if (node.id === nodeId) {
            const newOutputs = { ...node.data.outputs };
            images.forEach((image, index) => {
               const outputKey = `image${index + 1}`;
               newOutputs[outputKey] = {
                  display_name: `image${index + 1}`,
                  edge_type: 'IMAGE',
                  value: { imageUrl: image }
               };
            });
            Object.keys(newOutputs).forEach((key) => {
               if (
                  key.startsWith('image') &&
                  !images.some((image, index) => `image${index + 1}` === key)
               ) {
                  delete newOutputs[key];
               }
            });
            return { ...node, data: { ...node.data, outputs: newOutputs } };
         }
         return node;
      });
      setNodes(updatedNodes);
   }, [images]);

   return (
      <div>
         <p className="widget_input_item_text mt-[.3rem] text-[.6rem]">images</p>
      </div>
   );
};
