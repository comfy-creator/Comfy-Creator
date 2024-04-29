// Note: SOURCE = output, TARGET = input. Yes; this is confusing

import React from 'react';
import { MainFlow } from './components/MainFlow';
import { ToastContainer } from 'react-toastify';
import { ContextMenuProvider } from './contexts/contextmenu';
import { ApiContextProvider } from './contexts/api';
import { SettingsContextProvider } from './contexts/settings';
import { ReactFlowProvider } from 'reactflow';
import { DialogContextProvider } from './contexts/dialog';
import { ErrorProvider } from './contexts/error';
import { LoggingContextProvider } from './contexts/logging';

import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import 'reactflow/dist/style.css';
import 'viewerjs/dist/viewer.css';

interface GraphEditorProps {
  token?: string;
  server?: 'local' | 'cloud';
}

function GraphEditor(props: GraphEditorProps) {
  return (
    <div className="main-root">
      <ReactFlowProvider>
        <ApiContextProvider props={props}>
          <DialogContextProvider>
            <ErrorProvider>
              <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="dark"
              />

              <ContextMenuProvider>
                <SettingsContextProvider>
                  <LoggingContextProvider>
                    <MainFlow />
                  </LoggingContextProvider>
                </SettingsContextProvider>
              </ContextMenuProvider>
            </ErrorProvider>
          </DialogContextProvider>
        </ApiContextProvider>
      </ReactFlowProvider>
    </div>
  );
}

export default GraphEditor;
