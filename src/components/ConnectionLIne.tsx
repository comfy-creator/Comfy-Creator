import { ConnectionLineComponentProps, getBezierPath } from 'reactflow';
import { useFlowStore } from '../store/flow.ts';
import { themes } from '../config/themes.ts';

export function ConnectionLine({ fromX, fromY, toX, toY, fromPosition, toPosition }: ConnectionLineComponentProps) {
  const { currentConnectionLineType } = useFlowStore();

  const [path] = getBezierPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  });

  const { node_slot } = themes.dark.colors;
  const strokeColor =
    node_slot[currentConnectionLineType as keyof typeof node_slot] ?? node_slot['DEFAULT'];

  return (
    <g>
      <path
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.5}
        d={path}
      />
      <circle cx={toX} cy={toY} fill="#fff" r={3} stroke={strokeColor} strokeWidth={3} />
    </g>
  );
}
