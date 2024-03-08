export const defaultNodes = [
  {
    id: 'f8503d74-b2c1-4970-8ee7-ae64862ccf8a',
    type: 'KSampler',
    position: {
      x: 379.4275766016714,
      y: 221.6573816155989
    },
    data: {
      name: 'KSampler',
      inputs: [
        {
          name: 'model',
          type: 'MODEL',
          optional: false,
          isHighlighted: false
        },
        {
          name: 'positive',
          type: 'CONDITIONING',
          optional: false,
          isHighlighted: false
        },
        {
          name: 'negative',
          type: 'CONDITIONING',
          optional: false,
          isHighlighted: false
        },
        {
          name: 'latent_image',
          type: 'LATENT',
          optional: false,
          isHighlighted: false
        }
      ],
      outputs: [
        {
          name: 'LATENT',
          type: 'LATENT',
          isHighlighted: false
        }
      ],
      widgets: {
        seed: {
          name: 'seed',
          optional: false,
          type: 'INT',
          value: 0
        },
        steps: {
          name: 'steps',
          optional: false,
          type: 'INT',
          value: 20
        },
        cfg: {
          name: 'cfg',
          optional: false,
          type: 'FLOAT',
          value: 8
        },
        sampler_name: {
          name: 'sampler_name',
          optional: false,
          type: 'ENUM',
          value: 'euler'
        },
        scheduler: {
          name: 'scheduler',
          optional: false,
          type: 'ENUM',
          value: 'normal'
        },
        denoise: {
          name: 'denoise',
          optional: false,
          type: 'FLOAT',
          value: 1
        }
      }
    },
    width: 152,
    height: 209,
    selected: false,
    positionAbsolute: {
      x: 379.4275766016714,
      y: 221.6573816155989
    },
    dragging: false
  },
  {
    id: '6e068e95-86af-4d77-9846-c6e204a10c67',
    type: 'CheckpointLoaderSimple',
    position: {
      x: -177.50974930362116,
      y: 222.98885793871867
    },
    data: {
      name: 'Load Checkpoint',
      inputs: [],
      outputs: [
        {
          name: 'MODEL',
          type: 'MODEL',
          isHighlighted: false
        },
        {
          name: 'CLIP',
          type: 'CLIP',
          isHighlighted: false
        },
        {
          name: 'VAE',
          type: 'VAE',
          isHighlighted: false
        }
      ],
      widgets: {
        ckpt_name: {
          name: 'ckpt_name',
          optional: false,
          type: 'ENUM',
          value: 'meinamix_meina_v11.safetensors'
        }
      }
    },
    width: 268,
    height: 109,
    selected: false,
    positionAbsolute: {
      x: -177.50974930362116,
      y: 222.98885793871867
    },
    dragging: false
  },
  {
    id: 'f4977578-c8c1-48f1-a63d-cd8bb2d69d08',
    type: 'CLIPTextEncode',
    position: {
      x: 143.02367688022284,
      y: 260.03621169916437
    },
    data: {
      name: 'CLIP Text Encode (Prompt)',
      inputs: [
        {
          name: 'clip',
          type: 'CLIP',
          optional: false,
          isHighlighted: false
        }
      ],
      outputs: [
        {
          name: 'CONDITIONING',
          type: 'CONDITIONING',
          isHighlighted: false
        }
      ],
      widgets: {
        text: {
          name: 'text',
          optional: false,
          type: 'STRING'
        }
      }
    },
    width: 183,
    height: 108,
    selected: false,
    positionAbsolute: {
      x: 143.02367688022284,
      y: 260.03621169916437
    },
    dragging: false
  },
  {
    id: '99a9bcd1-b8bf-4505-b013-e6797e6d3b7a',
    type: 'CLIPTextEncode',
    position: {
      x: 142.47910863509748,
      y: 120.15320334261838
    },
    data: {
      name: 'CLIP Text Encode (Prompt)',
      inputs: [
        {
          name: 'clip',
          type: 'CLIP',
          optional: false,
          isHighlighted: false
        }
      ],
      outputs: [
        {
          name: 'CONDITIONING',
          type: 'CONDITIONING',
          isHighlighted: false
        }
      ],
      widgets: {
        text: {
          name: 'text',
          optional: false,
          type: 'STRING'
        }
      }
    },
    width: 183,
    height: 108,
    selected: false,
    positionAbsolute: {
      x: 142.47910863509748,
      y: 120.15320334261838
    },
    dragging: false
  },
  {
    id: '69e82279-b806-4d09-ae24-a608faec978c',
    type: 'EmptyLatentImage',
    position: {
      x: 158.066852367688,
      y: 387.1782729805014
    },
    data: {
      name: 'Empty Latent Image',
      inputs: [],
      outputs: [
        {
          name: 'LATENT',
          type: 'LATENT',
          isHighlighted: false
        }
      ],
      widgets: {
        width: {
          name: 'width',
          optional: false,
          type: 'INT',
          value: 512
        },
        height: {
          name: 'height',
          optional: false,
          type: 'INT',
          value: 512
        },
        batch_size: {
          name: 'batch_size',
          optional: false,
          type: 'INT',
          value: 1
        }
      }
    },
    width: 145,
    height: 111,
    selected: false,
    positionAbsolute: {
      x: 158.066852367688,
      y: 387.1782729805014
    },
    dragging: false
  },
  {
    id: 'ef9bd0b8-1078-4459-913d-9272e2385bc4',
    type: 'VAEDecode',
    position: {
      x: 585.8395220289808,
      y: 192.64641397917882
    },
    data: {
      name: 'VAE Decode',
      inputs: [
        {
          name: 'samples',
          type: 'LATENT',
          optional: false,
          isHighlighted: false
        },
        {
          name: 'vae',
          type: 'VAE',
          optional: false,
          isHighlighted: false
        }
      ],
      outputs: [
        {
          name: 'IMAGE',
          type: 'IMAGE',
          isHighlighted: false
        }
      ],
      widgets: {}
    },
    width: 105,
    height: 69,
    selected: false,
    positionAbsolute: {
      x: 585.8395220289808,
      y: 192.64641397917882
    },
    dragging: false
  },
  {
    id: '9f5fc182-f311-4796-846e-5e0f0e3477ec',
    type: 'SaveImage',
    position: {
      x: 735,
      y: 191
    },
    data: {
      name: 'Save Image',
      config: {},
      inputs: [
        {
          name: 'images',
          type: 'IMAGE',
          isHighlighted: false,
          optional: false
        }
      ],
      outputs: [],
      widgets: {
        filename_prefix: {
          name: 'filename_prefix',
          optional: false,
          type: 'STRING',
          value: 'ComfyUI'
        }
      }
    },
    width: 101,
    height: 66,
    selected: false,
    positionAbsolute: {
      x: 735,
      y: 191
    },
    dragging: false
  }
];

