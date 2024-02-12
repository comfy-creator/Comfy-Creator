import { NodeData } from "../../types.ts";

interface NodeTemplateProps {
  data: NodeData;
}

export function NodeTemplate({ data }: NodeTemplateProps) {
  return (
    <div>
      <div>{data.label}</div>

      {/* TODO: add handles and content */}
    </div>
  );
}
