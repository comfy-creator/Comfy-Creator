import {
  ComponentType,
  createContext,
  ReactNode,
  useContext,
  useState,
  useCallback
} from "react";
import { NodeProps, NodeTypes } from "reactflow";

interface INodeTypes {
  nodeTypes: NodeTypes;
  registerNodeType: (typeName: string, node: ComponentType<NodeProps>) => void;
  unregisterNodeType: (typeName: string) => void;
}

const NodeTypesContext = createContext<INodeTypes | null>(null);

export function useNodeTypes() {
  const context = useContext(NodeTypesContext);
  if (!context) {
    throw new Error("NodeTypes must be used within a NodeTypesProvider");
  }

  return context;
}

export function NodeTypesProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [nodeTypes, setNodeTypes] = useState<NodeTypes>({});

  // This will overwrite old node-definitions of the same name
  const registerNodeType = useCallback((typeName: string, node: ComponentType<NodeProps>) => {
    setNodeTypes((prev) => ({
      ...prev,
      [typeName]: node,
    }));
  }, []);

  const unregisterNodeType = useCallback((typeName: string) => {
    return setNodeTypes(({ [typeName]: _, ...otherNodes }) => otherNodes);
  }, []);

  return (
    <NodeTypesContext.Provider
      value={{
        nodeTypes,
        registerNodeType,
        unregisterNodeType,
      }}
    >
      {children}
    </NodeTypesContext.Provider>
  );
}
