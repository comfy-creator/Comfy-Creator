import { useWorkflow } from '../../../hooks/useWorkflow.tsx';
import { useEffect } from 'react';
import { useFlowStore } from '../../../store/flow';

interface SaveButtonProps {
  promptFilename: {
    value: boolean;
  };
}

const SaveButton = ({ promptFilename }: SaveButtonProps) => {
  const { serializeGraph } = useWorkflow();
  const { addHotKeysHandlers } = useFlowStore();

  const handleClick = () => {
    let filename: string | null = 'worklow.json';
    if (promptFilename.value) {
      filename = prompt('Save workflow as:', filename);
      if (!filename) return;
      if (!filename.toLowerCase().endsWith('.json')) {
        filename += '.json';
      }
    }

    const json = JSON.stringify(serializeGraph(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const tag = document.createElement('a');
    tag.href = url;
    tag.download = filename || 'workflow.json';
    document.body.appendChild(tag);
    tag.click();

    document.body.removeChild(tag);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    console.log('Swjs');
    addHotKeysHandlers({ 'ctrl+g': handleClick });
  }, []);

  return (
    <button id="comfy-save-button" onClick={handleClick}>
      Save
    </button>
  );
};

export default SaveButton;
