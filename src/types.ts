import { type MouseEvent as ReactMouseEvent, ComponentType } from 'react';
import { IMenuType } from './components/template/menuData.ts';
import { NodeProps, XYPosition } from 'reactflow';

// This type is outdated
// export type NodeData = {
//   label: string;
//   function: string;
//   category: string;
//   inputs: {
//     required: Record<string, InputDef>;
//     optional?: Record<string, InputDef>;
//   };
//   outputs: string[];
// };

export type InputSpec = {
  default?: number | string;
  min?: number;
  max?: number;
  step?: number;
  round?: number | boolean;
  display?: 'color'; // what is this?
  multiline?: boolean;
  image_upload?: boolean; // dumb
};

type EdgeValueSpec = undefined | string[] | InputSpec;

// TO DO: when the fuck is this a 'string[]' and why? Combo type?
// I removed 'string[]' for now
// export type InputDef = {
//   defaultValue?: number | string;
//   min?: number;
//   max?: number;
//   step?: number;
//   round?: number | boolean;
//   display?: 'color'; // what is this?
//   multiline?: boolean;
//   image_upload?: boolean; // dumb
// };

export type EdgeType =
  | 'BOOLEAN'
  | 'INT'
  | 'FLOAT'
  | 'STRING'
  | 'MODEL'
  | 'CONDITIONING'
  | 'LATENT'
  | 'VAE'
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
  | 'VIDEO'
  | 'ENUM';

// =========== Input Definitions ===========
// Provides constraints on top of state

// Base type for the discriminator
export interface BaseInputDef {
  readonly label: string;
  readonly edgeType: EdgeType;
  readonly optional?: boolean; // assumed false if undefined
  readonly isHandle?: boolean; // imputed based on edgeType if undefined
}

export interface BoolInputDef extends BaseInputDef {
  readonly edgeType: 'BOOLEAN';
  readonly defaultValue: boolean;
}

export interface IntInputDef extends BaseInputDef {
  readonly edgeType: 'INT';
  readonly defaultValue: number;
  readonly min: number;
  readonly max: number;
  readonly step?: number;
}

export interface FloatInputDef extends BaseInputDef {
  readonly edgeType: 'FLOAT';
  readonly defaultValue: number;
  readonly min: number;
  readonly max: number;
  readonly step?: number;
  readonly round?: number;
}

export interface StringInputDef extends BaseInputDef {
  readonly edgeType: 'STRING';
  readonly defaultValue?: string;
  readonly multiline?: boolean;
}

export interface EnumInputDef extends BaseInputDef {
  readonly edgeType: 'ENUM';
  readonly defaultValue?: string;
  readonly options: string[] | (() => string[]);
  readonly multiSelect?: boolean;
}

export interface ImageInputDef extends BaseInputDef {
  readonly edgeType: 'IMAGE';
  readonly defaultValue?: string;
}

export interface VideoInputDef extends BaseInputDef {
  readonly edgeType: 'VIDEO';
  readonly defaultValue?: { src: string; type: string };
}

export type InputDef =
  | BoolInputDef
  | IntInputDef
  | FloatInputDef
  | StringInputDef
  | EnumInputDef
  | ImageInputDef
  | VideoInputDef;

// =========== Output Definition ===========
// Note that outputs do not hold any state; on the client we either
//
// 1. precompute the outputs, i.e., A-Primitive[string] -> B[string], we take the
// string from A-Primitive and pass it into B, then remove A-Primitive from the graph.
//
// 2. or the outputs will be computed by the Comfy-Server, i.e.,
// A[conditioning] -> B[conditioning], the A-node will compute conditioning (CLIP text
// encode), and then pass it as an input into B-node (K-sampler).

export type OutputDef = {
  label: string;
  edgeType: EdgeType;
};

// =========== Enitre Node Definition ===========

// This is adapted from ComfyUI's getNodeDefs
export type NodeDefinition = Readonly<{
  // name: string;
  display_name: string;
  description: string;
  // example: "conditioning/upscale_diffusion"
  category: string;

  inputs: InputDef[];

  outputs: OutputDef[];

  output_node: boolean;
}>;

