// Note: SOURCE = output, TARGET = input. Yes; this is confusing

import { NodeTypesProvider } from "./contexts/NodeTypes.tsx";
import { MainFlow } from "./components/MainFlow.tsx";

import "reactflow/dist/style.css";

function App() {
  return (
    <NodeTypesProvider>
      <MainFlow />
    </NodeTypesProvider>
  );
}

export default App;
