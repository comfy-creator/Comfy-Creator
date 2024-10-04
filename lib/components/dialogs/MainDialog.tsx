
import { ReactNode, RefObject } from 'react';

interface MainDialogProps {
  isOpen: boolean;
  content: ReactNode;
  actionButtons: ReactNode;
  modalRef: RefObject<HTMLDivElement>;
  setIsOpen: (isOpen: boolean) => void;
}

export function MainDialog({
  modalRef,
  isOpen,
  setIsOpen,
  content,
  actionButtons
}: MainDialogProps) {
  return (
     <div
        ref={modalRef}
        className="hidden fixed z-[100] p-[30px_30px_10px_30px] bg-comfyMenuBg text-error-text shadow-[0_0_20px_#888888] rounded-[10px] top-1/2 left-1/2 max-w-[80vw] max-h-[80vh] transform -translate-x-1/2 -translate-y-1/2 overflow-hidden justify-center font-mono text-[15px]"
        style={{ display: isOpen ? 'flex' : 'none' }}
     >
        <div className="flex flex-col">
           {content}

           <button type="button" onClick={() => setIsOpen(false)}>
              Close
           </button>
           {actionButtons}
        </div>
     </div>
  );
}