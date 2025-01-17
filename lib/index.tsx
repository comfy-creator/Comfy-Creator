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
import * as RFlow from '@xyflow/react';

import './styles/index.css';
import 'react-toastify/dist/ReactToastify.css';
import '@xyflow/react/dist/style.css';
import 'viewerjs/dist/viewer.css';
import { GraphContextProvider } from './contexts/graph';
import { Database } from './store/database';

interface GraphEditorProps {
   token?: string;
   server?: 'local' | 'cloud';
}

function GraphEditor(props: GraphEditorProps) {
   const [isDBReady, setIsDBReady] = useState(false);

   useEffect(() => {
      // Set window variable
      window.React = React;
      window['@xyflow/react'] = RFlow;
      window.ReactFlow = RFlow;

      Database.on('ready', () => {
         setIsDBReady(true);
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

declare global {
   interface Window {
      React?: any;
      ReactFlow?: any;
      '@xyflow/react'?: any;
   }
}