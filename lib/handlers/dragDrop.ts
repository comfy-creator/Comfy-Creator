import { DragEvent, useCallback, useEffect, useRef } from 'react';
import { getFileAsDataURL, getFileKind } from '../utils/file';
import { Edge, XYPosition, getNodesBounds } from '@xyflow/react';
import { AddNodeParams, AppNode } from '../types/types';
import { useFlowStore } from '../store/flow';
import { NODE_GROUP_NAME } from '../config/constants';
import { isNodeInGroup } from './helpers';

interface DropHandlerParams {
   setNodes: (nodes: AppNode[]) => void;
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

export function useDragNode() {
   const mousedownRef = useRef(false);
   const draggingRef = useRef(false);
   const movingOnGroupId = useRef<string | null>(null);
   const selectedNodesRef = useRef<AppNode[]>([]);

   const { removeNodeFromGroup, addNodeToGroup } = useFlowStore.getState();

   const onMouseUp = useCallback(() => {
      mousedownRef.current = false;
      const selectedNodes = selectedNodesRef.current;

      if (draggingRef.current) {
         draggingRef.current = false;

         if (selectedNodes.length === 0) {
            return;
         }

         const { nodes } = useFlowStore.getState();

         const movingOnGroupNode = nodes.find((n) => n.id === movingOnGroupId.current);

         selectedNodes.forEach((node) => {
            if (node.parentId && node.parentId === movingOnGroupId.current) {
               return;
            }

            if (!node.parentId && movingOnGroupNode) {
               addNodeToGroup(node, movingOnGroupNode);
               return;
            }

            if (node.parentId && !movingOnGroupId) {
               removeNodeFromGroup(node);
               return;
            }
         });
      }
   }, []);

   const onMouseDown = useCallback((ev: MouseEvent) => {
      mousedownRef.current = true;
   }, []);

   useEffect(() => {
      document.body.addEventListener('mousedown', onMouseDown, true);
      document.body.addEventListener('mouseup', onMouseUp, true);

      return () => {
         document.body.removeEventListener('mousedown', onMouseDown, true);
         document.body.removeEventListener('mouseup', onMouseUp, true);
      };
   }, [onMouseDown, onMouseUp]);

   const onNodeDrag = useCallback((param: { nodes: AppNode[] }) => {
      if (mousedownRef.current && param.nodes.length > 0) {
         if (param.nodes.find((n) => n.type === NODE_GROUP_NAME)) {
            return;
         }
         draggingRef.current = true;

         const { nodes } = useFlowStore.getState();

         selectedNodesRef.current = param.nodes;

         const nodesBound = getNodesBounds(param.nodes);

         const groupNodes = nodes.filter((n) => n.type === NODE_GROUP_NAME);
         const groupNode = groupNodes.find((n) => {
            const groupBound = getNodesBounds([n]);
            const ret = isNodeInGroup(groupBound, nodesBound);
            return ret;
         });

         if (groupNode) {
            movingOnGroupId.current = groupNode.id;
         } else {
            movingOnGroupId.current = null;
         }
      }
   }, []);

   return {
      onNodeDrag,
      onMouseUp
   };
}
