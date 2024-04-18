import { RightTriangle } from './RightTriangle';
import { LeftTriangle } from './LeftTriangle';

export function WidgetForwardIcon({ onClick }: { onClick: () => void }) {
  return (
    <div style={{ marginTop: '1px' }} onClick={onClick}>
      <RightTriangle />
    </div>
  );
}

export function WidgetBackwardIcon({ onClick }: { onClick: () => void }) {
  return (
    <div style={{ marginTop: '1px' }} onClick={onClick}>
      <LeftTriangle />
    </div>
  );
}
