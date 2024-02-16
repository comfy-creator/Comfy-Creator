const Menu = [
  {
    label: "Add Node",
    hasSubMenu: true,
    node: null,
    subMenu: [
      {
        label: "utils",
        hasSubMenu: true,
        node: null,
        subMenu: [
          {
            label: "Note",
            hasSubMenu: false,
            node: "Note",
            subMenu: null,
          },
          {
            label: "Primitive",
            hasSubMenu: false,
            node: "Primitive",
            subMenu: null,
          },
          {
            label: "Reroute",
            hasSubMenu: false,
            node: "Reroute",
            subMenu: null,
          },
        ],
      },
      {
        label: "samplings",
        hasSubMenu: true,
        node: null,
        subMenu: [
          {
            label: "custom_sampling",
            hasSubMenu: false,
            node: "custom_sampling",
            subMenu: null,
          },
          {
            label: "video_models",
            hasSubMenu: false,
            node: "video_models",
            subMenu: null,
          },
          {
            label: "KSampler",
            hasSubMenu: false,
            node: "KSampler",
            subMenu: null,
          },
          {
            label: "KSampler (Advanced)",
            hasSubMenu: false,
            node: "KSampler (Advanced)",
            subMenu: null,
          },
        ],
      },
      {
        label: "loaders",
        hasSubMenu: true,
        node: null,
        subMenu: [
          {
            label: "video_models",
            hasSubMenu: true,
            node: null,
            subMenu: [
              {
                label: "Image Only Checkpoint Loader (img2vid model)",
                hasSubMenu: false,
                node: "Image Only Checkpoint Loader (img2vid model)",
                subMenu: null,
              },
            ],
          },
          {
            label: "Load Checkpoint",
            hasSubMenu: false,
            node: "Load Checkpoint",
            subMenu: null,
          },
          {
            label: "Load VAE",
            hasSubMenu: false,
            node: "Load VAE",
            subMenu: null,
          },
          {
            label: "Load LoRA",
            hasSubMenu: false,
            node: "Load LoRA",
            subMenu: null,
          },
          {
            label: "Load ControlNet Model",
            hasSubMenu: false,
            node: "Load ControlNet Model",
            subMenu: null,
          },
          {
            label: "Load ControlNet Model (diff)",
            hasSubMenu: false,
            node: "Load ControlNet Model (diff)",
            subMenu: null,
          },
          {
            label: "Load Style Model",
            hasSubMenu: false,
            node: "Load Style Model",
            subMenu: null,
          },
          {
            label: "Load CLIP Vision",
            hasSubMenu: false,
            node: "Load CLIP Vision",
            subMenu: null,
          },
          {
            label: "unCLIPCheckpointLoader",
            hasSubMenu: false,
            node: "unCLIPCheckpointLoader",
            subMenu: null,
          },
          {
            label: "GLIGENLoader",
            hasSubMenu: false,
            node: "GLIGENLoader",
            subMenu: null,
          },
          {
            label: "LoraLoaderModelOnly",
            hasSubMenu: false,
            node: "LoraLoaderModelOnly",
            subMenu: null,
          },
          {
            label: "HypernetworkLoader",
            hasSubMenu: false,
            node: "HypernetworkLoader",
            subMenu: null,
          },
          {
            label: "Load Upscale Model",
            hasSubMenu: false,
            node: "Load Upscale Model",
            subMenu: null,
          },
        ],
      },
      {
        label: "conditioning",
        hasSubMenu: true,
        node: null,
        subMenu: [
          {
            label: "style_model",
            hasSubMenu: true,
            node: null,
            subMenu: [
              {
                label: "Apply Style Model",
                hasSubMenu: false,
                node: "Apply Style Model",
                subMenu: null,
              },
            ],
          },
          {
            label: "gligen",
            hasSubMenu: true,
            node: null,
            subMenu: [
              {
                label: "GLIGENTextBoxApply",
                hasSubMenu: false,
                node: "GLIGENTextBoxApply",
                subMenu: null,
              },
            ],
          },
          {
            label: "inpaint",
            hasSubMenu: true,
            node: null,
            subMenu: [
              {
                label: "InpaintModelConditioning",
                hasSubMenu: false,
                node: "InpaintModelConditioning",
                subMenu: null,
              },
            ],
          },
          {
            label: "video_models",
            hasSubMenu: true,
            node: null,
            subMenu: [
              {
                label: "SVD_img2vid_Conditioning",
                hasSubMenu: false,
                node: "SVD_img2vid_Conditioning",
                subMenu: null,
              },
            ],
          },
          {
            label: "3d_models",
            hasSubMenu: true,
            node: null,
            subMenu: [
              {
                label: "StableZero123_Conditioning",
                hasSubMenu: false,
                node: "StableZero123_Conditioning",
                subMenu: null,
              },
              {
                label: "StableZero123_Conditioning_Batched",
                hasSubMenu: false,
                node: "StableZero123_Conditioning_Batched",
                subMenu: null,
              },
            ],
          },
          {
            label: "upscale_diffusion",
            hasSubMenu: true,
            node: null,
            subMenu: [
              {
                label: "SD_4XUpscale_Conditioning",
                hasSubMenu: false,
                node: "SD_4XUpscale_Conditioning",
                subMenu: null,
              },
            ],
          },
          {
            label: "CLIP Text Encode (Prompt)",
            hasSubMenu: false,
            node: "CLIP Text Encode (Prompt)",
            subMenu: null,
          },
          {
            label: "CLIP Set Last Layer",
            hasSubMenu: false,
            node: "CLIP Set Last Layer",
            subMenu: null,
          },
          {
            label: "ConditioningAverage",
            hasSubMenu: false,
            node: "ConditioningAverage",
            subMenu: null,
          },
          {
            label: "Conditioning (Combine)",
            hasSubMenu: false,
            node: "Conditioning (Combine)",
            subMenu: null,
          },
          {
            label: "Conditioning (Concat)",
            hasSubMenu: false,
            node: "Conditioning (Concat)",
            subMenu: null,
          },
          {
            label: "Conditioning (Set Area)",
            hasSubMenu: false,
            node: "Conditioning (Set Area)",
            subMenu: null,
          },
          {
            label: "Conditioning (Set Area with Percentage)",
            hasSubMenu: false,
            node: "Conditioning (Set Area with Percentage)",
            subMenu: null,
          },
          {
            label: "Conditioning (Set Mask)",
            hasSubMenu: false,
            node: "Conditioning (Set Mask)",
            subMenu: null,
          },
          {
            label: "CLIP Vision Encode",
            hasSubMenu: false,
            node: "CLIP Vision Encode",
            subMenu: null,
          },
          {
            label: "unCLIPConditioning",
            hasSubMenu: false,
            node: "unCLIPConditioning",
            subMenu: null,
          },
          {
            label: "Apply ControlNet",
            hasSubMenu: false,
            node: "Apply ControlNet",
            subMenu: null,
          },
          {
            label: "Apply ControlNet (Advanced)",
            hasSubMenu: false,
            node: "Apply ControlNet (Advanced)",
            subMenu: null,
          },
        ],
      },
      {
        label: "latent",
        hasSubMenu: true,
        node: null,
        subMenu: [
          {
            label: "inpaint",
            hasSubMenu: true,
            node: null,
            subMenu: [
              {
                label: "VAE Encode (for Inpainting)",
                hasSubMenu: false,
                node: "VAE Encode (for Inpainting)",
                subMenu: null,
              },
              {
                label: "Set Latent Noise Mask",
                hasSubMenu: false,
                node: "Set Latent Noise Mask",
                subMenu: null,
              },
            ],
          },
          {
            label: "batch",
            hasSubMenu: true,
            node: null,
            subMenu: [
              {
                label: "Latent From Batch",
                hasSubMenu: false,
                node: "Latent From Batch",
                subMenu: null,
              },
              {
                label: "Repeat Latent Batch",
                hasSubMenu: false,
                node: "Repeat Latent Batch",
                subMenu: null,
              },
              {
                label: "LatentBatch",
                hasSubMenu: false,
                node: "LatentBatch",
                subMenu: null,
              },
              {
                label: "Rebatch Latents",
                hasSubMenu: false,
                node: "Rebatch Latents",
                subMenu: null,
              },
            ],
          },
          {
            label: "transform",
            hasSubMenu: true,
            node: null,
            subMenu: [
              {
                label: "Rotate Latent",
                hasSubMenu: false,
                node: "Rotate Latent",
                subMenu: null,
              },
              {
                label: "Flip Latent",
                hasSubMenu: false,
                node: "Flip Latent",
                subMenu: null,
              },
              {
                label: "Crop Latent",
                hasSubMenu: false,
                node: "Crop Latent",
                subMenu: null,
              },
            ],
          },
          {
            label: "advanced",
            hasSubMenu: true,
            node: null,
            subMenu: [
              {
                label: "LatentAdd",
                hasSubMenu: false,
                node: "LatentAdd",
                subMenu: null,
              },
              {
                label: "LatentSubtract",
                hasSubMenu: false,
                node: "LatentSubtract",
                subMenu: null,
              },
              {
                label: "LatentMultiply",
                hasSubMenu: false,
                node: "LatentMultiply",
                subMenu: null,
              },
              {
                label: "LatentInterpolate",
                hasSubMenu: false,
                node: "LatentInterpolate",
                subMenu: null,
              },
            ],
          },
          {
            label: "VAE Decode",
            hasSubMenu: false,
            node: "VAE Decode",
            subMenu: null,
          },
          {
            label: "VAE Encode",
            hasSubMenu: false,
            node: "VAE Encode",
            subMenu: null,
          },
          {
            label: "Empty Latent Image",
            hasSubMenu: false,
            node: "Empty Latent Image",
            subMenu: null,
          },
          {
            label: "Upscale Latent",
            hasSubMenu: false,
            node: "Upscale Latent",
            subMenu: null,
          },
          {
            label: "Upscale Latent By",
            hasSubMenu: false,
            node: "Upscale Latent By",
            subMenu: null,
          },
          {
            label: "Latent Composite",
            hasSubMenu: false,
            node: "Latent Composite",
            subMenu: null,
          },
          {
            label: "LatentCompositeMasked",
            hasSubMenu: false,
            node: "LatentCompositeMasked",
            subMenu: null,
          },
        ],
      },
      {
        label: "image",
        hasSubMenu: true,
        node: null,
        subMenu: [
          {
            label: "upscaling",
            hasSubMenu: true,
            node: null,
            subMenu: [
              {
                label: "Upscale Image",
                hasSubMenu: false,
                node: "Upscale Image",
                subMenu: null,
              },
              {
                label: "Upscale Image By",
                hasSubMenu: false,
                node: "Upscale Image By",
                subMenu: null,
              },
              {
                label: "Upscale Image (using model)",
                hasSubMenu: false,
                node: "Upscale Image (using model)",
                subMenu: null,
              },
              {
                label: "ImageScaleToTotalPixels",
                hasSubMenu: false,
                node: "ImageScaleToTotalPixels",
                subMenu: null,
              },
            ],
          },
          {
            label: "postprocessing",
            hasSubMenu: true,
            node: null,
            subMenu: [
              {
                label: "ImageBlend",
                hasSubMenu: false,
                node: "ImageBlend",
                subMenu: null,
              },
              {
                label: "ImageBlur",
                hasSubMenu: false,
                node: "ImageBlur",
                subMenu: null,
              },
              {
                label: "ImageQuantize",
                hasSubMenu: false,
                node: "ImageQuantize",
                subMenu: null,
              },
              {
                label: "ImageSharpen",
                hasSubMenu: false,
                node: "ImageSharpen",
                subMenu: null,
              },
            ],
          },
          {
            label: "batch",
            hasSubMenu: true,
            node: null,
            subMenu: [
              {
                label: "Rebatch Images",
                hasSubMenu: false,
                node: "Rebatch Images",
                subMenu: null,
              },
              {
                label: "RepeatImageBatch",
                hasSubMenu: false,
                node: "RepeatImageBatch",
                subMenu: null,
              },
            ],
          },
          {
            label: "preprocessors",
            hasSubMenu: true,
            node: null,
            subMenu: [
              {
                label: "Canny",
                hasSubMenu: false,
                node: "Canny",
                subMenu: null,
              },
            ],
          },
          {
            label: "transform",
            hasSubMenu: true,
            node: null,
            subMenu: [
              {
                label: "ImageCrop",
                hasSubMenu: false,
                node: "ImageCrop",
                subMenu: null,
              },
            ],
          },
          {
            label: "animation",
            hasSubMenu: true,
            node: null,
            subMenu: [
              {
                label: "SaveAnimatedWEBP",
                hasSubMenu: false,
                node: "SaveAnimatedWEBP",
                subMenu: null,
              },
              {
                label: "SaveAnimatedPNG",
                hasSubMenu: false,
                node: "SaveAnimatedPNG",
                subMenu: null,
              },
            ],
          },
          {
            label: "Save Image",
            hasSubMenu: false,
            node: "Save Image",
            subMenu: null,
          },
          {
            label: "Preview Image",
            hasSubMenu: false,
            node: "Preview Image",
            subMenu: null,
          },
          {
            label: "Load Image",
            hasSubMenu: false,
            node: "Load Image",
            subMenu: null,
          },
          {
            label: "Invert Image",
            hasSubMenu: false,
            node: "Invert Image",
            subMenu: null,
          },
          {
            label: "Batch Images",
            hasSubMenu: false,
            node: "Batch Images",
            subMenu: null,
          },
          {
            label: "Pad Image for Outpainting",
            hasSubMenu: false,
            node: "Pad Image for Outpainting",
            subMenu: null,
          },
          {
            label: "EmptyImage",
            hasSubMenu: false,
            node: "EmptyImage",
            subMenu: null,
          },
          {
            label: "ImageCompositeMasked",
            hasSubMenu: false,
            node: "ImageCompositeMasked",
            subMenu: null,
          },
        ],
      },
      {
        label: "mask",
        hasSubMenu: true,
        node: null,
        subMenu: [
          {
            label: "compositing",
            hasSubMenu: true,
            node: null,
            subMenu: [
              {
                label: "Porter-Duff Image Composite",
                hasSubMenu: false,
                node: "Porter-Duff Image Composite",
                subMenu: null,
              },
              {
                label: "Split Image with Alpha",
                hasSubMenu: false,
                node: "Split Image with Alpha",
                subMenu: null,
              },
              {
                label: "Join Image with Alpha",
                hasSubMenu: false,
                node: "Join Image with Alpha",
                subMenu: null,
              },
            ],
          },
          {
            label: "Load Image (as Mask)",
            hasSubMenu: false,
            node: "Load Image (as Mask)",
            subMenu: null,
          },
          {
            label: "Convert Mask to Image",
            hasSubMenu: false,
            node: "Convert Mask to Image",
            subMenu: null,
          },
          {
            label: "ImageColorToMask",
            hasSubMenu: false,
            node: "ImageColorToMask",
            subMenu: null,
          },
          {
            label: "SolidMask",
            hasSubMenu: false,
            node: "SolidMask",
            subMenu: null,
          },
          {
            label: "InvertMask",
            hasSubMenu: false,
            node: "InvertMask",
            subMenu: null,
          },
          {
            label: "CropMask",
            hasSubMenu: false,
            node: "CropMask",
            subMenu: null,
          },
          {
            label: "MaskComposite",
            hasSubMenu: false,
            node: "MaskComposite",
            subMenu: null,
          },
          {
            label: "FeatherMask",
            hasSubMenu: false,
            node: "FeatherMask",
            subMenu: null,
          },
          {
            label: "GrowMask",
            hasSubMenu: false,
            node: "GrowMask",
            subMenu: null,
          },
        ],
      },
    ],
  },
  {
    label: "Add Group",
    hasSubMenu: false,
    node: "Add group",
    subMenu: null,
  },
];

const newMenu = {
  "Add Node": {
    hasSubMenu: true,
    node: null,
    subMenu: [
      {
        label: "utils",
        hasSubMenu: true,
        node: null,
        subMenu: [
          {
            label: "Note",
            hasSubMenu: false,
            node: "Note",
            subMenu: null,
          },
          {
            label: "Primitive",
            hasSubMenu: false,
            node: "Primitive",
            subMenu: null,
          },
          {
            label: "Reroute",
            hasSubMenu: false,
            node: "Reroute",
            subMenu: null,
          },
        ],
      },
    ],
  },
};

export interface IMenuType {
  label: string;
  hasSubMenu: boolean;
  node: string | null;
  subMenu: IMenuType[] | null;
  isOpen?: boolean;
}

export default Menu;
