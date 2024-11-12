import { useWorkflow } from '../../../hooks/useWorkflow';
import { useEffect } from 'react';
import { useFlowStore } from '../../../store/flow';
import { Button } from '../../ui/button';

interface SaveButtonProps {
   promptFilename: {
      value: boolean;
   };
}

const SaveButton = ({ promptFilename }: SaveButtonProps) => {
   const { generateWorkflow } = useWorkflow();
   const { addHotKeysHandlers } = useFlowStore();

   const handleClick = async () => {
      let filename: string | null = 'worklow.json';
      if (promptFilename.value) {
         filename = prompt('Save workflow as:', filename);
         if (!filename) return;
         if (!filename.toLowerCase().endsWith('.json')) {
            filename += '.json';
         }
      }
      const json = JSON.stringify(generateWorkflow(), null, 2);
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
      addHotKeysHandlers({ 'ctrl+g': handleClick });
   }, []);

   return (
      <Button
         variant="outline"
         className="!py-1 h-[35px] hover:!bg-white/[1%] hover:!text-fg"
         id="comfy-save-button"
         onClick={handleClick}
      >
         Save
      </Button>
   );
};

export default SaveButton;