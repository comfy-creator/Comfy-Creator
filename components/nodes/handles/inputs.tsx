import { NodeDefinition } from "@/lib/types";
import { Handle, Position } from "@xyflow/react";

interface InputHandleProps {
  node: NodeDefinition;
}

export const InputHandles = ({ node }: InputHandleProps) => {
  return (
    <div className="relative">
      {node.inputs.map((input, index) => (
        <div
          key={input.name}
          className="flex items-center"
          style={{ position: "relative", top: `${index}px` }}
        >
          <div className="text-content-base px-1.5 py-0.5 text-xs absolute flex w-fit items-center font-normal right-[30px] mb-[5px] ">
            <span className=" whitespace-nowrap text-xs">{input.name}</span>
          </div>

          <Handle
            type="target"
            id={input.name}
            position={Position.Left}
            style={{
              left: "-24.5px",
              position: "relative",
              margin: "5px 0",
            }}
            className="w-0.5 h-0.5 border rounded-full"
          />
        </div>
      ))}
    </div>
  );
};
