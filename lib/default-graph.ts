import { Edge, Node } from '@xyflow/react';
import { NodeData } from './types/types';

export const defaultNodes: Node<NodeData>[] = [
   {
      id: 'fdb94825-2194-4138-b140-2205a9d0e09a',
      type: 'TextEncoder',
      data: {
         display_name: 'Text Encoder',
         inputs: {
            text: {
               display_name: 'text',
               isHighlighted: false,
               value: 'A man pointing to the star',
               edge_type: 'STRING'
            }
         },
         outputs: {
            embedding: {
               display_name: 'embedding',
               isHighlighted: false,
               isConnected: true,
               edge_type: 'EMBEDDING'
            }
         },
         widgets: {}
      },
      position: {
         x: 293.0770406823647,
         y: 40.36994153512207
      },
      style: {
         width: '210px'
      },
      measured: {
         width: 210,
         height: 189
      },
      selected: false,
      dragging: false,
      draggable: true
   },
   {
      id: 'aa20e179-a127-4639-9c05-eac9854df742',
      type: 'FeatureExtractor',
      data: {
         display_name: 'ControlNet Feature Extractor',
         inputs: {
            image: {
               display_name: 'image',
               isHighlighted: false,
               isConnected: true,
               edge_type: 'IMAGE'
            },
            feature: {
               edge_type: 'ENUM',
               display_name: 'feature',
               isHighlighted: false
            }
         },
         outputs: {
            image: {
               display_name: 'image',
               isHighlighted: false,
               isConnected: true,
               edge_type: 'IMAGE'
            }
         },
         widgets: {}
      },
      position: {
         x: 285.8814919715317,
         y: 420.1347977212558
      },
      style: {
         width: '210px'
      },
      measured: {
         width: 210,
         height: 129
      },
      selected: false,
      dragging: false,
      draggable: true
   },
   {
      id: '3b6d6b50-d188-4ab8-a6d2-e99b9ac6514f',
      type: 'FeatureExtractor',
      data: {
         display_name: 'ControlNet Feature Extractor',
         inputs: {
            image: {
               display_name: 'image',
               isHighlighted: false,
               isConnected: true,
               edge_type: 'IMAGE'
            },
            feature: {
               edge_type: 'ENUM',
               display_name: 'feature',
               isHighlighted: false
            }
         },
         outputs: {
            image: {
               display_name: 'image',
               isHighlighted: false,
               isConnected: true,
               edge_type: 'IMAGE'
            }
         },
         widgets: {}
      },
      position: {
         x: 284.6761325855719,
         y: 254.3842926942133
      },
      style: {
         width: '210px'
      },
      measured: {
         width: 210,
         height: 129
      },
      selected: false,
      dragging: false,
      draggable: true
   },
   {
      id: '56c9156a-5031-4fd2-9559-5224b1a4bdd0',
      type: 'IPAdapterEmbedding',
      data: {
         display_name: 'IP Adapter Embedding',
         inputs: {
            image: {
               display_name: 'image',
               isHighlighted: false,
               isConnected: true,
               edge_type: 'IMAGE'
            }
         },
         outputs: {
            embedding: {
               display_name: 'embedding',
               isHighlighted: false,
               isConnected: true,
               edge_type: 'EMBEDDING'
            }
         },
         widgets: {}
      },
      position: {
         x: 289.1404521108781,
         y: 591.5358718992343
      },
      style: {
         width: '210px'
      },
      measured: {
         width: 210,
         height: 79
      },
      selected: false,
      dragging: false,
      draggable: true
   },
   {
      id: 'efa17bc2-1466-4708-8882-f604847ba8bd',
      type: 'SaveImage',
      data: {
         display_name: 'Save Image',
         inputs: {
            image: {
               display_name: 'image',
               isHighlighted: false,
               isConnected: true,
               edge_type: 'IMAGE'
            },
            'temp?': {
               value: true,
               display_name: 'temp?',
               isHighlighted: false,
               edge_type: 'BOOLEAN'
            }
         },
         outputs: {
            url: {
               display_name: 'url',
               edge_type: 'STRING',
               isHighlighted: false
            }
         },
         widgets: {}
      },
      position: {
         x: 915.0594140969258,
         y: 167.3873880183191
      },
      style: {
         width: '210px'
      },
      measured: {
         width: 210,
         height: 129
      },
      selected: false,
      dragging: false,
      draggable: true
   },
   {
      id: '952243ea-3338-4cbd-81a8-fd59a971b05c',
      type: 'ImageGenerator',
      data: {
         display_name: 'Image Generator',
         inputs: {
            'positive embedding': {
               display_name: 'positive embedding',
               edge_type: 'EMBEDDING',
               isHighlighted: false
            },
            'negative embedding': {
               display_name: 'negative embedding',
               isHighlighted: false,
               optional: true,
               isConnected: true,
               edge_type: 'EMBEDDING'
            },
            'openpose image': {
               display_name: 'openpose image',
               isHighlighted: false,
               optional: true,
               isConnected: true,
               edge_type: 'IMAGE'
            },
            'depth image': {
               display_name: 'depth image',
               isHighlighted: false,
               optional: true,
               isConnected: true,
               edge_type: 'IMAGE'
            },
            'ipadapter embedding': {
               display_name: 'ipadapter embedding',
               isHighlighted: false,
               optional: true,
               isConnected: true,
               edge_type: 'EMBEDDING'
            }
         },
         outputs: {
            image: {
               display_name: 'image',
               isHighlighted: false,
               isConnected: true,
               edge_type: 'IMAGE'
            }
         },
         widgets: {}
      },
      position: {
         x: 616.6685087744897,
         y: 244.69700699645443
      },
      style: {
         width: '210px'
      },
      measured: {
         width: 210,
         height: 149
      },
      selected: false,
      dragging: false,
      draggable: true
   },
   {
      id: '3ba5c632-0c1e-440a-a3db-e54631d93c0f',
      type: 'LoadImage',
      data: {
         display_name: 'Load Image',
         inputs: {
            file: {
               value: [],
               display_name: 'file',
               edge_type: 'STRING',
               isHighlighted: false
            }
         },
         outputs: {
            image: {
               display_name: 'image',
               isHighlighted: false,
               isConnected: true,
               edge_type: 'IMAGE'
            }
         },
         widgets: {}
      },
      position: {
         x: -186.6171018907885,
         y: 299.90737473766
      },
      style: {
         width: '210px'
      },
      measured: {
         width: 282,
         height: 166
      },
      selected: false,
      dragging: false,
      width: 282,
      height: 166,
      resizing: false,
      draggable: true
   }
];

