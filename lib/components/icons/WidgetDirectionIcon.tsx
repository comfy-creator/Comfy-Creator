import { RightTriangle } from './RightTriangle';
import { LeftTriangle } from './LeftTriangle';

interface WidgetDirectionIconProps {
  disabled?: boolean;
  onClick?: () => void;
}

export function WidgetForwardIcon({ disabled, onClick }: WidgetDirectionIconProps) {
  return (
    <div style={{ marginTop: '3px' }} onClick={onClick}>
      <RightTriangle fill={disabled ? '#656565' : '#ddd'} />
    </div>
  );
}

export function WidgetBackwardIcon({ disabled, onClick }: WidgetDirectionIconProps) {
  return (
    <div style={{ marginTop: '3px' }} onClick={onClick}>
      <LeftTriangle fill={disabled ? '#656565' : '#ddd'} />
    </div>
  );
}
