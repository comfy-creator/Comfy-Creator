import { Connection, Edge, updateEdge } from 'reactflow';
import { getHandleName, getHandleNodeId } from '../utils/node.ts';
import {
  HandleEdgeUpdateEndParams,
  HandleEdgeUpdateParams,
  HandleEdgeUpdateStartParams
} from '../types.ts';

export function handleEdgeUpdateStart({
  setIsUpdatingEdge,
  updateOutputData,
  updateInputData,
  setEdges
}: HandleEdgeUpdateStartParams) {
  return (_: any, edge: Edge) => {
    setIsUpdatingEdge(true);
    if (!edge.sourceHandle || !edge.targetHandle) return;

    const sourceNode = getHandleNodeId(edge.sourceHandle);
    const targetNode = getHandleNodeId(edge.targetHandle);

    const sourceHandle = getHandleName(edge.sourceHandle);
    const targetHandle = getHandleName(edge.targetHandle);

    updateInputData({ nodeId: targetNode, name: targetHandle, data: { isConnected: false } });
    updateOutputData({ nodeId: sourceNode, name: sourceHandle, data: { isConnected: false } });
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  };
}

export function handleEdgeUpdate({ setIsUpdatingEdge, setEdges }: HandleEdgeUpdateParams) {
  return (oldEdge: Edge, newConnection: Connection) => {
    setEdges((eds) => updateEdge(oldEdge, newConnection, eds));
    setIsUpdatingEdge(false);
  };
}

export function handleEdgeUpdateEnd({ setIsUpdatingEdge }: HandleEdgeUpdateEndParams) {
  return (_: any) => setIsUpdatingEdge(false);
}
