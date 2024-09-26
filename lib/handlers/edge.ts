import { Connection, Edge, reconnectEdge } from '@xyflow/react';
import { getHandleName, getHandleNodeId } from '../utils/node';
import { AppNode, HandleState } from '../types/types';

export function handleEdgeUpdateStart({
   nodes,
   updateOutputData,
   updateInputData,
   setEdges,
   refValueNodes,
   setIsUpdatingEdge
}: any) {
   return (_: any, edge: Edge) => {
      setIsUpdatingEdge(true);

      if (!edge.sourceHandle || !edge.targetHandle) return;

      const sourceNode = getHandleNodeId(edge.sourceHandle);
      const targetNodeId = getHandleNodeId(edge.targetHandle);
      const targetNode = nodes.find((n: AppNode) => n.id === targetNodeId);

      const sourceHandle = getHandleName(edge.sourceHandle);
      const targetHandle = getHandleName(edge.targetHandle);

      let inputData: Partial<HandleState> = { isConnected: false };
      if (refValueNodes.includes(targetNode?.type!)) {
         inputData = { ...inputData, ref: undefined };
      }
      updateInputData({
         nodeId: targetNodeId,
         display_name: targetHandle,
         data: inputData
      });

      updateOutputData({
         nodeId: sourceNode,
         display_name: sourceHandle,
         data: { isConnected: false }
      });
      setEdges((eds: Edge[]) => eds.filter((e) => e.id !== edge.id));
   };
}

export function handleEdgeUpdate({ setIsUpdatingEdge, setEdges }: any) {
   return (oldEdge: Edge, newConnection: Connection) => {
      setEdges((eds: Edge[]) => reconnectEdge(oldEdge, newConnection, eds));
      setIsUpdatingEdge(false);
   };
}

export function handleEdgeUpdateEnd({ setIsUpdatingEdge }: any) {
   return (_: any) => setIsUpdatingEdge(false);
}