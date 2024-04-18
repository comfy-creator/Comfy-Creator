import { useFlowStore } from '../store/flow.ts';
import { ComfyWsMessage } from './types.ts';

export const ApiEventEmitter = new EventTarget();

ApiEventEmitter.addEventListener('comfyMessage', (event) => {
  const { detail } = event as { detail: ComfyWsMessage };
  if (!detail) {
    console.error(`No detail found in event: ${event}`);
  }

  const { type, data } = detail;
  const { setExecutionProgress, setCurrentExecutionNodeId, setExecutionOutput } =
    useFlowStore.getState();

  if ('node' in data && data.node) {
    setCurrentExecutionNodeId(data.node);
  }

  if (type === 'progress') {
    setExecutionProgress(data.value, data.max);
  } else {
    if (type === 'executed') {
      // setCurrentExecutionNodeId(null);
      setExecutionOutput(data.output);
    }

    setExecutionProgress(null);
  }

  console.log('Received message:', detail);
});