export const defaultEdges = [
  {
    source: '6e068e95-86af-4d77-9846-c6e204a10c67',
    sourceHandle: 'output::1::CLIP',
    target: '99a9bcd1-b8bf-4505-b013-e6797e6d3b7a',
    targetHandle: 'input::0::CLIP',
    type: 'CLIP',
    id: 'reactflow__edge-6e068e95-86af-4d77-9846-c6e204a10c67output::1::CLIP-99a9bcd1-b8bf-4505-b013-e6797e6d3b7ainput::0::CLIP'
  },
  {
    source: '6e068e95-86af-4d77-9846-c6e204a10c67',
    sourceHandle: 'output::1::CLIP',
    target: 'f4977578-c8c1-48f1-a63d-cd8bb2d69d08',
    targetHandle: 'input::0::CLIP',
    type: 'CLIP',
    id: 'reactflow__edge-6e068e95-86af-4d77-9846-c6e204a10c67output::1::CLIP-f4977578-c8c1-48f1-a63d-cd8bb2d69d08input::0::CLIP'
  },
  {
    source: '99a9bcd1-b8bf-4505-b013-e6797e6d3b7a',
    sourceHandle: 'output::0::CONDITIONING',
    target: 'f8503d74-b2c1-4970-8ee7-ae64862ccf8a',
    targetHandle: 'input::1::CONDITIONING',
    type: 'CONDITIONING',
    id: 'reactflow__edge-99a9bcd1-b8bf-4505-b013-e6797e6d3b7aoutput::0::CONDITIONING-f8503d74-b2c1-4970-8ee7-ae64862ccf8ainput::1::CONDITIONING'
  },
  {
    source: 'f4977578-c8c1-48f1-a63d-cd8bb2d69d08',
    sourceHandle: 'output::0::CONDITIONING',
    target: 'f8503d74-b2c1-4970-8ee7-ae64862ccf8a',
    targetHandle: 'input::2::CONDITIONING',
    type: 'CONDITIONING',
    id: 'reactflow__edge-f4977578-c8c1-48f1-a63d-cd8bb2d69d08output::0::CONDITIONING-f8503d74-b2c1-4970-8ee7-ae64862ccf8ainput::2::CONDITIONING'
  },
  {
    source: '6e068e95-86af-4d77-9846-c6e204a10c67',
    sourceHandle: 'output::0::MODEL',
    target: 'f8503d74-b2c1-4970-8ee7-ae64862ccf8a',
    targetHandle: 'input::0::MODEL',
    type: 'MODEL',
    id: 'reactflow__edge-6e068e95-86af-4d77-9846-c6e204a10c67output::0::MODEL-f8503d74-b2c1-4970-8ee7-ae64862ccf8ainput::0::MODEL'
  },
  {
    source: '69e82279-b806-4d09-ae24-a608faec978c',
    sourceHandle: 'output::0::LATENT',
    target: 'f8503d74-b2c1-4970-8ee7-ae64862ccf8a',
    targetHandle: 'input::3::LATENT',
    type: 'LATENT',
    id: 'reactflow__edge-69e82279-b806-4d09-ae24-a608faec978coutput::0::LATENT-f8503d74-b2c1-4970-8ee7-ae64862ccf8ainput::3::LATENT'
  },
  {
    source: '6e068e95-86af-4d77-9846-c6e204a10c67',
    sourceHandle: 'output::2::VAE',
    target: 'ef9bd0b8-1078-4459-913d-9272e2385bc4',
    targetHandle: 'input::1::VAE',
    type: 'VAE',
    id: 'reactflow__edge-6e068e95-86af-4d77-9846-c6e204a10c67output::2::VAE-ef9bd0b8-1078-4459-913d-9272e2385bc4input::1::VAE'
  },
  {
    source: 'f8503d74-b2c1-4970-8ee7-ae64862ccf8a',
    sourceHandle: 'output::0::LATENT',
    target: 'ef9bd0b8-1078-4459-913d-9272e2385bc4',
    targetHandle: 'input::0::LATENT',
    type: 'LATENT',
    id: 'reactflow__edge-f8503d74-b2c1-4970-8ee7-ae64862ccf8aoutput::0::LATENT-ef9bd0b8-1078-4459-913d-9272e2385bc4input::0::LATENT'
  },
  {
    source: 'ef9bd0b8-1078-4459-913d-9272e2385bc4',
    sourceHandle: 'output::0::IMAGE',
    target: '9f5fc182-f311-4796-846e-5e0f0e3477ec',
    targetHandle: 'input::0::IMAGE',
    type: 'IMAGE',
    id: 'reactflow__edge-ef9bd0b8-1078-4459-913d-9272e2385bc4output::0::IMAGE-9f5fc182-f311-4796-846e-5e0f0e3477ecinput::0::IMAGE'
  }
];
