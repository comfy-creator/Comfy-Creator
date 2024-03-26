// Note: SOURCE = output, TARGET = input. Yes; this is confusing

import { MainFlow } from './components/MainFlow';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'reactflow/dist/style.css';
import { ContextMenuProvider } from './contexts/contextmenu';
import { ApiContextProvider } from './contexts/api';
import { SettingsContextProvider } from './contexts/settings';
import { ReactFlowProvider } from 'reactflow';
import { DialogContextProvider } from './contexts/dialog';
import { ErrorProvider } from './contexts/error';
import { LoggingContextProvider } from './contexts/logging';

function App() {
  return (
    <ReactFlowProvider>
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
            <ApiContextProvider>
              <SettingsContextProvider>
                <LoggingContextProvider>
                  <MainFlow />
                </LoggingContextProvider>
              </SettingsContextProvider>
            </ApiContextProvider>
          </ContextMenuProvider>
        </ErrorProvider>
      </DialogContextProvider>
    </ReactFlowProvider>
  );
}

export default App;
