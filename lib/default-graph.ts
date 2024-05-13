import { Edge, Node } from 'reactflow';
import { NodeData } from './lib/types.ts';

export const defaultNodes: Node<NodeData>[] = [
  {
    id: '881c17fc-14ea-4c1e-a0a6-6632762060a9',
    type: 'KSampler',
    data: {
      name: 'KSampler',
      inputs: {
        model: {
          name: 'model',
          isHighlighted: false,
          optional: false,
          isConnected: true,
          type: 'MODEL'
        },
        seed: {
          def: {
            type: 'INT',
            defaultValue: 0,
            min: 0,
            max: 18446744073709552000,
            name: 'seed',
            optional: false
          },
          name: 'seed',
          optional: false,
          type: 'INT',
          value: 0,
          linkedInputs: ['control_after_generate'],
          isHighlighted: false
        },
        control_after_generate: {
          name: 'control_after_generate',
          type: 'ENUM',
          serialize: true,
          valueControl: true,
          value: 'randomize',
          def: {
            type: 'ENUM',
            serialize: false,
            valueControl: true,
            defaultValue: 'randomize',
            name: 'control_after_generate',
            options: ['fixed', 'increment', 'decrement', 'randomize']
          },
          isHighlighted: false
        },
        steps: {
          def: {
            type: 'INT',
            defaultValue: 20,
            min: 1,
            max: 10000,
            name: 'steps',
            optional: false
          },
          name: 'steps',
          optional: false,
          type: 'INT',
          value: 20,
          isHighlighted: false
        },
        cfg: {
          def: {
            type: 'FLOAT',
            defaultValue: 8,
            min: 0,
            max: 100,
            step: 0.1,
            round: 0.01,
            name: 'cfg',
            optional: false
          },
          name: 'cfg',
          optional: false,
          type: 'FLOAT',
          value: 8,
          isHighlighted: false
        },
        sampler_name: {
          def: {
            type: 'ENUM',
            multiSelect: false,
            defaultValue: 'euler',
            options: [
              'euler',
              'euler_ancestral',
              'heun',
              'heunpp2',
              'dpm_2',
              'dpm_2_ancestral',
              'lms',
              'dpm_fast',
              'dpm_adaptive',
              'dpmpp_2s_ancestral',
              'dpmpp_sde',
              'dpmpp_sde_gpu',
              'dpmpp_2m',
              'dpmpp_2m_sde',
              'dpmpp_2m_sde_gpu',
              'dpmpp_3m_sde',
              'dpmpp_3m_sde_gpu',
              'ddpm',
              'lcm',
              'ddim',
              'uni_pc',
              'uni_pc_bh2'
            ],
            name: 'sampler_name',
            optional: false
          },
          name: 'sampler_name',
          optional: false,
          type: 'ENUM',
          value: 'euler',
          isHighlighted: false
        },
        scheduler: {
          def: {
            type: 'ENUM',
            multiSelect: false,
            defaultValue: 'normal',
            options: ['normal', 'karras', 'exponential', 'sgm_uniform', 'simple', 'ddim_uniform'],
            name: 'scheduler',
            optional: false
          },
          name: 'scheduler',
          optional: false,
          type: 'ENUM',
          value: 'normal',
          isHighlighted: false
        },
        positive: {
          name: 'positive',
          type: 'CONDITIONING',
          isHighlighted: false,
          optional: false
        },
        negative: {
          name: 'negative',
          type: 'CONDITIONING',
          isHighlighted: false,
          optional: false
        },
        latent_image: {
          name: 'latent_image',
          isHighlighted: false,
          optional: false,
          isConnected: true,
          type: 'LATENT'
        },
        denoise: {
          def: {
            type: 'FLOAT',
            defaultValue: 1,
            min: 0,
            max: 1,
            step: 0.01,
            name: 'denoise',
            optional: false
          },
          name: 'denoise',
          optional: false,
          type: 'FLOAT',
          value: 1,
          isHighlighted: false
        }
      },
      outputs: {
        LATENT: {
          slot: 0,
          name: 'LATENT',
          isHighlighted: false,
          isConnected: true,
          type: 'LATENT'
        }
      }
    },
    position: {
      x: 35.62682663610016,
      y: 234.34947926690558
    },
    style: {
      width: 262,
      height: 321
    },
    width: 262,
    height: 321,
    draggable: true,
    selected: false,
    positionAbsolute: {
      x: 35.62682663610016,
      y: 234.34947926690558
    },
    dragging: false,
    resizing: false
  },
  {
    id: '42ff016d-c4d0-497c-b1c6-8c582d276f0f',
    type: 'CheckpointLoaderSimple',
    data: {
      name: 'Load Checkpoint',
      inputs: {
        ckpt_name: {
          def: {
            type: 'ENUM',
            multiSelect: false,
            defaultValue: 'DreamShaper_8_pruned.safetensors',
            options: ['DreamShaper_8_pruned.safetensors'],
            name: 'ckpt_name',
            optional: false
          },
          name: 'ckpt_name',
          optional: false,
          type: 'ENUM',
          value: 'DreamShaper_8_pruned.safetensors',
          isHighlighted: false
        }
      },
      outputs: {
        MODEL: {
          slot: 0,
          name: 'MODEL',
          isHighlighted: false,
          isConnected: true,
          type: 'MODEL'
        },
        CLIP: {
          slot: 1,
          name: 'CLIP',
          isHighlighted: false,
          isConnected: true,
          type: 'CLIP'
        },
        VAE: {
          slot: 2,
          name: 'VAE',
          isHighlighted: false,
          isConnected: true,
          type: 'VAE'
        }
      }
    },
    position: {
      x: -524.5148450863094,
      y: 343.923553743409
    },
    style: {
      width: '210px'
    },
    width: 210,
    height: 142,
    selected: false,
    positionAbsolute: {
      x: -524.5148450863094,
      y: 343.923553743409
    },
    dragging: false,
    draggable: true
  },
  {
    id: '2bfcd7ba-a780-4118-87af-6faaa86b7b37',
    type: 'CLIPTextEncode',
    data: {
      name: 'CLIP Text Encode (Prompt)',
      inputs: {
        text: {
          def: {
            type: 'STRING',
            multiline: true,
            dynamicPrompts: true,
            name: 'text',
            optional: false
          },
          name: 'text',
          optional: false,
          type: 'STRING',
          isHighlighted: false
        },
        clip: {
          name: 'clip',
          isHighlighted: false,
          optional: false,
          isConnected: true,
          type: 'CLIP'
        }
      },
      outputs: {
        CONDITIONING: {
          slot: 0,
          name: 'CONDITIONING',
          type: 'CONDITIONING',
          isHighlighted: false
        }
      }
    },
    position: {
      x: -254.2870414303351,
      y: 413.6737740842252
    },
    style: {
      width: 258,
      height: 149
    },
    width: 258,
    height: 149,
    selected: false,
    positionAbsolute: {
      x: -254.2870414303351,
      y: 413.6737740842252
    },
    dragging: false,
    draggable: true,
    resizing: false
  },
  {
    id: '05219e03-63a0-45d5-8235-85727c868d58',
    type: 'CLIPTextEncode',
    data: {
      name: 'CLIP Text Encode (Prompt)',
      inputs: {
        text: {
          def: {
            type: 'STRING',
            multiline: true,
            dynamicPrompts: true,
            name: 'text',
            optional: false
          },
          name: 'text',
          optional: false,
          type: 'STRING',
          isHighlighted: false
        },
        clip: {
          name: 'clip',
          isHighlighted: false,
          optional: false,
          isConnected: true,
          type: 'CLIP'
        }
      },
      outputs: {
        CONDITIONING: {
          slot: 0,
          name: 'CONDITIONING',
          type: 'CONDITIONING',
          isHighlighted: false
        }
      }
    },
    position: {
      x: -259.45715181004306,
      y: 235.35963371416824
    },
    style: {
      width: 270,
      height: 154
    },
    width: 270,
    height: 154,
    selected: false,
    positionAbsolute: {
      x: -259.45715181004306,
      y: 235.35963371416824
    },
    dragging: false,
    draggable: true,
    resizing: false
  },
  {
    id: 'b98d2e5e-e069-436a-bbe4-350a820f6133',
    type: 'VAEDecode',
    data: {
      name: 'VAE Decode',
      inputs: {
        samples: {
          name: 'samples',
          isHighlighted: false,
          optional: false,
          isConnected: true,
          type: 'LATENT'
        },
        vae: {
          name: 'vae',
          isHighlighted: false,
          optional: false,
          isConnected: true,
          type: 'VAE'
        }
      },
      outputs: {
        IMAGE: {
          slot: 0,
          name: 'IMAGE',
          isHighlighted: false,
          isConnected: true,
          type: 'IMAGE'
        }
      }
    },
    position: {
      x: 325.55914983513196,
      y: 235.50289226310696
    },
    style: {
      width: '210px'
    },
    width: 210,
    height: 99,
    selected: false,
    positionAbsolute: {
      x: 325.55914983513196,
      y: 235.50289226310696
    },
    dragging: false,
    draggable: true
  },
  {
    id: '4f88cc9b-c3cc-46ff-813f-921c0847a193',
    type: 'SaveImage',
    data: {
      name: 'Save Image',
      inputs: {
        images: {
          name: 'images',
          isHighlighted: false,
          optional: false,
          isConnected: true,
          type: 'IMAGE'
        },
        filename_prefix: {
          def: {
            type: 'STRING',
            defaultValue: 'ComfyUI',
            name: 'filename_prefix',
            optional: false
          },
          name: 'filename_prefix',
          optional: false,
          type: 'STRING',
          value: 'ComfyUI',
          isHighlighted: false
        }
      },
      outputs: {}
    },
    position: {
      x: 582.2598663203869,
      y: 236.25529804940433
    },
    style: {
      width: '210px'
    },
    width: 210,
    height: 131,
    selected: false,
    positionAbsolute: {
      x: 582.2598663203869,
      y: 236.25529804940433
    },
    dragging: false,
    draggable: true
  },
  {
    id: '94efbdb3-fa28-419e-924b-b6842075061f',
    type: 'EmptyLatentImage',
    data: {
      name: 'Empty Latent Image',
      inputs: {
        width: {
          def: {
            type: 'INT',
            defaultValue: 512,
            min: 16,
            max: 16384,
            step: 8,
            name: 'width',
            optional: false
          },
          name: 'width',
          optional: false,
          type: 'INT',
          value: 512,
          isHighlighted: false
        },
        height: {
          def: {
            type: 'INT',
            defaultValue: 512,
            min: 16,
            max: 16384,
            step: 8,
            name: 'height',
            optional: false
          },
          name: 'height',
          optional: false,
          type: 'INT',
          value: 512,
          isHighlighted: false
        },
        batch_size: {
          def: {
            type: 'INT',
            defaultValue: 1,
            min: 1,
            max: 4096,
            name: 'batch_size',
            optional: false
          },
          name: 'batch_size',
          optional: false,
          type: 'INT',
          value: 1,
          isHighlighted: false
        }
      },
      outputs: {
        LATENT: {
          slot: 0,
          name: 'LATENT',
          isHighlighted: false,
          isConnected: true,
          type: 'LATENT'
        }
      }
    },
    position: {
      x: -228.92461921525174,
      y: 586.0829463194012
    },
    style: {
      width: '210px'
    },
    width: 210,
    height: 158,
    selected: false,
    positionAbsolute: {
      x: -228.92461921525174,
      y: 586.0829463194012
    },
    dragging: false
  }
];

