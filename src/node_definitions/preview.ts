import { NodeDefinition } from '../types.ts';

export const previewImage: NodeDefinition = {
  category: 'image',
  display_name: 'Preview Image',
  description: 'Preview Image',
  inputs: [
    {
      label: 'image',
      isHandle: false,
      edgeType: 'IMAGE'
    }
  ],
  outputs: [],
  output_node: true
};

export const previewVideo: NodeDefinition = {
  category: 'video',
  display_name: 'Preview Video',
  description: 'Preview Video',
  inputs: [
    {
      label: 'video',
      isHandle: false,
      edgeType: 'VIDEO'
    }
  ],
  outputs: [],
  output_node: true
};
