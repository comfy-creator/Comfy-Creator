import { CustomNodeData } from "../types.ts";

interface CustomNodeTemplateProps {
  data: CustomNodeData;
}

export function NodeTemplate({ data }: CustomNodeTemplateProps) {
  return (
    <div>
      <div>{data.label}</div>

      {/* TODO: add handles and content */}
    </div>
  );
}
