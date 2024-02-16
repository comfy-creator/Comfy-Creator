import { ChangeEvent, MouseEvent } from 'react';

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

// TO DO: when the fuck is this a 'string[]' and why? Combo type?
// I removed 'string[]' for now
// export type InputSpec = {
//   default?: number | string;
//   min?: number;
//   max?: number;
//   step?: number;
//   round?: number | boolean;
//   display?: 'color'; // what is this?
//   multiline?: boolean;
//   image_upload?: boolean; // dumb
// };

export type DataType =
  | 'BOOLEAN'
  | 'INT'
  | 'FLOAT'
  | 'STRING'
  | 'MODEL'
  | 'CONDITIONING'
  | 'LATENT'
  | 'VAE'
  | 'MASK'
  | 'IMAGE'
  | 'CLIP'
  | 'CLIP_VISION'
  | 'CLIP_VISION_OUTPUT'
  | 'STYLE_MODEL'
  | 'CONTROL_NET'
  | 'UPSCALE_MODEL'
  | 'SAMPLER'
  | 'SIGMAS'
  | 'PHOTOMAKER'
  | 'MASK'
  | 'ENUM';

// Base type for the discriminator
export interface BaseInputSpec {
  label: string;
  dataType: DataType;
  isHandle?: boolean;
}

export interface BoolInput extends BaseInputSpec {
  dataType: 'BOOLEAN';
  default: boolean;
}

export interface IntInput extends BaseInputSpec {
  dataType: 'INT';
  default: number;
  min: number;
  max: number;
  step?: number;
}

export interface FloatInput extends BaseInputSpec {
  dataType: 'FLOAT';
  default: number;
  min: number;
  max: number;
  step?: number;
  round?: number;
}

export interface StringInput extends BaseInputSpec {
  dataType: 'STRING';
  default?: string;
  multiline?: boolean;
}

export interface EnumInput extends BaseInputSpec {
  dataType: 'ENUM';
  default?: string;
  options: string[];
  multiSelect?: boolean;
}

export type InputSpec = BoolInput | IntInput | FloatInput | StringInput | EnumInput;

export type OutputSpec = {
  label: string;
  dataType: DataType;
};

// TO DO: we need more specific enums!
// And we need more specific conditioning, CLIP, VAE,
// Then we need specific CLP, clip vision, clip vision output
// For images and latents we could perhaps specify dimensions?

export type NodeDefinitions = Record<string, NodeDefinition>;

// Example:
// { images: ['IMAGE'],
//    scale_ratio: ['FLOAT', { default: 4.0, min: 0.0, max: 10.0, step: 0.01 }]
// }

// Example: { positive: { dataType: 'CONDITIONING' } }

// export type Input = { dataType: DataType; inputSpec?: InputSpec; isHandle?: boolean };
// export type Output = { dataType: DataType };

// export type Inputs = { [name: string]: Input };
// export type Outputs = { [name: string]: Output };

// This is adapted from ComfyUI's getNodeDefs
export type NodeDefinition = {
  name: string;
  display_name: string;
  description: string;
  // example: "conditioning/upscale_diffusion"
  category: string;

  inputs: {
    required: InputSpec[];
    optional?: InputSpec[];
    // IDK what this was used for?
    // hidden?: {
    //   prompt: "PROMPT",
    //   extra_pnginfo: "EXTRA_PNGINFO"
    // }
  };

  outputs: OutputSpec[];

  output_node: boolean;

  // Internally, these are also defined in python, but not returned by the API:
  // label: string
  // function: string
};

export type NodeWidget =
  | ButtonWidget
  | ToggleWidget
  | SliderWidget
  | NumberWidget
  | DropdownWidget
  | StringWidget
  | TextWidget;

export type WidgetTypes = 'button' | 'toggle' | 'slider' | 'number' | 'combo' | 'text' | 'string';

export interface Widget<Value, Options> {
  // name: string;
  label: string;
  value: Value;
  options?: Options;
  dataType: DataType | null;
  y?: number;
  // last_y: number; // what is this used for?
  disabled?: boolean;
}

export interface ButtonWidget extends Widget<null, object> {
  dataType: null;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export interface ToggleWidget extends Widget<boolean, { on?: string; off?: string }> {
  dataType: 'BOOLEAN';
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface SliderWidget extends Widget<number, { max: number; min: number }> {
  dataType: 'FLOAT' | 'INT';
}

export interface NumberWidget extends Widget<number, object> {
  dataType: 'FLOAT' | 'INT';
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface DropdownWidget extends Widget<string[], { values: string[] | (() => string[]) }> {
  dataType: 'ENUM';
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export interface StringWidget extends Widget<string, object> {
  dataType: 'STRING';
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface TextWidget extends Widget<string, object> {
  dataType: 'STRING';
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const canBeWidget = ['INT', 'STRING', 'BOOLEAN', 'FLOAT', 'ENUM'];

export interface ContextMenuProps {
  id?: string | null;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;

  reset?: () => void;

  [key: string]: any;
}
