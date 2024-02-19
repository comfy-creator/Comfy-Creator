// import { NodeDefinition } from '../types';

// const constants = {
//   MAX_RESOLUTION: 4096
// };

// export const videoModelDef: NodeDefinition = {
//   label: 'Video Model Node',
//   inputs: {
//     required: {
//       clip_vision: { type: 'CLIP_VISION' },
//       init_image: { type: 'IMAGE' },
//       vae: { type: 'VAE' },
//       width: {
//         type: 'INT',
//         default: 1024,
//         min: 16,
//         max: constants.MAX_RESOLUTION,
//         step: 8
//       },
//       height: {
//         type: 'INT',
//         default: 576,
//         min: 16,
//         max: constants.MAX_RESOLUTION,
//         step: 8
//       },
//       video_frames: { type: 'INT', default: 14, min: 1, max: 4096 },
//       motion_bucket_id: { type: 'INT', default: 127, min: 1, max: 1023 },
//       fps: { type: 'INT', default: 6, min: 1, max: 1024 },
//       augmentation_level: {
//         type: 'FLOAT',
//         default: 0.0,
//         min: 0.0,
//         max: 10.0,
//         step: 0.01
//       }
//     }
//   },
//   outputs: ['positive', 'negative', 'latent'],
//   function: 'encode',
//   category: 'conditioning/video_models'
// };

export {};
