import { DragEvent } from 'react';
import { getFileAsDataURL, getFileKind } from '../utils/file';
import { Edge, Node, XYPosition } from 'reactflow';
import { AddNodeParams } from '../types/types';

interface DropHandlerParams {
   setNodes: (nodes: Node[]) => void;
   setEdges: (edges: Edge[]) => void;
   screenToFlowPosition: (position: XYPosition) => XYPosition;
   addNode: (node: AddNodeParams) => void;
}

export function dragHandler(event: DragEvent<HTMLDivElement>) {
   event.preventDefault();
   if (!event.dataTransfer) return;

   event.dataTransfer.dropEffect = 'move';
}

export function dropHandler({
   screenToFlowPosition,
   setNodes,
   setEdges,
   addNode
}: DropHandlerParams) {
   return async (event: DragEvent<HTMLDivElement>) => {
      console.log('dropHandler');
      event.preventDefault();
      if (!event.dataTransfer || !screenToFlowPosition) return;

      let i = 0;
      for (const file of event.dataTransfer.files) {
         const kind = getFileKind(file);

         // TODO: compute position in a better way
         const xy = { x: event.clientX + i * 100, y: event.clientY + i * 100 };
         const position = screenToFlowPosition(xy);

         switch (kind) {
            case 'image':
               const imageData = await getFileAsDataURL(file);
               addNode({
                  position,
                  type: 'PreviewImage',
                  defaultValues: { image: imageData }
               });

               break;
            case 'video':
               const videoData = await getFileAsDataURL(file);
               addNode({
                  position,
                  type: 'PreviewVideo',
                  defaultValues: {
                     video: {
                        src: videoData,
                        type: file.type
                     }
                  }
               });

               break;
            case 'json':
               try {
                  const flow = JSON.parse(await file.text());

                  if (typeof flow == 'object') {
                     setNodes(flow.nodes || []);
                     setEdges(flow.edges || []);
                  }
               } catch (e) {
                  console.error('Failed to load workflow');
               }
               break;
            default:
               return;
         }

         i += 1;
      }
   };
}