// The key is the name of the node-type
export type NodeDefinitions = Record<string, NodeDefinition>;

export interface AddNodeParams {
  type: string;
  position: XYPosition;
  inputWidgetValues: Record<string, any>;
}

// =========== Input States ===========

export interface BaseInputState {
  label: string;
  edgeType: EdgeType;
  optional?: boolean; // assumed false if undefined
}

export interface InputHandle extends BaseInputState {
  isHandle: true;
}

export interface BoolInputState extends BaseInputState {
  edgeType: 'BOOLEAN';
  value: boolean;
}

export interface IntInputState extends BaseInputState {
  edgeType: 'INT';
  value: number;
}

export interface FloatInputState extends BaseInputState {
  edgeType: 'FLOAT';
  value: number;
}

export interface StringInputState extends BaseInputState {
  edgeType: 'STRING';
  value: string;
}

export interface EnumInputState extends BaseInputState {
  edgeType: 'ENUM';
  value: string | string[];
}

export interface ImageInputState extends BaseInputState {
  edgeType: 'IMAGE';
  value: string;
}

export interface VideoInputState extends BaseInputState {
  edgeType: 'VIDEO';
  value: { src: string; type: string };
}

export type WidgetState =
  | BoolInputState
  | IntInputState
  | FloatInputState
  | StringInputState
  | EnumInputState
  | ImageInputState
  | VideoInputState;

// =========== Output States (none) ===========

export type OutputHandle = {
  label: string;
  edgeType: EdgeType;
  isHandle: true;
};

// =========== Entire Node State ===========
// This is the 'data' type stored inside of a node instance

export type NodeState = {
  readonly display_name: string;
  inputEdges: Record<number, InputHandle>;
  outputEdges: Record<number, OutputHandle>;
  inputWidgets: Record<string, WidgetState>;
};

// =========== Node Types ===========
// Node-definitions are converted into React components, and then registered with
// ReactFlow as a 'NodeType'.

export type NodeType = ComponentType<NodeProps<NodeState>>;

export type NodeTypes = Record<string, NodeType>;

export type UpdateWidgetState = (
  nodeId: string,
  widgetLabel: string,
  newState: Partial<WidgetState>
) => void;

// TO DO: we need more specific enums!
// And we need more specific conditioning, CLIP, VAE,
// Then we need specific CLP, clip vision, clip vision output
// For images and latents we could perhaps specify dimensions?

// Example:
// { images: ['IMAGE'],
//    scale_ratio: ['FLOAT', { defaultValue: 4.0, min: 0.0, max: 10.0, step: 0.01 }]
// }

// Example: { positive: { edgeType: 'CONDITIONING' } }

// export type Input = { edgeType: EdgeType; inputDef?: InputDef; isHandle?: boolean };
// export type Output = { edgeType: EdgeType };

// export type Inputs = { [name: string]: Input };
// export type Outputs = { [name: string]: Output };

// Base class for node instances
// export class NodeInstance {
//   definition: NodeDefinition;
//   state: { [key: string]: any }; // Consider a more specific type

//   constructor(definition: NodeDefinition) {
//     this.definition = definition;
//     this.state = {}; // Initialize state based on definition
//   }

//   // Method to update state
//   updateState(key: string, value: any) {
//     this.state[key] = value;
//   }
// }

// abstract class NodeTemplate {
//   abstract name: string;
//   abstract display_name: string;
//   // display_name: string;
//   abstract description: string;
//   // example: "conditioning/upscale_diffusion"
//   abstract category: string;

//   abstract inputs: {
//     required: InputDef[];
//     optional?: InputDef[];
//     // IDK what this was used for?
//     // hidden?: {
//     //   prompt: "PROMPT",
//     //   extra_pnginfo: "EXTRA_PNGINFO"
//     // }
//   };

//   abstract outputs: OutputDef[];

