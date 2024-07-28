import { useEffect, useState } from 'react';
import { useFlowStore } from '../../store/flow';
import {} from '@radix-ui/react-icons';
import UndoIcon from '../icons/UndoIcon';
import RedoIcon from '../icons/RedoIcon';

const UndoRedo = () => {
   const { undoManager, undo, redo } = useFlowStore((state) => state);

   const [canUndo, setCanUndo] = useState(false);
   const [canRedo, setCanRedo] = useState(false);

   useEffect(() => {
      if (!undoManager) {
         return;
      }
      const handler = (_: any) => {
         setCanRedo(undoManager.canRedo());
         setCanUndo(undoManager.canUndo());
      };
      undoManager.on('stack-item-added', handler);
      undoManager.on('stack-item-popped', handler);
      undoManager.on('stack-item-updated', handler);

      return () => {
         undoManager.off('stack-item-updated', handler);
      };
   }, [undoManager]);

   return (
      <div className="undo-redo">
         <button
            onClick={() => {
               canUndo && undo();
            }}
            className="comfy-btn"
            disabled={!canUndo}
         >
            <UndoIcon />
         </button>
         <button
            onClick={() => {
               canRedo && redo();
            }}
            className="comfy-btn"
            disabled={!canRedo}
         >
            <RedoIcon />
         </button>
      </div>
   );
};

export default UndoRedo;
