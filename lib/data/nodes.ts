import { NodeDefinition } from "../types";

const generateImageNode: NodeDefinition = {
  category: "Image",
  type: "GenerateImage",
  name: "Generate Image",
  inputs: [
    {
      type: "text",
      handle: "input",
      name: "positive_prompt",
      label: "Positive Prompt",
    },
    {
      type: "text",
      handle: "input",
      name: "negative_prompt",
      label: "Negative Prompt",
    },
    {
      type: "string",
      name: "model",
      handle: "input",
      label: "Image Model",
    },
    {
      type: "number",
      handle: "input",
      name: "num_images",
      label: "Num Images",
    },
    {
      type: "number",
      handle: "input",
      name: "random_seed",
      label: "Random Seed",
    },
    {
      type: "string",
      handle: "input",
      name: "aspect_ratio",
      label: "Aspect Ratio",
    },
    {
      type: "string",
      handle: "input",
      name: "output_format",
      label: "Output Format",
    },
  ],
  outputs: [
    {
      name: "images",
      label: "Images",
      handle: "output",
      type: "list.image",
    },
  ],
};

const saveImageNode: NodeDefinition = {
  category: "Image",
  type: "SaveImage",
  name: "Save Image",
  inputs: [
    {
      type: "list.image",
      handle: "input",
      name: "images",
      label: "Images",
    },
  ],
  outputs: [
    {
      name: "urls",
      label: "URLs",
      handle: "output",
      type: "list.string",
    },
  ],
};

export const nodeDefinitions: NodeDefinition[] = [
  generateImageNode,
  saveImageNode,
];

export const getCategorizedNodeDefinitions = () => {
  const categorizedNodes: Record<string, NodeDefinition[]> = {};
  nodeDefinitions.forEach((node) => {
    if (!categorizedNodes[node.category]) {
      categorizedNodes[node.category] = [];
    }
    categorizedNodes[node.category].push(node);
  });

  return categorizedNodes;
};
