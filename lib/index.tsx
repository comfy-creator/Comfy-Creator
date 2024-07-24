// Note: SOURCE = output, TARGET = input. Yes; this is confusing

import React, { useEffect, useState } from 'react';
import { MainFlow } from './components/MainFlow';
import { ToastContainer } from 'react-toastify';
import { ContextMenuProvider } from './contexts/contextmenu';
import { ApiContextProvider } from './contexts/api';
import { SettingsContextProvider } from './contexts/settings';
import { ReactFlowProvider } from '@xyflow/react';
import { DialogContextProvider } from './contexts/dialog';
import { ErrorProvider } from './contexts/error';
import { LoggingContextProvider } from './contexts/logging';

import './styles/index.css';
import 'react-toastify/dist/ReactToastify.css';
import '@xyflow/react/dist/style.css';
import 'viewerjs/dist/viewer.css';
import { initDB } from './store/database';
import { GraphContextProvider } from './contexts/graph';

interface GraphEditorProps {
  token?: string;
  server?: 'local' | 'cloud';
}

function GraphEditor(props: GraphEditorProps) {
  const [isDBReady, setIsDBReady] = useState(false);

  useEffect(() => {
    initDB().then((res) => {
      setIsDBReady(res);
    });
  }, []);

  return isDBReady ? (
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
                <GraphContextProvider>
                  <SettingsContextProvider>
                    <LoggingContextProvider>
                      <MainFlow />
                    </LoggingContextProvider>
                  </SettingsContextProvider>
                </GraphContextProvider>
              </ContextMenuProvider>
            </ErrorProvider>
          </DialogContextProvider>
        </ApiContextProvider>
      </ReactFlowProvider>
    </div>
  ) : (
    <div>Loading...</div>
  );
}

export default GraphEditor;
