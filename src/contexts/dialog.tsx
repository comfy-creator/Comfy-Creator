import React, { MutableRefObject, ReactNode, useRef, useState } from 'react';
import { createUseContextHook } from './hookCreator';
import { MainDialog } from '../components/dialogs/MainDialog';

interface DialogContextType {
  showDialog: (content: ReactNode) => void;
  ref: MutableRefObject<HTMLDivElement | null>;
  addActionButtons: (buttons: ReactNode) => void;
}

const DialogContext = React.createContext<DialogContextType | null>(null);
export const useDialog = createUseContextHook(
  DialogContext,
  'useDialog must be used within a DialogContextProvider'
);

export const DialogContextProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<ReactNode>(null);
  const [actionButtons, setActionButtons] = useState<ReactNode>([]);

  const ref = useRef<HTMLDivElement>(null);

  const show = (content: ReactNode) => {
    setIsOpen(true);
    setDialogContent(() => content);
  };

  const addActionButtons = (buttons: ReactNode) => {
    setActionButtons(() => buttons);
  };

  return (
    <DialogContext.Provider
      value={{
        addActionButtons,
        showDialog: show,
        ref
      }}
    >
      {children}

      <MainDialog
        ref={ref}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        content={dialogContent}
        actionButtons={actionButtons}
      />
    </DialogContext.Provider>
  );
};
