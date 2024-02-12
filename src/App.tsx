// Note: SOURCE = output, TARGET = input. Yes; this is confusing

import { NodeTypesProvider } from "./contexts/NodeTypes";
import { MainFlow } from "./components/MainFlow";

import "reactflow/dist/style.css";
import { ContextMenuProvider } from "./contexts/ContextMenu";
import { ApiContextProvider } from "./contexts/apiContext";
import { SettingsContextProvider } from "./contexts/settingsContext";
import { ReactFlowProvider } from "reactflow";

function App() {
  return (
    <ReactFlowProvider>
      <NodeTypesProvider>
        <ContextMenuProvider>
          <ApiContextProvider>
            <SettingsContextProvider>
              <MainFlow />
            </SettingsContextProvider>
          </ApiContextProvider>
        </ContextMenuProvider>
      </NodeTypesProvider>
    </ReactFlowProvider>
  );
}

export default App;
