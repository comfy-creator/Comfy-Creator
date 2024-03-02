import { ConnectionLineComponentProps } from 'reactflow';
import { useFlowStore } from '../store/flow.ts';
import { themes } from '../config/themes.ts';

export function ConnectionLine({ fromX, fromY, toX, toY }: ConnectionLineComponentProps) {
  const { currentConnectionLineType } = useFlowStore();

  const strokeColor =
    themes.dark.colors.node_slot[
      currentConnectionLineType as keyof typeof themes.dark.colors.node_slot
    ];

  return (
    <g>
      <path
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.5}
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle cx={toX} cy={toY} fill="#fff" r={3} stroke={'#FFD500'} strokeWidth={1.5} />
    </g>
  );
}
