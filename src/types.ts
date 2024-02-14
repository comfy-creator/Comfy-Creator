import { ChangeEvent, MouseEvent } from "react";

// This type is outdated
// export type NodeData = {
//   label: string;
//   function: string;
//   category: string;
//   inputs: {
//     required: Record<string, InputSpec>;
//     optional?: Record<string, InputSpec>;
//   };
//   outputs: string[];
// };

export type InputSpec = {
      default?: number | string,
      min?: number,
      max?: number,
      step?: number,
      round?: number | boolean,
      display?: "color", // what is this?
      multiline?: boolean,
      image_upload?: boolean // dumb
    }

type EdgeType = "MODEL" | "INT" | "FLOAT" | "STRING" | "CONDITIONING" | "LATENT" | "CLIP" | "VAE" | "MASK" | "IMAGE" | "CLIP_VISION" | "CLIP_VISION_OUTPUT" | "STYLE_MODEL" | "CONTROL_NET" | "UPSCALE_MODEL" | "SAMPLER" | "SIGMAS" | "PHOTOMAKER" | "MASK"

type EdgeValueSpec = 
  | undefined 
  | string[] 
  | InputSpec

// This is adapted from ComfyUI's getNodeDefs
export type NodeDefinition = {
  [nodeName: string]: {
    inputs: {
      // Example:
      // { images: ['IMAGE'],
      //    scale_ratio: ['FLOAT', { default: 4.0, min: 0.0, max: 10.0, step: 0.01 }] 
      // }
      required: Record<string, [EdgeType, EdgeValueSpec]>,
      optional?: Record<string, [EdgeType, EdgeValueSpec]>,
      // IDK what this was used for?
      // hidden?: {
      //   prompt: "PROMPT",
      //   extra_pnginfo: "EXTRA_PNGINFO"
      // }
    },
    // Example: { positive: 'CONDITIONING' }
    outputs: Record<string, EdgeType>,
    name: string,
    display_name: string,
    description: string,

    // example: "conditioning/upscale_diffusion"
    category: string,
    output_node: boolean

    // Internally, these are also defined, but not returned by the API:
    // label: string
    // function: string
  }
}

export type NodeWidget =
  | ButtonWidget
  | ToggleWidget
  | SliderWidget
  | NumberWidget
  | ComboWidget
  | StringWidget
  | TextWidget;

export interface ContextMenuProps {
  id?: string | null;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;

  reset?: () => void;

  [key: string]: any;
}

export type WidgetTypes =
  | "button"
  | "toggle"
  | "slider"
  | "number"
  | "combo"
  | "text"
  | "string";

export interface Widget<Value extends any, Options extends any> {
  name: string;
  value: Value;
  options?: Options;
  type: WidgetTypes;
  label?: string;
  y?: number;
  last_y: number;
  disabled?: boolean;
}

export interface ButtonWidget extends Widget<null, {}> {
  type: "button";
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export interface ToggleWidget
  extends Widget<boolean, { on?: string; off?: string }> {
  type: "toggle";
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface SliderWidget
  extends Widget<number, { max: number; min: number }> {
  type: "slider";
}

export interface NumberWidget extends Widget<number, {}> {
  type: "number";
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface ComboWidget
  extends Widget<string[], { values: string[] | (() => string[]) }> {
  type: "combo";
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export interface StringWidget extends Widget<string, {}> {
  type: "string";
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface TextWidget extends Widget<string, {}> {
  type: "text";
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

type InputTypes =
  | "INT"
  | "STRING"
  | "BOOLEAN"
  | "FLOAT"
  | "IMAGEUPLOAD"
  | "INT:seed"
  | "INT:noise_seed";
