import { ErrorHint } from './ErrorHint';

interface WorkflowLoadErrorProps {
  err: Error;
  errorHint: string[];
}

export function WorkflowLoadError({ err, errorHint }: WorkflowLoadErrorProps) {
  return (
    <div>
      <p>Loading aborted due to error reloading workflow data</p>
      <pre
        className='p-[5px] bg-[rgba(255,0,0,0.2)]'
      >
        {err.toString()}
      </pre>

      <pre
        className='p-[5px] text-[#ccc] text-[10px] max-h-[50vh] overflow-auto bg-[rgba(0,0,0,0.2)]'
      >
        {err.stack || 'No stacktrace available'}
      </pre>

      {errorHint.map((hint, i) => {
        const pos = hint.indexOf('/extensions/');
        return <ErrorHint key={i} script={hint.substring(pos) ?? ''} />;
      })}
    </div>
  );
}