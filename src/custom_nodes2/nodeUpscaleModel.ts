export const upscaleModelLoaderDef = {
  label: 'Upscale Model Loader',
  inputs: {
    required: {
    // The API would figure this out by exmaining the models/upscale directory
      model_name: { type: 'MODEL_NAME', options: ["upscale_model_1", "upscale_model_2"] },
    }
  },
  outputs: ['UPSCALE_MODEL'],
  function: 'load_model',
  category: 'loaders',
};

export const imageUpscaleWithModelDef = {
  label: 'Image Upscale With Model',
  inputs: {
    required: {
      upscale_model: { type: 'UPSCALE_MODEL' },
      image: { type: 'IMAGE' },
    }
  },
  outputs: ['IMAGE'],
  function: 'upscale',
  category: 'image/upscaling',
};