export const defaultEdges: Edge[] = [
   {
      source: '3b6d6b50-d188-4ab8-a6d2-e99b9ac6514f',
      sourceHandle: '3b6d6b50-d188-4ab8-a6d2-e99b9ac6514f::image',
      target: '952243ea-3338-4cbd-81a8-fd59a971b05c',
      targetHandle: '952243ea-3338-4cbd-81a8-fd59a971b05c::openpose image',
      type: 'IMAGE',
      id: 'xy-edge__3b6d6b50-d188-4ab8-a6d2-e99b9ac6514f3b6d6b50-d188-4ab8-a6d2-e99b9ac6514f::image-952243ea-3338-4cbd-81a8-fd59a971b05c952243ea-3338-4cbd-81a8-fd59a971b05c::openpose image'
   },
   {
      source: 'aa20e179-a127-4639-9c05-eac9854df742',
      sourceHandle: 'aa20e179-a127-4639-9c05-eac9854df742::image',
      target: '952243ea-3338-4cbd-81a8-fd59a971b05c',
      targetHandle: '952243ea-3338-4cbd-81a8-fd59a971b05c::depth image',
      type: 'IMAGE',
      id: 'xy-edge__aa20e179-a127-4639-9c05-eac9854df742aa20e179-a127-4639-9c05-eac9854df742::image-952243ea-3338-4cbd-81a8-fd59a971b05c952243ea-3338-4cbd-81a8-fd59a971b05c::depth image'
   },
   {
      source: '56c9156a-5031-4fd2-9559-5224b1a4bdd0',
      sourceHandle: '56c9156a-5031-4fd2-9559-5224b1a4bdd0::embedding',
      target: '952243ea-3338-4cbd-81a8-fd59a971b05c',
      targetHandle: '952243ea-3338-4cbd-81a8-fd59a971b05c::ipadapter embedding',
      type: 'EMBEDDING',
      id: 'xy-edge__56c9156a-5031-4fd2-9559-5224b1a4bdd056c9156a-5031-4fd2-9559-5224b1a4bdd0::embedding-952243ea-3338-4cbd-81a8-fd59a971b05c952243ea-3338-4cbd-81a8-fd59a971b05c::ipadapter embedding'
   },
   {
      source: 'fdb94825-2194-4138-b140-2205a9d0e09a',
      sourceHandle: 'fdb94825-2194-4138-b140-2205a9d0e09a::embedding',
      target: '952243ea-3338-4cbd-81a8-fd59a971b05c',
      targetHandle: '952243ea-3338-4cbd-81a8-fd59a971b05c::negative embedding',
      type: 'EMBEDDING',
      id: 'xy-edge__fdb94825-2194-4138-b140-2205a9d0e09afdb94825-2194-4138-b140-2205a9d0e09a::embedding-952243ea-3338-4cbd-81a8-fd59a971b05c952243ea-3338-4cbd-81a8-fd59a971b05c::negative embedding'
   },
   {
      source: '952243ea-3338-4cbd-81a8-fd59a971b05c',
      sourceHandle: '952243ea-3338-4cbd-81a8-fd59a971b05c::image',
      target: 'efa17bc2-1466-4708-8882-f604847ba8bd',
      targetHandle: 'efa17bc2-1466-4708-8882-f604847ba8bd::image',
      type: 'IMAGE',
      id: 'xy-edge__952243ea-3338-4cbd-81a8-fd59a971b05c952243ea-3338-4cbd-81a8-fd59a971b05c::image-efa17bc2-1466-4708-8882-f604847ba8bdefa17bc2-1466-4708-8882-f604847ba8bd::image'
   },
   {
      source: '3ba5c632-0c1e-440a-a3db-e54631d93c0f',
      sourceHandle: '3ba5c632-0c1e-440a-a3db-e54631d93c0f::image',
      target: '3b6d6b50-d188-4ab8-a6d2-e99b9ac6514f',
      targetHandle: '3b6d6b50-d188-4ab8-a6d2-e99b9ac6514f::image',
      type: 'IMAGE',
      id: 'xy-edge__3ba5c632-0c1e-440a-a3db-e54631d93c0f3ba5c632-0c1e-440a-a3db-e54631d93c0f::image-3b6d6b50-d188-4ab8-a6d2-e99b9ac6514f3b6d6b50-d188-4ab8-a6d2-e99b9ac6514f::image'
   },
   {
      source: '3ba5c632-0c1e-440a-a3db-e54631d93c0f',
      sourceHandle: '3ba5c632-0c1e-440a-a3db-e54631d93c0f::image',
      target: 'aa20e179-a127-4639-9c05-eac9854df742',
      targetHandle: 'aa20e179-a127-4639-9c05-eac9854df742::image',
      type: 'IMAGE',
      id: 'xy-edge__3ba5c632-0c1e-440a-a3db-e54631d93c0f3ba5c632-0c1e-440a-a3db-e54631d93c0f::image-aa20e179-a127-4639-9c05-eac9854df742aa20e179-a127-4639-9c05-eac9854df742::image'
   },
   {
      source: '3ba5c632-0c1e-440a-a3db-e54631d93c0f',
      sourceHandle: '3ba5c632-0c1e-440a-a3db-e54631d93c0f::image',
      target: '56c9156a-5031-4fd2-9559-5224b1a4bdd0',
      targetHandle: '56c9156a-5031-4fd2-9559-5224b1a4bdd0::image',
      type: 'IMAGE',
      id: 'xy-edge__3ba5c632-0c1e-440a-a3db-e54631d93c0f3ba5c632-0c1e-440a-a3db-e54631d93c0f::image-56c9156a-5031-4fd2-9559-5224b1a4bdd056c9156a-5031-4fd2-9559-5224b1a4bdd0::image'
   }
];
