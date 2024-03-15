import { ReactNode, RefObject } from 'react';

interface MainDialogProps {
  isOpen: boolean;
  content: ReactNode;
  actionButtons: ReactNode;
  ref?: RefObject<HTMLDivElement>;
  setIsOpen: (isOpen: boolean) => void;
}

export function MainDialog({ ref, isOpen, setIsOpen, content, actionButtons }: MainDialogProps) {
  return (
    <div ref={ref} className="comfy-modal" style={{ display: isOpen ? 'flex' : 'none' }}>
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
