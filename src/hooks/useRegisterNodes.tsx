import { NodeData } from "../types";
import { NodeTemplate } from "../components/template/NodeTemplate";
import { useNodeTypes } from "../contexts/NodeTypes";

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

  return { registerNodesFromDefs, registerNode };
}
