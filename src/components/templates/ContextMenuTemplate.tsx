import { ContextMenuProps } from "../../types.ts";
import { Node, useReactFlow } from "reactflow";
import { useCallback, useEffect } from "react";

export function ContextMenuTemplate({
  id,
  top,
  left,
  right,
  bottom,
  reset,
  ...props
}: ContextMenuProps) {
  const { getNode, getNodes, addNodes, setNodes, setEdges } = useReactFlow();
  const addNewNode = useCallback(() => {
    let node: Node | undefined;
    if (id) {
      node = getNode(id);
    }

    const newId = getNodes().length + 1;
    const position = node
      ? { x: node.position.x + 50, y: node.position.y + 50 }
      : { x: top + 250, y: left + 250 };

    addNodes({
      position,
      id: String(newId),
      data: { label: `Node ${newId}` },
    });
  }, [id, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));

    reset?.();
  }, [id, setNodes, setEdges]);

  useEffect(() => {
    console.log(id);
  }, [id]);

  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu"
      {...props}
    >
      <div>
        <h4>{id ? `Node: ${id}` : "Action Menu"}</h4>
        <hr />
      </div>

      <button onClick={addNewNode}>Add Node</button>
      {id && <button onClick={deleteNode}>Remove Node</button>}
    </div>
  );
}
