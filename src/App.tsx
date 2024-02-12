// Note: SOURCE = output, TARGET = input. Yes; this is confusing

import { NodeTypesProvider } from "./contexts/NodeTypes.tsx";
import { MainFlow } from "./components/MainFlow.tsx";

import "reactflow/dist/style.css";
import { ContextMenuProvider } from "./contexts/ContextMenu.tsx";
import { ReactFlowProvider } from "reactflow";

function App() {
  return (
    <ReactFlowProvider>
      <NodeTypesProvider>
        <ContextMenuProvider>
          <MainFlow />
        </ContextMenuProvider>
      </NodeTypesProvider>
    </ReactFlowProvider>
  );
}

export default App;
