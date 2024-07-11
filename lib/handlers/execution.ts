import { API_URL } from '../config/constants';
import { AppNode, ExecutionState, UpdateInputData } from '../types/types';

export function handleOnExecute({
   nodes,
   execution,
   updateInputData
}: {
   nodes: AppNode[];
   execution: ExecutionState;
   updateInputData: UpdateInputData;
}) {
   const node = nodes.find((node) => node.id === execution.currentNodeId);
   if (node?.id !== execution.currentNodeId) return;
   const { images } = execution.output;

   const fileView = API_URL.VIEW_FILE({ ...images?.[0] });
   updateInputData({
      display_name: 'image',
      nodeId: node.id,
      data: { value: fileView }
   });
}