//   abstract output_node: boolean;
// }

// Factory function to create classes
// TO DO: use more specific type than 'object'
// export function createNodeTemplate(def: NodeDefinition) {
//   return class implements Node<object, string> {
//     static type = def.type;
//     static display_name = def.display_name;
//     static description = def.description;
//     static category = def.category;

//     static inputs = def.inputs;
//     static outputs = def.outputs;
//     static output_node = def.output_node;

//     id: string;
//     position: XYPosition;
//     data: Record<number, any>;

//     constructor(id: string, position: XYPosition) {
//       this.id = id;
//       this.position = position;

//       // Initialize data based on node-definition
//       this.data = {};
//       def.inputs.forEach((input, index) => {
//         // The key for data is the label of the input
//         // Initialize based on the type of input
//         switch (input.edgeType) {
//           case 'BOOLEAN':
//             this.data[index] = input.defaultValue;
//             break;

//           case 'INT':
//           case 'FLOAT':
//             // For simplicity, directly assigning defaultValue.
//             // You might want to handle min, max, step, and round as needed.
//             this.data[index] = input.defaultValue;
//             break;

//           case 'STRING':
//             this.data[index] = input.defaultValue || '';
//             break;

//           case 'ENUM':
//             // For ENUM, you might want to handle multiSelect and options differently
//             this.data[index] = input.defaultValue || input.options[0];
//             break;

//           default:
//             console.warn(`Unhandled edgeType: ${(input as BaseInputDef).edgeType}`);
//         }
//       });
//     }
//   };
// }

// export type NodeWidget =
//   | ButtonWidget
//   | ToggleWidget
//   | SliderWidget
//   | NumberWidget
//   | DropdownWidget
//   | StringWidget
//   | TextWidget;

// export type WidgetTypes = 'button' | 'toggle' | 'slider' | 'number' | 'combo' | 'text' | 'string';

// export interface ComponentProps {
//   disabled?: boolean;
//   onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
// }

// export interface Widget<Value, Options> {
//   // name: string;
//   label: string;
//   value: Value;
//   options?: Options;
//   edgeType: EdgeType | null;
//   y?: number;
//   // last_y: number; // what is this used for?
//   disabled?: boolean;
// }

// export interface ButtonWidget extends Widget<null, object> {
//   edgeType: null;
//   onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
// }

// export interface ToggleWidget extends Widget<boolean, { on?: string; off?: string }> {
//   edgeType: 'BOOLEAN';
//   onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
// }

// export interface SliderWidget extends Widget<number, { max: number; min: number }> {
//   edgeType: 'FLOAT' | 'INT';
// }

// export interface NumberWidget extends Widget<number, object> {
//   edgeType: 'FLOAT' | 'INT';
//   onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
// }

// export interface DropdownWidget extends Widget<string[], { values: string[] | (() => string[]) }> {
//   edgeType: 'ENUM';
//   onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
// }

// export interface StringWidget extends Widget<string, object> {
//   edgeType: 'STRING';
//   onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
// }

// export interface TextWidget extends Widget<string, object> {
//   edgeType: 'STRING';
//   onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
// }

export interface MenuState {
  items: IMenuType[];

  isOpen?: boolean;
  close: (event: ReactMouseEvent) => void;
}

export interface ContextMenuProps {
  id?: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;

  title?: string;
  items: IMenuType[];

  parentMenu: MenuState | null;
  currentSubmenu: MenuState | null;

  reset?: () => void;

  [key: string]: any;
}

// These are node-types that are built into React Flow
// We currently do not allow them to be instantiated, but we could add them
const defaultNodeDefs = ['default', 'input', 'output', 'group'];

export interface ComfyError extends Error {
  details: string;
  fileName?: string;
  node_id?: number;
  node_type?: string;
  class_type?: string;
  traceback?: string[];
  errors?: ComfyError[];
  exception_message?: string;
  dependent_outputs?: any[];
  extra_info?: {
    [x: string]: any;
  };
}
