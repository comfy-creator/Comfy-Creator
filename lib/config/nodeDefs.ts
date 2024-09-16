import { NODE_GROUP_NAME } from '../config/constants';
import { NodeDefinition } from '../types/types';

export const LoadImage: NodeDefinition = {
   category: 'image',
   display_name: 'Load Image',
   description: 'Load Image',
   inputs: {
      ['file']: {
         display_name: 'file',
         edge_type: 'STRING',
         widget: {
            type: 'FILEPICKER',
            multiple: true,
            file_extensions: ['.png', '.jpg', '.jpeg', '.bmp', '.webp', '.avif']
         }
      }
   },
   outputs: {
      ['image']: {
         display_name: 'image',
         edge_type: 'IMAGE'
      }
   }
};

export const SaveImage: NodeDefinition = {
   category: 'image',
   display_name: 'Save Image',
   description: 'Save Image',
   inputs: {
      ['image']: {
         display_name: 'image',
         edge_type: 'IMAGE'
      },
      ['temp?']: {
         display_name: 'temp?',
         edge_type: 'BOOLEAN',
         widget: {
            type: 'TOGGLE',
            checked: true
         }
      }
   },
   outputs: {
      ['url']: {
         display_name: 'url',
         edge_type: 'STRING'
      }
   }
};

export const MaskImage: NodeDefinition = {
   category: 'masking',
   display_name: 'Mask Image',
   description: 'Mask Image',
   inputs: {
      ['image']: {
         display_name: 'image',
         edge_type: 'IMAGE',
         widget: {
            type: 'MASK'
         }
      }
   },
   outputs: {
      ['image']: {
         display_name: 'Masked Image',
         edge_type: 'IMAGE',
         widget: {
            type: 'PREVIEW_MASKED_IMAGE'
         }
      }
   }
};

export const LoadVideo: NodeDefinition = {
   category: 'video',
   display_name: 'Load Video',
   description: 'Load Video',
   inputs: {
      ['file']: {
         display_name: 'file',
         edge_type: 'STRING',
         widget: {
            type: 'FILEPICKER',
            multiple: true,
            file_extensions: ['.mp4', '.webm', '.mov']
         }
      }
   },
   outputs: {
      ['video']: {
         display_name: 'video',
         edge_type: 'VIDEO'
      }
   }
};

export const SaveVideo: NodeDefinition = {
   category: 'video',
   display_name: 'Save Video',
   description: 'Save Video',
   inputs: {
      ['video']: {
         display_name: 'video',
         edge_type: 'VIDEO'
      },
      ['temp?']: {
         display_name: 'temp?',
         edge_type: 'BOOLEAN',
         widget: {
            type: 'TOGGLE',
            checked: true
         }
      }
   },
   outputs: {
      ['url']: {
         display_name: 'url',
         edge_type: 'STRING'
      }
   }
};

export const TextEncoder: NodeDefinition = {
   category: 'text',
   display_name: 'Text Encoder',
   description: 'Encodes text prompt as an embedding',
   inputs: {
      ['text']: {
         display_name: 'text',
         edge_type: 'STRING',
         widget: {
            type: 'TEXT',
            multiline: true
         }
      }
   },
   outputs: {
      ['embedding']: {
         display_name: 'embedding',
         edge_type: 'EMBEDDING'
      }
   }
};

export const FeatureExtractor: NodeDefinition = {
   category: 'feature',
   display_name: 'ControlNet Feature Extractor',
   description: 'Feature Extractor',
   inputs: {
      ['image']: {
         display_name: 'image',
         edge_type: 'IMAGE'
      },
      feature: {
         display_name: 'feature',
         edge_type: 'ENUM',
         widget: {
            type: 'DROPDOWN',
            options: ['open-pose stick figure', 'depth map']
         }
      }
   },
   outputs: {
      ['image']: {
         display_name: 'image',
         edge_type: 'IMAGE'
      }
   }
};

export const IPAdapterEmbedding: NodeDefinition = {
   category: 'feature',
   display_name: 'IP Adapter Embedding',
   description: 'IP Adapter Embedding',
   inputs: {
      ['image']: {
         display_name: 'image',
         edge_type: 'IMAGE'
      }
   },
   outputs: {
      ['embedding']: {
         display_name: 'embedding',
         edge_type: 'EMBEDDING'
      }
   }
};

export const ImageGenerator: NodeDefinition = {
   category: 'image',
   display_name: 'Image Generator',
   description: 'Image Generator',
   inputs: {
      ['postive_embedding']: {
         display_name: 'positive embedding',
         edge_type: 'EMBEDDING'
         // widget: {
         //    type: 'TEXT',
         //    multiline: true
         // }
      },
      ['negative_embedding']: {
         display_name: 'negative embedding',
         edge_type: 'EMBEDDING',
         optional: true
      },
      ['openpose_image']: {
         display_name: 'openpose image',
         edge_type: 'IMAGE',
         optional: true
      },
      ['depth_image']: {
         display_name: 'depth image',
         edge_type: 'IMAGE',
         optional: true
      },
      ['ipadapter_embedding']: {
         display_name: 'ipadapter embedding',
         edge_type: 'EMBEDDING',
         optional: true
      }
   },
   outputs: {
      ['image']: {
         display_name: 'image',
         edge_type: 'IMAGE'
      }
   }
};

