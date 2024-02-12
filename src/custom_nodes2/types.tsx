
export type InputSpec = {
    type: string,
    default?: number,
    min?: number,
    max?: number,
    step?: number
}

export type NodeData = {
  label: string,
  inputs: {
    required: Record<string, InputSpec>,
    optional?: Record<string, InputSpec>
  },
  outputs: string[],
  function: string,
  category: string,
}

// const defs = api.getNodeDefs();


