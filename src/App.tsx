// Note: SOURCE = output, TARGET = input. Yes; this is confusing

import { MainFlow } from './components/MainFlow';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'reactflow/dist/style.css';
import { ContextMenuProvider } from './contexts/ContextMenu';
import { ApiContextProvider } from './contexts/apiContext';
import { SettingsContextProvider } from './contexts/settingsContext';
import { ReactFlowProvider } from 'reactflow';

function App() {
  return (
    <ReactFlowProvider>
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
            <MainFlow />
          </SettingsContextProvider>
        </ApiContextProvider>
      </ContextMenuProvider>
    </ReactFlowProvider>
  );
}

export default App;