export const ImageRegen: NodeDefinition = {
   category: 'image',
   display_name: 'Image Regen',
   description: 'Remakes a portion of a given image',
   inputs: {
      ['image']: {
         display_name: 'image',
         edge_type: 'IMAGE'
      },
      ['mask']: {
         display_name: 'mask',
         edge_type: 'MASK',
         optional: true
      },
      ['prompt']: {
         display_name: 'prompt',
         edge_type: 'EMBEDDING',
         widget: {
            type: 'TEXT',
            multiline: true
         }
      },
      ['strength']: {
         display_name: 'strength',
         edge_type: 'FLOAT',
         widget: {
            type: 'SLIDER',
            value: 0.5,
            min: 0,
            max: 1,
            unit: '%'
         }
      }
   },
   outputs: {
      ['image']: {
         display_name: 'image',
         edge_type: 'IMAGE'
      }
   }
};

export const SelectObject: NodeDefinition = {
   category: 'masking',
   display_name: 'Select Object',
   description: 'Select Object',
   inputs: {
      ['image']: {
         display_name: 'image',
         edge_type: 'IMAGE'
      },
      prompt: {
         display_name: 'prompt',
         edge_type: 'STRING',
         widget: {
            type: 'TEXT',
            multiline: true
         }
      }
   },
   outputs: {
      ['mask']: {
         display_name: 'mask',
         edge_type: 'MASK'
      }
   }
};

export const RemoveBackground: NodeDefinition = {
   category: 'masking',
   display_name: 'Remove Background',
   description: 'Remove Background',
   inputs: {
      ['image']: {
         display_name: 'image',
         edge_type: 'IMAGE'
      }
   },
   outputs: {
      ['image']: {
         display_name: 'foreground',
         edge_type: 'IMAGE'
      },
      ['mask']: {
         display_name: 'foreground mask',
         edge_type: 'MASK'
      }
   }
};

export const IC_Light: NodeDefinition = {
   category: 'image',
   display_name: 'Relight Foreground',
   description: 'Generates a new background and relights the foreground',
   inputs: {
      ['foreground']: {
         display_name: 'foreground layer',
         edge_type: 'IMAGE'
      },
      ['prompt']: {
         display_name: 'prompt',
         edge_type: 'EMBEDDING',
         widget: {
            type: 'TEXT',
            multiline: true
         }
      }
   },
   outputs: {
      ['image']: {
         display_name: 'image',
         edge_type: 'IMAGE'
      }
   }
};

export const PreviewMaskedImage: NodeDefinition = {
   category: 'masking',
   display_name: 'Preview Mask',
   description: 'Preview the masked image and the image with the drawings',
   inputs: {
      ['image']: {
         display_name: 'Masked Image',
         edge_type: 'IMAGE',
         widget: {
            type: 'MASK'
         }
      }
   },
   outputs: {}
};

export const AllNodeDefs = {
   LoadImage,
   SaveImage,
   LoadVideo,
   SaveVideo,
   TextEncoder,
   FeatureExtractor,
   IPAdapterEmbedding,
   ImageGenerator,
   ImageRegen,
   SelectObject,
   RemoveBackground,
   IC_Light,
   MaskImage,
   PreviewMaskedImage
};

function buildInput(type: string, name: string, options: any, optional: boolean) {
   let data;
   if (Array.isArray(type)) {
      data = {
         edge_type: 'ENUM',
         multiSelect: false,
         defaultValue: type[0],
         options: type
      };
   } else {
      data = {
         edge_type: type,
         defaultValue: options?.default,
         ...options
      };
   }

   return { ...data, display_name: name, optional };
}

export function transformNodeDefs(nodeInfo: Record<string, any>) {
   const defs: Record<string, NodeDefinition> = {};

   for (const name in nodeInfo) {
      const node = nodeInfo[name];

      const def: NodeDefinition = {
         inputs: {},
         outputs: {},
         category: node.category,
         description: node.description,
         display_name: node.display_name
      };

      // TO DO: we should change the server's return value for node-definitions such
      // that it conforms to the NodeDefinition type. We do not need to support ComfyUI's
      // old legacy poorly thought-out system.
      for (const name in node.input.required) {
         const [type, options] = node.input.required[
            name as keyof typeof node.input.required
         ] as any;
         const input = buildInput(type, name, options, false);
         def.inputs[input.name] = input;
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
         def.outputs[output.name] = { display_name: output, edge_type: output };
      }

      defs[name] = def;
   }

   return defs;
}

// Old node defs; these concepts might get scrapped

export const Group: NodeDefinition = {
   category: '',
   display_name: NODE_GROUP_NAME,
   description: NODE_GROUP_NAME,
   inputs: {},
   outputs: {}
};

export const CompositeImages: NodeDefinition = {
   category: 'image',
   display_name: 'Composite Images',
   description: 'Composite Images',
   inputs: {
      ['foreground']: {
         display_name: 'foreground',
         edge_type: 'IMAGE'
      },
      ['background']: {
         display_name: 'background',
         edge_type: 'IMAGE'
      }
   },
   outputs: {
      ['image']: {
         display_name: 'image',
         edge_type: 'IMAGE'
      }
   }
};
