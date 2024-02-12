import { NodeData } from "../../types.ts";
import { useEffect, useState } from "react";

interface NodeTemplateProps {
  data: NodeData;
}

export function NodeTemplate({ data }: NodeTemplateProps) {
  const [inputs, setInputs] = useState({} as any);

  useEffect(() => {
    const {} = data;
  }, []);

  return (
    <div>
      <div>{data.label}</div>

      {/* TODO: add handles and content */}
    </div>
  );
}
