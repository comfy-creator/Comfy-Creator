export const defaultNodes = [
  {
    "id": "f8503d74-b2c1-4970-8ee7-ae64862ccf8a",
    "type": "KSampler",
    "position": {
      "x": 361.4275766016714,
      "y": 193.6573816155989
    },
    "data": {
      "name": "KSampler",
      "inputs": [
        {
          "name": "model",
          "type": "MODEL",
          "optional": false,
          "isHighlighted": false
        },
        {
          "name": "positive",
          "type": "CONDITIONING",
          "optional": false,
          "isHighlighted": false
        },
        {
          "name": "negative",
          "type": "CONDITIONING",
          "optional": false,
          "isHighlighted": false
        },
        {
          "name": "latent_image",
          "type": "LATENT",
          "optional": false,
          "isHighlighted": false
        }
      ],
      "outputs": [
        {
          "name": "LATENT",
          "type": "LATENT",
          "isHighlighted": false
        }
      ],
      "widgets": {
        "seed": {
          "name": "seed",
          "optional": false,
          "type": "INT",
          "value": 0
        },
        "steps": {
          "name": "steps",
          "optional": false,
          "type": "INT",
          "value": 20
        },
        "cfg": {
          "name": "cfg",
          "optional": false,
          "type": "FLOAT",
          "value": 8
        },
        "sampler_name": {
          "name": "sampler_name",
          "optional": false,
          "type": "ENUM",
          "value": "euler"
        },
        "scheduler": {
          "name": "scheduler",
          "optional": false,
          "type": "ENUM",
          "value": "normal"
        },
        "denoise": {
          "name": "denoise",
          "optional": false,
          "type": "FLOAT",
          "value": 1
        }
      }
    },
    "width": 100,
    "height": 163,
    "selected": false,
    "positionAbsolute": {
      "x": 361.4275766016714,
      "y": 193.6573816155989
    },
    "dragging": false
  },
  {
    "id": "6e068e95-86af-4d77-9846-c6e204a10c67",
    "type": "CheckpointLoaderSimple",
    "position": {
      "x": -50.509749303621156,
      "y": 238.98885793871867
    },
    "data": {
      "name": "Load Checkpoint",
      "inputs": [],
      "outputs": [
        {
          "name": "MODEL",
          "type": "MODEL",
          "isHighlighted": false
        },
        {
          "name": "CLIP",
          "type": "CLIP",
          "isHighlighted": false
        },
        {
          "name": "VAE",
          "type": "VAE",
          "isHighlighted": false
        }
      ],
      "widgets": {
        "ckpt_name": {
          "name": "ckpt_name",
          "optional": false,
          "type": "ENUM",
          "value": "meinamix_meina_v11.safetensors"
        }
      }
    },
    "width": 175,
    "height": 84,
    "selected": false,
    "positionAbsolute": {
      "x": -50.509749303621156,
      "y": 238.98885793871867
    },
    "dragging": false
  },
  {
    "id": "f4977578-c8c1-48f1-a63d-cd8bb2d69d08",
    "type": "CLIPTextEncode",
    "position": {
      "x": 148.02367688022284,
      "y": 239.03621169916434
    },
    "data": {
      "name": "CLIP Text Encode (Prompt)",
      "inputs": [
        {
          "name": "clip",
          "type": "CLIP",
          "optional": false,
          "isHighlighted": false
        }
      ],
      "outputs": [
        {
          "name": "CONDITIONING",
          "type": "CONDITIONING",
          "isHighlighted": false
        }
      ],
      "widgets": {
        "text": {
          "name": "text",
          "optional": false,
          "type": "STRING"
        }
      }
    },
    "width": 149,
    "height": 97,
    "selected": false,
    "positionAbsolute": {
      "x": 148.02367688022284,
      "y": 239.03621169916434
    },
    "dragging": false
  },
  {
    "id": "99a9bcd1-b8bf-4505-b013-e6797e6d3b7a",
    "type": "CLIPTextEncode",
    "position": {
      "x": 147.47910863509748,
      "y": 138.15320334261838
    },
    "data": {
      "name": "CLIP Text Encode (Prompt)",
      "inputs": [
        {
          "name": "clip",
          "type": "CLIP",
          "optional": false,
          "isHighlighted": false
        }
      ],
      "outputs": [
        {
          "name": "CONDITIONING",
          "type": "CONDITIONING",
          "isHighlighted": false
        }
      ],
      "widgets": {
        "text": {
          "name": "text",
          "optional": false,
          "type": "STRING"
        }
      }
    },
    "width": 149,
    "height": 97,
    "selected": false,
    "positionAbsolute": {
      "x": 147.47910863509748,
      "y": 138.15320334261838
    },
    "dragging": false
  },
  {
    "id": "69e82279-b806-4d09-ae24-a608faec978c",
    "type": "EmptyLatentImage",
    "position": {
      "x": 156.066852367688,
      "y": 349.1782729805014
    },
    "data": {
      "name": "Empty Latent Image",
      "inputs": [],
      "outputs": [
        {
          "name": "LATENT",
          "type": "LATENT",
          "isHighlighted": false
        }
      ],
      "widgets": {
        "width": {
          "name": "width",
          "optional": false,
          "type": "INT",
          "value": 512
        },
        "height": {
          "name": "height",
          "optional": false,
          "type": "INT",
          "value": 512
        },
        "batch_size": {
          "name": "batch_size",
          "optional": false,
          "type": "INT",
          "value": 1
        }
      }
    },
    "width": 91,
    "height": 88,
    "selected": false,
    "positionAbsolute": {
      "x": 156.066852367688,
      "y": 349.1782729805014
    },
    "dragging": false
  },
  {
    "id": "ef9bd0b8-1078-4459-913d-9272e2385bc4",
    "type": "VAEDecode",
    "position": {
      "x": 518.8395220289808,
      "y": 180.64641397917882
    },
    "data": {
      "name": "VAE Decode",
      "inputs": [
        {
          "name": "samples",
          "type": "LATENT",
          "optional": false,
          "isHighlighted": false
        },
        {
          "name": "vae",
          "type": "VAE",
          "optional": false,
          "isHighlighted": false
        }
      ],
      "outputs": [
        {
          "name": "IMAGE",
          "type": "IMAGE",
          "isHighlighted": false
        }
      ],
      "widgets": {}
    },
    "width": 71,
    "height": 54,
    "selected": false,
    "positionAbsolute": {
      "x": 518.8395220289808,
      "y": 180.64641397917882
    },
    "dragging": false
  },
  {
    "id": "ff7da4d0-4154-4f59-8a5a-7befe248121d",
    "type": "SaveImage",
    "position": {
      "x": 495.08978149326373,
      "y": 77.17426308157641
    },
    "data": {
      "name": "Save Image",
      "inputs": [],
      "outputs": [],
      "widgets": {
        "images": {
          "name": "images",
          "optional": false,
          "type": "IMAGE"
        },
        "filename_prefix": {
          "name": "filename_prefix",
          "optional": false,
          "type": "STRING",
          "value": "ComfyUI"
        }
      }
    },
    "width": 84,
    "height": 47,
    "selected": true,
    "positionAbsolute": {
      "x": 495.08978149326373,
      "y": 77.17426308157641
    },
    "dragging": true
  }
];

