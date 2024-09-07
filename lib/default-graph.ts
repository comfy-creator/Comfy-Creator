import { Edge, Node } from '@xyflow/react';
import { NodeData } from './types/types';

export const defaultNodes: Node<NodeData>[] = [
   {
      id: 'c244a676-05bf-4d64-9864-7ddd41cac8cd',
      type: 'LoadImage',
      data: {
         display_name: 'Load Image',
         inputs: {
            file: {
               value: [
                  'https://cdn.discordapp.com/attachments/1122903185611313253/1278079421466673285/man.jpg?ex=66dc05f7&is=66dab477&hm=00e5b97ee78ebe59fb9dde58913e549938a710c4a9eb405bfc92c81b5ba5036b&'
               ],
               display_name: 'file',
               isHighlighted: false,
               edge_type: 'STRING'
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
         x: -222.1843820031977,
         y: 385.35683305837625
      },
      style: {
         width: '210px'
      },
      measured: {
         width: 176,
         height: 161
      },
      selected: false,
      dragging: false,
      draggable: true
   },
   {
      id: 'e257e15b-d1a6-4605-9658-ee00c92d0862',
      type: 'TextEncoder',
      data: {
         display_name: 'Text Encoder',
         inputs: {
            text: {
               value: 'A man pointing to a star',
               display_name: 'text',
               isHighlighted: false,
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
         x: 108.65238604178367,
         y: 101.46935996251563
      },
      style: {
         width: '210px'
      },
      measured: {
         width: 176,
         height: 213
      },
      draggable: true,
      selected: false,
      dragging: false
   },
   {
      id: '438700bd-4be1-4432-a65f-7dadf16084a1',
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
         x: 105.35086758436671,
         y: 278.8215834708118
      },
      style: {
         width: '210px'
      },
      measured: {
         width: 176,
         height: 155
      },
      selected: false,
      dragging: false,
      draggable: true,
      width: 226,
      height: 119,
      resizing: false
   },
   {
      id: 'e19b2651-9dd4-492b-89ea-d25ad1f7accf',
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
         x: 115.7464747456032,
         y: 585.0414859507196
      },
      style: {
         width: '210px'
      },
      measured: {
         width: 176,
         height: 103
      },
      selected: false,
      dragging: false,
      draggable: true
   },
   {
      id: '428967d4-5daf-4ce7-b14e-739a0117c985',
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
         x: 105.35086758436668,
         y: 438.89533627209084
      },
      style: {
         width: '210px'
      },
      measured: {
         width: 176,
         height: 155
      },
      selected: false,
      dragging: false,
      draggable: true,
      width: 226,
      height: 119,
      resizing: false
   },
   {
      id: 'cbf6b6e8-b073-4767-9737-a8b4b35a7b30',
      type: 'ImageGenerator',
      data: {
         display_name: 'Image Generator',
         inputs: {
            'positive embedding': {
               display_name: 'positive embedding',
               isHighlighted: false,
               isConnected: true,
               edge_type: 'EMBEDDING'
            },
            'negative embedding': {
               display_name: 'negative embedding',
               edge_type: 'EMBEDDING',
               isHighlighted: false,
               optional: true
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
         x: 514.3001625334873,
         y: 280.02169182647015
      },
      style: {
         width: '210px'
      },
      measured: {
         width: 176,
         height: 173
      },
      selected: false,
      dragging: false,
      width: 247,
      height: 154,
      resizing: false,
      draggable: true
   },
   {
      id: 'c922df71-d8ca-4a46-99cf-aac1166dfd67',
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
               edge_type: 'BOOLEAN',
               isHighlighted: false
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
         x: 895.9446853990408,
         y: 252.94007584896076
      },
      style: {
         width: '210px'
      },
      measured: {
         width: 176,
         height: 153
      },
      selected: false,
      dragging: false,
      draggable: true
   }
];

export const defaultEdges: Edge[] = [
   {
      source: 'c244a676-05bf-4d64-9864-7ddd41cac8cd',
      sourceHandle: 'c244a676-05bf-4d64-9864-7ddd41cac8cd::image',
      target: '438700bd-4be1-4432-a65f-7dadf16084a1',
      targetHandle: '438700bd-4be1-4432-a65f-7dadf16084a1::image',
      type: 'IMAGE',
      id: 'xy-edge__c244a676-05bf-4d64-9864-7ddd41cac8cdc244a676-05bf-4d64-9864-7ddd41cac8cd::image-438700bd-4be1-4432-a65f-7dadf16084a1438700bd-4be1-4432-a65f-7dadf16084a1::image'
   },
   {
      source: 'c244a676-05bf-4d64-9864-7ddd41cac8cd',
      sourceHandle: 'c244a676-05bf-4d64-9864-7ddd41cac8cd::image',
      target: '428967d4-5daf-4ce7-b14e-739a0117c985',
      targetHandle: '428967d4-5daf-4ce7-b14e-739a0117c985::image',
      type: 'IMAGE',
      id: 'xy-edge__c244a676-05bf-4d64-9864-7ddd41cac8cdc244a676-05bf-4d64-9864-7ddd41cac8cd::image-428967d4-5daf-4ce7-b14e-739a0117c985428967d4-5daf-4ce7-b14e-739a0117c985::image'
   },
   {
      source: 'c244a676-05bf-4d64-9864-7ddd41cac8cd',
      sourceHandle: 'c244a676-05bf-4d64-9864-7ddd41cac8cd::image',
      target: 'e19b2651-9dd4-492b-89ea-d25ad1f7accf',
      targetHandle: 'e19b2651-9dd4-492b-89ea-d25ad1f7accf::image',
      type: 'IMAGE',
      id: 'xy-edge__c244a676-05bf-4d64-9864-7ddd41cac8cdc244a676-05bf-4d64-9864-7ddd41cac8cd::image-e19b2651-9dd4-492b-89ea-d25ad1f7accfe19b2651-9dd4-492b-89ea-d25ad1f7accf::image'
   },
   {
      source: 'e19b2651-9dd4-492b-89ea-d25ad1f7accf',
      sourceHandle: 'e19b2651-9dd4-492b-89ea-d25ad1f7accf::embedding',
      target: 'cbf6b6e8-b073-4767-9737-a8b4b35a7b30',
      targetHandle: 'cbf6b6e8-b073-4767-9737-a8b4b35a7b30::ipadapter embedding',
      type: 'EMBEDDING',
      id: 'xy-edge__e19b2651-9dd4-492b-89ea-d25ad1f7accfe19b2651-9dd4-492b-89ea-d25ad1f7accf::embedding-cbf6b6e8-b073-4767-9737-a8b4b35a7b30cbf6b6e8-b073-4767-9737-a8b4b35a7b30::ipadapter embedding'
   },
   {
      source: '438700bd-4be1-4432-a65f-7dadf16084a1',
      sourceHandle: '438700bd-4be1-4432-a65f-7dadf16084a1::image',
      target: 'cbf6b6e8-b073-4767-9737-a8b4b35a7b30',
      targetHandle: 'cbf6b6e8-b073-4767-9737-a8b4b35a7b30::openpose image',
      type: 'IMAGE',
      id: 'xy-edge__438700bd-4be1-4432-a65f-7dadf16084a1438700bd-4be1-4432-a65f-7dadf16084a1::image-cbf6b6e8-b073-4767-9737-a8b4b35a7b30cbf6b6e8-b073-4767-9737-a8b4b35a7b30::openpose image'
   },
   {
      source: '428967d4-5daf-4ce7-b14e-739a0117c985',
      sourceHandle: '428967d4-5daf-4ce7-b14e-739a0117c985::image',
      target: 'cbf6b6e8-b073-4767-9737-a8b4b35a7b30',
      targetHandle: 'cbf6b6e8-b073-4767-9737-a8b4b35a7b30::depth image',
      type: 'IMAGE',
      id: 'xy-edge__428967d4-5daf-4ce7-b14e-739a0117c985428967d4-5daf-4ce7-b14e-739a0117c985::image-cbf6b6e8-b073-4767-9737-a8b4b35a7b30cbf6b6e8-b073-4767-9737-a8b4b35a7b30::depth image'
   },
   {
      source: 'e257e15b-d1a6-4605-9658-ee00c92d0862',
      sourceHandle: 'e257e15b-d1a6-4605-9658-ee00c92d0862::embedding',
      target: 'cbf6b6e8-b073-4767-9737-a8b4b35a7b30',
      targetHandle: 'cbf6b6e8-b073-4767-9737-a8b4b35a7b30::positive embedding',
      type: 'EMBEDDING',
      id: 'xy-edge__e257e15b-d1a6-4605-9658-ee00c92d0862e257e15b-d1a6-4605-9658-ee00c92d0862::embedding-cbf6b6e8-b073-4767-9737-a8b4b35a7b30cbf6b6e8-b073-4767-9737-a8b4b35a7b30::positive embedding'
   },
   {
      source: 'cbf6b6e8-b073-4767-9737-a8b4b35a7b30',
      sourceHandle: 'cbf6b6e8-b073-4767-9737-a8b4b35a7b30::image',
      target: 'c922df71-d8ca-4a46-99cf-aac1166dfd67',
      targetHandle: 'c922df71-d8ca-4a46-99cf-aac1166dfd67::image',
      type: 'IMAGE',
      id: 'xy-edge__cbf6b6e8-b073-4767-9737-a8b4b35a7b30cbf6b6e8-b073-4767-9737-a8b4b35a7b30::image-c922df71-d8ca-4a46-99cf-aac1166dfd67c922df71-d8ca-4a46-99cf-aac1166dfd67::image'
   }
];
