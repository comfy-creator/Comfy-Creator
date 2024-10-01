import { useWorkflow } from '../../../hooks/useWorkflow';
import { useEffect } from 'react';
import { useFlowStore } from '../../../store/flow';
import { Button } from '@/components/ui/button';

interface DevSaveButtonProps {
   promptFilename: {
      value: boolean;
   };
}

const DevSaveButton = ({ promptFilename }: DevSaveButtonProps) => {
   const { serializeGraphToWorkflow } = useWorkflow();
   const { addHotKeysHandlers } = useFlowStore();

   const handleClick = () => {
      let filename: string | null = 'workflow_api.json';
      if (promptFilename.value) {
         filename = prompt('Save workflow (API) as:', filename);
         if (!filename) return;
         if (!filename.toLowerCase().endsWith('.json')) {
            filename += '.json';
         }
      }

      const json = JSON.stringify(serializeGraphToWorkflow(), null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const tag = document.createElement('a');
      tag.href = url;
      tag.download = filename || 'workflow_api.json';
      document.body.appendChild(tag);
      tag.click();

      document.body.removeChild(tag);
      URL.revokeObjectURL(url);
   };

   useEffect(() => {
      addHotKeysHandlers({ 'ctrl+shift+s': handleClick });
   }, []);
   return (
      <Button
         id="comfy-dev-save-api-button"
         variant={'outline'}
         className="!py-1 h-[35px] hover:!bg-white/[1%] hover:!text-fg"
         style={{ width: '100%', display: 'none' }}
         onClick={handleClick}
      >
         Save (API Format)
      </Button>
   );
};

export default DevSaveButton;
