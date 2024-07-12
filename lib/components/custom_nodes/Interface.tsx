import { Edge } from '@xyflow/react';
import { AppNode, EdgeType } from '../../types/types';

const handleEdgeValidation = (nodeId: string, nodes: AppNode[], edges: Edge[]) => {
  const incomingEdges = edges.filter((edge) => edge.target === nodeId);
  const outgoingEdges = edges.filter((edge) => edge.source === nodeId);
  const node = nodes.find((n) => n.id === nodeId);


  if (!node) return;

  // Validate and modify input handles
  incomingEdges.forEach((edge) => {
    const handle = node.data.inputs[edge.targetHandle!];
    if (!isCompatible(handle.edge_type, edge.type as EdgeType)) {
      // Disconnect edge
      disconnectEdge(edge.id);
      // Modify handle if necessary
      // updateHandleType(nodeId, handle.id, deriveTypeFromEdge(edge.type));
    }
  });

  // Propagate changes to downstream nodes
  outgoingEdges.forEach((edge) => {
    const targetNode = nodes.find((n) => n.id === edge.target);
    handleEdgeValidation(targetNode?.id!, nodes, edges); // Recursive validation
  });

  // Trigger re-render or update state
  updateGraphState(nodes, edges);
};

const isCompatible = (handleType: EdgeType, edgeType: EdgeType) => {
  // Define compatibility logic
  return true;
};

const disconnectEdge = (edgeId: string) => {
  // Logic to remove edge from state
};

const updateHandleType = (nodeId: string, handleId: string, newType: EdgeType) => {
  // Logic to update handle type
};

const updateGraphState = (nodes: AppNode[], edges: Edge[]) => {
  // Logic to update the state and trigger re-render
};
