import { Rect } from "@xyflow/react";
import { AppNode } from "../types/types";

export function getNodePositionInGroup(node: AppNode, containerNode: AppNode) {
   const nodePosition = node.position ?? { x: 0, y: 0 };
   nodePosition.x = nodePosition.x - containerNode.position.x;
   nodePosition.y = nodePosition.y - containerNode.position.y;

   return nodePosition;
}

export function getNodePositionOutOfGroup(node: AppNode, containerNode: AppNode) {
   const nodePosition = node.position ?? { x: 0, y: 0 };
   nodePosition.x = nodePosition.x + containerNode.position.x;
   nodePosition.y = nodePosition.y + containerNode.position.y;
   return nodePosition;
}

export function isNodeInGroup(a: Rect, b: Rect) {
   return (
      a.x <= b.x && a.y <= b.y && a.x + a.width >= b.x + b.width && a.y + a.height >= b.y + b.height
   );
}