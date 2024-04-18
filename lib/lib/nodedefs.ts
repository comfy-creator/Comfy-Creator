import { NodeDefinition } from './types.ts';

export const PreviewImage: NodeDefinition = {
  category: 'image',
  display_name: 'Preview Image',
  description: 'Preview Image',
  inputs: [
    {
      name: 'image',
      type: 'IMAGE'
    }
  ],
  outputs: [],
  output_node: true
};

export const PreviewVideo: NodeDefinition = {
  category: 'video',
  display_name: 'Preview Video',
  description: 'Preview Video',
  inputs: [
    {
      name: 'video',
      type: 'VIDEO'
    }
  ],
  outputs: [],
  output_node: true
};

export const PrimitiveNode: NodeDefinition = {
  inputs: [],
  category: 'utils',
  output_node: true,
  display_name: 'Primitive',
  description: 'Primitive Node',
  outputs: [{ type: '*', name: 'connect widget to input' }]
};

export const RerouteNode: NodeDefinition = {
  category: 'utils',
  output_node: true,
  display_name: 'Reroute',
  description: 'Reroute Node',
  inputs: [{ type: '*', name: '' }],
  outputs: [{ type: '*', name: '' }]
};

function buildInput(type: string, name: string, options: any, optional: boolean) {
  let data;
  if (Array.isArray(type)) {
    data = {
      type: 'ENUM',
      multiSelect: false,
      defaultValue: type[0],
      options: type
    };
  } else {
    data = {
      type,
      defaultValue: options?.default,
      ...options
    };
  }

  return { ...data, name, optional };
}

export function transformNodeDefs(nodeInfo: Record<string, any>) {
  const defs: Record<string, NodeDefinition> = {};

  for (const name in nodeInfo) {
    const node = nodeInfo[name];

    const def: NodeDefinition = {
      inputs: [],
      outputs: [],
      category: node.category,
      description: node.description,
      output_node: node.output_node,
      display_name: node.display_name
    };

    // TO DO: we should change the server's return value for node-definitions such
    // that it conforms to the NodeDefinition type. We do not need to support ComfyUI's
    // old legacy poorly thought-out system.
    for (const name in node.input.required) {
      const [type, options] = node.input.required[name as keyof typeof node.input.required] as any;
      const input = buildInput(type, name, options, false);
      def.inputs.push(input);
    }

    // for (const name in node.input.optional) {
    //   const [type, options] = node.input.optional[
    //     name as keyof typeof node.input.optional
    //   ] as any;

    //   const input = buildInput(type, name, options, true);
    //   def.inputs.push(input);
    // }

    for (const name in node.output) {
      const output = node.output[name as keyof typeof node.output] as any;
      def.outputs.push({ name: output, type: output });
    }

    defs[name] = def;
  }

  return defs;
}
