import { BaseEdge, getBezierPath, Position } from 'reactflow';
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
  const {
    dark: {
      colors: { node_slot }
    }
  } = themes;
  const strokeColor = node_slot[type as keyof typeof node_slot] ?? node_slot['DEFAULT'];

  return ({ sourceX, sourceY, targetX, targetY }: GetBezierPathParams) => {
    const params = { sourceX, sourceY, targetX, targetY };
    const [edgePath] = getBezierPath(params);

    return (
      <BaseEdge
        path={edgePath}
        style={{
          strokeWidth: 2,
          stroke: strokeColor
        }}
      />
    );
  };
}
