import { Connection, Edge, reconnectEdge } from '@xyflow/react';
import { getHandleName, getHandleNodeId } from '../utils/node';

export function handleEdgeUpdateStart({
   setIsUpdatingEdge,
   updateOutputData,
   updateInputData,
   setEdges
}: any) {
   return (_: any, edge: Edge) => {
      setIsUpdatingEdge(true);
      if (!edge.sourceHandle || !edge.targetHandle) return;

      const sourceNode = getHandleNodeId(edge.sourceHandle);
      const targetNode = getHandleNodeId(edge.targetHandle);

      const sourceHandle = getHandleName(edge.sourceHandle);
      const targetHandle = getHandleName(edge.targetHandle);

      updateInputData({ nodeId: targetNode, display_name: targetHandle, data: { isConnected: false } });
      updateOutputData({ nodeId: sourceNode, display_name: sourceHandle, data: { isConnected: false } });
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
