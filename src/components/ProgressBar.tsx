import React from 'react';
import { useFlowStore } from '../store/flow.ts';

export function ProgressBar() {
  const {
    execution: { progress }
  } = useFlowStore();

  if (!progress) return null;
  const percentage = (progress.value / progress.max) * 100;

  return (
    <div className="flow-progress_container">
      <div className="flow-progress_bar" style={{ width: `${percentage}%` }} />
    </div>
  );
}

export default ProgressBar;
