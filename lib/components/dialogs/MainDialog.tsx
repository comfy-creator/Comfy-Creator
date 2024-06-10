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
    <div ref={modalRef} className="comfy-modal" style={{ display: isOpen ? 'flex' : 'none' }}>
      <div className="comfy-modal-content">
        {content}

        <button type="button" onClick={() => setIsOpen(false)}>
          Close
        </button>
        {actionButtons}
      </div>
    </div>
  );
}
