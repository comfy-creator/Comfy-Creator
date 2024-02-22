import React from 'react';
import { createContext, ReactNode } from 'react';
import { createUseContextHook } from './hookCreator';
import { WorkflowLoadError } from '../components/errors/WorkflowLoadError';
import { MissingNodesError } from '../components/errors/MissingNodesError';
import { useDialog } from './dialog.tsx';

interface IErrorContext {
  triggerWorkflowError: (hints: string[], error: Error) => void;
  triggerMissingNodesError: (nodeTypes: string[]) => void;
}

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showDialog } = useDialog();

  const triggerWorkflowError = (hints: string[], error: Error) => {
    showDialog(<WorkflowLoadError err={error} errorHint={hints} />);
  };

  const triggerMissingNodesError = (nodeTypes: string[]) => {
    showDialog(<MissingNodesError nodeTypes={nodeTypes} />);
  };

  return (
    <ErrorContext.Provider
      value={{
        triggerWorkflowError,
        triggerMissingNodesError
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

const ErrorContext = createContext<IErrorContext | undefined>(undefined);

export const useError = createUseContextHook(
  ErrorContext,
  'useError must be used within a ErrorProvider'
);
