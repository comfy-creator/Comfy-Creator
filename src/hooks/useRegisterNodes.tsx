import { NodeData } from "../types.ts";
import { NodeTemplate } from "../components/templates/NodeTemplate.tsx";
import { useNodeTypes } from "../contexts/NodeTypes.tsx";

export function useRegisterNodes() {
  const { registerNodeType } = useNodeTypes();

  const registerNodesFromDefs = (defs: Record<string, NodeData>) => {
    for (const [key, value] of Object.entries(defs)) {
      registerNode(key, value);
    }
  };

  const registerNode = (nodeId: string, nodeData: NodeData) => {
    registerNodeType(nodeId, () => <NodeTemplate data={nodeData} />);
  };
}
