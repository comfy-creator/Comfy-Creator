export function ProgressBar(props: { progress: string }): JSX.Element | null {

   if (!props.progress) return null;

   return (
      <div className="flow-progress_container">
         <div className="flow-progress_bar" style={{ width: `${props.progress}%` }} />
      </div>
   );
}
