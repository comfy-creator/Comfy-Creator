import { ConnectionLineComponentProps, getBezierPath } from '@xyflow/react';
import { useFlowStore } from '../store/flow';
import { useSettingsStore } from '../store/settings';

export function ConnectionLine({
   fromX,
   fromY,
   toX,
   toY,
   fromPosition,
   toPosition
}: ConnectionLineComponentProps) {
   const { currentConnectionLineType } = useFlowStore();
   const { getActiveTheme } = useSettingsStore();
   const theme = getActiveTheme();

   const [path] = getBezierPath({
      sourceX: fromX,
      sourceY: fromY,
      sourcePosition: fromPosition,
      targetX: toX,
      targetY: toY,
      targetPosition: toPosition
   });

   const strokeColor =
      theme.colors.types[currentConnectionLineType as keyof typeof theme.colors.types] ??
      theme.colors.types['DEFAULT'];

   return (
      <g>
         <path fill="none" stroke={strokeColor} strokeWidth={3} d={path} />
         <circle cx={toX} cy={toY} fill="#fff" r={3} stroke={strokeColor} strokeWidth={5} />
      </g>
   );
}
