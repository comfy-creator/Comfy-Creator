import { createContext, ReactNode, useContext, useState, useCallback } from 'react';
import { createNodeComponentFromDef } from '../components/template/NodeTemplate';
import { NodeDefinitions, NodeTypes } from '../types';

interface INodeTypes {
  nodeTypes: NodeTypes;
  registerNodeTypes: (defs: NodeDefinitions) => void;
  unregisterNodeTypes: (typeNames: string[]) => void;
}

const NodeTypesContext = createContext<INodeTypes | null>(null);

export function useNodeTypes() {
  const context = useContext(NodeTypesContext);
  if (!context) {
    throw new Error('NodeTypes must be used within a NodeTypesProvider');
  }

  return context;
}

export function NodeTypesProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [nodeTypes, setNodeTypes] = useState<NodeTypes>({});

  // This will overwrite old node-definitions of the same name
  const registerNodeTypes = useCallback((defs: NodeDefinitions) => {
    setNodeTypes((prev) => {
      const newTypes = { ...prev };

      Object.entries(defs).forEach(([type, def]) => {
        newTypes[type] = createNodeComponentFromDef(def);
      });

      return newTypes;
    });
  }, []);

  const unregisterNodeTypes = useCallback((typeNames: string[]) => {
    return setNodeTypes((currentNodeTypes) => {
      const updatedNodeTypes = { ...currentNodeTypes };
      typeNames.forEach((typeName) => {
        delete updatedNodeTypes[typeName];
      });
      return updatedNodeTypes;
    });
  }, []);

  return (
    <NodeTypesContext.Provider
      value={{
        nodeTypes,
        registerNodeTypes,
        unregisterNodeTypes
      }}
    >
      {children}
    </NodeTypesContext.Provider>
  );
}