export const defaultEdges: Edge[] = [
  {
    source: '42ff016d-c4d0-497c-b1c6-8c582d276f0f',
    sourceHandle: '42ff016d-c4d0-497c-b1c6-8c582d276f0f::output::MODEL',
    target: '881c17fc-14ea-4c1e-a0a6-6632762060a9',
    targetHandle: '881c17fc-14ea-4c1e-a0a6-6632762060a9::input::model',
    type: 'MODEL',
    id: 'reactflow__edge-42ff016d-c4d0-497c-b1c6-8c582d276f0f42ff016d-c4d0-497c-b1c6-8c582d276f0f::output::MODEL-881c17fc-14ea-4c1e-a0a6-6632762060a9881c17fc-14ea-4c1e-a0a6-6632762060a9::input::model'
  },
  {
    source: '42ff016d-c4d0-497c-b1c6-8c582d276f0f',
    sourceHandle: '42ff016d-c4d0-497c-b1c6-8c582d276f0f::output::CLIP',
    target: '05219e03-63a0-45d5-8235-85727c868d58',
    targetHandle: '05219e03-63a0-45d5-8235-85727c868d58::input::clip',
    type: 'CLIP',
    id: 'reactflow__edge-42ff016d-c4d0-497c-b1c6-8c582d276f0f42ff016d-c4d0-497c-b1c6-8c582d276f0f::output::CLIP-05219e03-63a0-45d5-8235-85727c868d5805219e03-63a0-45d5-8235-85727c868d58::input::clip'
  },
  {
    source: '42ff016d-c4d0-497c-b1c6-8c582d276f0f',
    sourceHandle: '42ff016d-c4d0-497c-b1c6-8c582d276f0f::output::VAE',
    target: 'b98d2e5e-e069-436a-bbe4-350a820f6133',
    targetHandle: 'b98d2e5e-e069-436a-bbe4-350a820f6133::input::vae',
    type: 'VAE',
    id: 'reactflow__edge-42ff016d-c4d0-497c-b1c6-8c582d276f0f42ff016d-c4d0-497c-b1c6-8c582d276f0f::output::VAE-b98d2e5e-e069-436a-bbe4-350a820f6133b98d2e5e-e069-436a-bbe4-350a820f6133::input::vae'
  },
  {
    source: '42ff016d-c4d0-497c-b1c6-8c582d276f0f',
    sourceHandle: '42ff016d-c4d0-497c-b1c6-8c582d276f0f::output::CLIP',
    target: '2bfcd7ba-a780-4118-87af-6faaa86b7b37',
    targetHandle: '2bfcd7ba-a780-4118-87af-6faaa86b7b37::input::clip',
    type: 'CLIP',
    id: 'reactflow__edge-42ff016d-c4d0-497c-b1c6-8c582d276f0f42ff016d-c4d0-497c-b1c6-8c582d276f0f::output::CLIP-2bfcd7ba-a780-4118-87af-6faaa86b7b372bfcd7ba-a780-4118-87af-6faaa86b7b37::input::clip'
  },
  {
    source: 'b98d2e5e-e069-436a-bbe4-350a820f6133',
    sourceHandle: 'b98d2e5e-e069-436a-bbe4-350a820f6133::output::IMAGE',
    target: '4f88cc9b-c3cc-46ff-813f-921c0847a193',
    targetHandle: '4f88cc9b-c3cc-46ff-813f-921c0847a193::input::images',
    type: 'IMAGE',
    id: 'reactflow__edge-b98d2e5e-e069-436a-bbe4-350a820f6133b98d2e5e-e069-436a-bbe4-350a820f6133::output::IMAGE-4f88cc9b-c3cc-46ff-813f-921c0847a1934f88cc9b-c3cc-46ff-813f-921c0847a193::input::images'
  },
  {
    source: '881c17fc-14ea-4c1e-a0a6-6632762060a9',
    sourceHandle: '881c17fc-14ea-4c1e-a0a6-6632762060a9::output::LATENT',
    target: 'b98d2e5e-e069-436a-bbe4-350a820f6133',
    targetHandle: 'b98d2e5e-e069-436a-bbe4-350a820f6133::input::samples',
    type: 'LATENT',
    id: 'reactflow__edge-881c17fc-14ea-4c1e-a0a6-6632762060a9881c17fc-14ea-4c1e-a0a6-6632762060a9::output::LATENT-b98d2e5e-e069-436a-bbe4-350a820f6133b98d2e5e-e069-436a-bbe4-350a820f6133::input::samples'
  },
  {
    source: '94efbdb3-fa28-419e-924b-b6842075061f',
    sourceHandle: '94efbdb3-fa28-419e-924b-b6842075061f::output::LATENT',
    target: '881c17fc-14ea-4c1e-a0a6-6632762060a9',
    targetHandle: '881c17fc-14ea-4c1e-a0a6-6632762060a9::input::latent_image',
    type: 'LATENT',
    id: 'reactflow__edge-94efbdb3-fa28-419e-924b-b6842075061f94efbdb3-fa28-419e-924b-b6842075061f::output::LATENT-881c17fc-14ea-4c1e-a0a6-6632762060a9881c17fc-14ea-4c1e-a0a6-6632762060a9::input::latent_image'
  }
];
