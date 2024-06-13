import { useFlowStore } from '../store/flow.ts';
import { ComfyWsMessage } from '../types/types.ts';

export const ApiEventEmitter = new EventTarget();

interface EventType {
  detail: ComfyWsMessage;
  runId: string;
}

ApiEventEmitter.addEventListener('comfyMessage', (event) => {
  const { detail, runId } = event as unknown as EventType;
  if (!detail) {
    console.error(`No detail found in event: ${event}`);
  }

  const { type, data } = detail;
  const { setExecutionProgress, setCurrentExecutionNodeId, setExecutionOutput } =
    useFlowStore.getState();

  if ('node' in data && data.node) {
    setCurrentExecutionNodeId(runId, data.node);
  }

  if (type === 'progress') {
    setExecutionProgress(runId, data.value, data.max);
  } else {
    if (type === 'executed') {
      // setCurrentExecutionNodeId(null);
      setExecutionOutput(runId, data.output);
    }

    setExecutionProgress(runId, null);
  }

  console.log('Received message:', detail);
});