export const defaultEdges = [
  {
    "source": "6e068e95-86af-4d77-9846-c6e204a10c67",
    "sourceHandle": "output-1-CLIP",
    "target": "99a9bcd1-b8bf-4505-b013-e6797e6d3b7a",
    "targetHandle": "input-0-CLIP",
    "type": "CLIP",
    "id": "reactflow__edge-6e068e95-86af-4d77-9846-c6e204a10c67output-1-CLIP-99a9bcd1-b8bf-4505-b013-e6797e6d3b7ainput-0-CLIP"
  },
  {
    "source": "6e068e95-86af-4d77-9846-c6e204a10c67",
    "sourceHandle": "output-1-CLIP",
    "target": "f4977578-c8c1-48f1-a63d-cd8bb2d69d08",
    "targetHandle": "input-0-CLIP",
    "type": "CLIP",
    "id": "reactflow__edge-6e068e95-86af-4d77-9846-c6e204a10c67output-1-CLIP-f4977578-c8c1-48f1-a63d-cd8bb2d69d08input-0-CLIP"
  },
  {
    "source": "99a9bcd1-b8bf-4505-b013-e6797e6d3b7a",
    "sourceHandle": "output-0-CONDITIONING",
    "target": "f8503d74-b2c1-4970-8ee7-ae64862ccf8a",
    "targetHandle": "input-1-CONDITIONING",
    "type": "CONDITIONING",
    "id": "reactflow__edge-99a9bcd1-b8bf-4505-b013-e6797e6d3b7aoutput-0-CONDITIONING-f8503d74-b2c1-4970-8ee7-ae64862ccf8ainput-1-CONDITIONING"
  },
  {
    "source": "f4977578-c8c1-48f1-a63d-cd8bb2d69d08",
    "sourceHandle": "output-0-CONDITIONING",
    "target": "f8503d74-b2c1-4970-8ee7-ae64862ccf8a",
    "targetHandle": "input-2-CONDITIONING",
    "type": "CONDITIONING",
    "id": "reactflow__edge-f4977578-c8c1-48f1-a63d-cd8bb2d69d08output-0-CONDITIONING-f8503d74-b2c1-4970-8ee7-ae64862ccf8ainput-2-CONDITIONING"
  },
  {
    "source": "6e068e95-86af-4d77-9846-c6e204a10c67",
    "sourceHandle": "output-0-MODEL",
    "target": "f8503d74-b2c1-4970-8ee7-ae64862ccf8a",
    "targetHandle": "input-0-MODEL",
    "type": "MODEL",
    "id": "reactflow__edge-6e068e95-86af-4d77-9846-c6e204a10c67output-0-MODEL-f8503d74-b2c1-4970-8ee7-ae64862ccf8ainput-0-MODEL"
  },
  {
    "source": "69e82279-b806-4d09-ae24-a608faec978c",
    "sourceHandle": "output-0-LATENT",
    "target": "f8503d74-b2c1-4970-8ee7-ae64862ccf8a",
    "targetHandle": "input-3-LATENT",
    "type": "LATENT",
    "id": "reactflow__edge-69e82279-b806-4d09-ae24-a608faec978coutput-0-LATENT-f8503d74-b2c1-4970-8ee7-ae64862ccf8ainput-3-LATENT"
  },
  {
    "source": "6e068e95-86af-4d77-9846-c6e204a10c67",
    "sourceHandle": "output-2-VAE",
    "target": "ef9bd0b8-1078-4459-913d-9272e2385bc4",
    "targetHandle": "input-1-VAE",
    "type": "VAE",
    "id": "reactflow__edge-6e068e95-86af-4d77-9846-c6e204a10c67output-2-VAE-ef9bd0b8-1078-4459-913d-9272e2385bc4input-1-VAE"
  },
  {
    "source": "f8503d74-b2c1-4970-8ee7-ae64862ccf8a",
    "sourceHandle": "output-0-LATENT",
    "target": "ef9bd0b8-1078-4459-913d-9272e2385bc4",
    "targetHandle": "input-0-LATENT",
    "type": "LATENT",
    "id": "reactflow__edge-f8503d74-b2c1-4970-8ee7-ae64862ccf8aoutput-0-LATENT-ef9bd0b8-1078-4459-913d-9272e2385bc4input-0-LATENT"
  }
];