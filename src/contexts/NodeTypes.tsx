import {
  ComponentType,
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";
import { NodeProps, NodeTypes } from "reactflow";

interface INodeTypes {
  registerNodeType: (type: string, node: ComponentType<NodeProps>) => void;
  unregisterNodeType: (type: string) => void;
  nodeTypes: NodeTypes;
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

  const registerNodeType = (type: string, node: ComponentType<NodeProps>) => {
    if (nodeTypes[type]) {
      throw new Error(`Node type '${type}' already exists`);
    }

    return setNodeTypes((prev) => ({
      ...prev,
      [type]: node,
    }));
  };

  const unregisterNodeType = (type: string) => {
    if (!nodeTypes[type]) {
      throw new Error(`Node type '${type}' does not exist`);
    }

    return setNodeTypes((prev) =>
      Object.keys(prev).reduce((obj, key) => {
        if (key !== type) {
          obj[key] = prev[key];
        }

        return obj;
      }, {} as NodeTypes)
    );
  };

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
