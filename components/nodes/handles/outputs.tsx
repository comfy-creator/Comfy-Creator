import { NodeDefinition } from "@/lib/types";
import { Handle, Position } from "@xyflow/react";

interface InputHandleProps {
  node: NodeDefinition;
}

export const OutputHandles = ({ node }: InputHandleProps) => {
  return (
    <div className="relative">
      {node.outputs.map((output, index) => (
        <div
          key={output.name}
          className="flex items-center justify-end"
          style={{ position: "relative", top: `${index}px` }}
        >
          <div className="text-content-base px-1.5 py-0.5 text-xs absolute bottom-[0.5px]  mr-6 flex w-fit items-center bg-surface-300/60 font-normal left-[22rem]  ml-6 top-[8px] mb-5 ">
            <span className="pointer-events-none cursor-default whitespace-nowrap text-xs">
              {output.name}
            </span>
          </div>

          <Handle
            type="source"
            position={Position.Right}
            id={output.name}
            className="w-0.5 h-0.5 border rounded-full"
            style={{
              right: "-23.1rem",
              position: "relative",
              margin: "10px 0",
            }}
          />
        </div>
      ))}
    </div>
  );
};
