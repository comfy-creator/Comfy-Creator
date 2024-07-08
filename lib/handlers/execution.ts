import { API_URL } from '../config/constants.ts';
import { Node } from 'reactflow';
import { ExecutionState, NodeData, UpdateInputData } from '../types/types.ts';

export function handleOnExecute({
  nodes,
  execution,
  updateInputData
}: {
  nodes: Node<NodeData>[];
  execution: ExecutionState;
  updateInputData: UpdateInputData;
}) {
  const node = nodes.find((node) => node.id === execution.currentNodeId);
  if (node?.id !== execution.currentNodeId) return;
  const { images } = execution.output;

  const fileView = API_URL.VIEW_FILE({ ...images?.[0] });
  updateInputData({
    name: 'image',
    nodeId: node.id,
    data: { value: fileView }
  });
}