import React, { ReactNode, useState } from 'react';
import { createUseContextHook } from './hookCreator';
import { MainDialog } from '../components/Dialogs/MainDialog';

interface DialogContextType {
  showDialog: (content: ReactNode) => void;
}

const DialogContext = React.createContext<DialogContextType | null>(null);
export const useDialog = createUseContextHook(
  DialogContext,
  'useDialog must be used within a DialogContextProvider'
);

export const DialogContextProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<ReactNode | null>(null);

  const show = (content: ReactNode) => {
    setIsOpen(true);
    setDialogContent(() => content);
  };

  return (
    <DialogContext.Provider value={{ showDialog: show }}>
      {children}

      <MainDialog isOpen={isOpen} setIsOpen={setIsOpen} content={dialogContent} />
    </DialogContext.Provider>
  );
};
