import { BaseEdge, getSimpleBezierPath, Position } from 'reactflow';
import { themes } from '../../config/themes.ts';

export interface GetBezierPathParams {
  sourceX: number;
  sourceY: number;
  sourcePosition?: Position;
  targetX: number;
  targetY: number;
  targetPosition?: Position;
  curvature?: number;
}

export function createEdgeFromTemplate({ type }: { type: string }) {
  const bgColor = themes.dark.colors.node_slot[type as keyof typeof themes.dark.colors.node_slot];

  return ({ sourceX, sourceY, targetX, targetY }: GetBezierPathParams) => {
    const params = { sourceX, sourceY, targetX, targetY };
    const [edgePath] = getSimpleBezierPath(params);

    return (
      <BaseEdge
        path={edgePath}
        style={{
          backgroundColor: bgColor
        }}
      />
    );
  };
}
