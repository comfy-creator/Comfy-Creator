export type InputSpec = {
  type: string;
  min?: number;
  max?: number;
  step?: number;
  default?: number;
};

export type NodeData = {
  label: string;
  function: string;
  category: string;
  outputs: string[];
  inputs: {
    required: Record<string, InputSpec>;
    optional?: Record<string, InputSpec>;
  };
};
