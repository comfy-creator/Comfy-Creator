import { BaseEdge, getBezierPath, Position } from 'reactflow';
import { useSettingsStore } from '../../store/settings.ts';

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
  return ({ sourceX, sourceY, targetX, targetY }: GetBezierPathParams) => {
    const { getActiveTheme } = useSettingsStore();
    const theme = getActiveTheme();
    const strokeColor =
      theme.colors.types[type as keyof typeof theme.colors.types] ?? theme.colors.types['DEFAULT'];

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
