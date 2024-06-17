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

// This only changes the styling of react flow's default edge component
export function createEdgeFromTemplate({ type }: { type: string }) {
  return (params: GetBezierPathParams) => {
    const { getActiveTheme } = useSettingsStore();
    const theme = getActiveTheme();
    const strokeColor =
      theme.colors.types[type as keyof typeof theme.colors.types] || theme.colors.types['DEFAULT'];
    const [path, labelX, labelY, offsetX, offsetY] = getBezierPath(params);

    return (
      <BaseEdge
        {...{
          path,
          labelX,
          labelY,
          offsetX,
          offsetY
        }}
        style={{
          strokeWidth: 3,
          stroke: strokeColor
        }}
      />
    );
  };
}
