import { ReactNode } from 'react';

interface MainDialogProps {
  isOpen: boolean;
  content: ReactNode;
  setIsOpen: (isOpen: boolean) => void;
}

export function MainDialog({ isOpen, setIsOpen, content }: MainDialogProps) {
  return (
    <div className="comfy-modal" style={{ display: isOpen ? 'flex' : 'none' }}>
      <div className="comfy-modal-content">
        {content}
        <button type="button" onClick={() => setIsOpen(false)}>
          Close
        </button>
      </div>
    </div>
  );
}
