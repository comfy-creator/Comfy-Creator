import React from 'react';
import { useFlowStore } from '../store/flow';

export function ProgressBar(props: { node_id: string }): JSX.Element | null {
   // TO DO: make this progress bar actually useful; it needs to pull state for the specified node
   const progress = { value: 1, max: 1 };
   // const {
   //   execution: { progress }
   // } = useFlowStore();

   if (!progress) return null;
   const percentage = (progress.value / progress.max) * 100;

   return (
      <div className="flow-progress_container">
         <div className="flow-progress_bar" style={{ width: `${percentage}%` }} />
      </div>
   );
}
