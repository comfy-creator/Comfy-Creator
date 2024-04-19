import { ComponentType, type MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { EdgeProps, NodeProps, XYPosition } from 'reactflow';

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
  | 'ENUM'
  | 'TAESD'
  | '*'
  | 'GROUP';

// =========== Input Definitions ===========
// Provides constraints on top of state

// Base type for the discriminator
export interface BaseInputDef {
  readonly name: string;
  readonly type: EdgeType;
  readonly optional?: boolean; // assumed false if undefined
  readonly serialize?: boolean; // assumed true if undefined
  readonly valueControl?: boolean; // assumed false if undefined
}

export interface BoolInputDef extends BaseInputDef {
  readonly type: 'BOOLEAN';
  readonly defaultValue: boolean;
}

export interface IntInputDef extends BaseInputDef {
  readonly type: 'INT';
  readonly defaultValue: number;
  readonly min: number;
  readonly max: number;
  readonly step?: number;
}

export interface FloatInputDef extends BaseInputDef {
  readonly type: 'FLOAT';
  readonly defaultValue: number;
  readonly min: number;
  readonly max: number;
  readonly step?: number;
  readonly round?: number;
}

export interface StringInputDef extends BaseInputDef {
  readonly type: 'STRING';
  readonly defaultValue?: string;
  readonly multiline?: boolean;
}

export interface EnumInputDef extends BaseInputDef {
  readonly type: 'ENUM';
  readonly defaultValue?: string;
  readonly options: string[] | (() => string[]);
  readonly multiSelect?: boolean;
}

export interface ImageInputDef extends BaseInputDef {
  readonly type: 'IMAGE';
  imageUpload?: boolean;
  readonly defaultValue?: string;
}

export interface VideoInputDef extends BaseInputDef {
  readonly type: 'VIDEO';
  readonly defaultValue?: { src: string; type: string };
}

export interface AnyInputDef extends BaseInputDef {
  readonly type: '*';
}

export type InputDef =
  | BoolInputDef
  | IntInputDef
  | FloatInputDef
  | StringInputDef
  | EnumInputDef
  | ImageInputDef
  | VideoInputDef
  | AnyInputDef;

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
  name: string;
  type: EdgeType;
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
  config?: NodeStateConfig;
  inputWidgetValues?: Record<string, any>;
}

// =========== Input States ===========

export interface BaseInputState {
  name: string;
  type: EdgeType;
  group?: string;
  hidden?: boolean;
  optional?: boolean;
  serialize?: boolean;
  definition?: InputDef;
  valueControl?: boolean;
  isHighlighted?: boolean;
  linkedWidgets?: string[]; // array of widget names
}

export interface OutputHandle {
  name: string;
  type: EdgeType;
  hidden?: boolean;
  isHighlighted?: boolean;
}

export interface InputHandle extends BaseInputState {
  widget?: WidgetState;
  primitiveNodeId?: string;
}

export interface BoolInputState extends BaseInputState {
  type: 'BOOLEAN';
  value: boolean;
}

export interface IntInputState extends BaseInputState {
  type: 'INT';
  value: number;
}

export interface FloatInputState extends BaseInputState {
  type: 'FLOAT';
  value: number;
}

export interface StringInputState extends BaseInputState {
  type: 'STRING';
  value: string;
}

export interface EnumInputState extends BaseInputState {
  type: 'ENUM';
  value: string;
}

export interface GroupInputState extends BaseInputState {
  type: 'GROUP';
  widgets: WidgetState[];
}

export interface ImageInputState extends BaseInputState {
  type: 'IMAGE';
  value?: string;
}

export interface VideoInputState extends BaseInputState {
  type: 'VIDEO';
  value: { src: string; type: string };
}

export interface PrimitiveInputState extends BaseInputState {
  type: '*';
}

export type WidgetState =
  | BoolInputState
  | IntInputState
  | FloatInputState
  | StringInputState
  | EnumInputState
  | ImageInputState
  | VideoInputState
  | PrimitiveInputState
  | GroupInputState;

// =========== Entire Node State ===========
// This is the 'data' type stored inside a node instance

export type NodeState = {
  readonly name: string;
  config?: NodeStateConfig;
  inputs: InputHandle[];
  outputs: OutputHandle[];
  widgets: Record<string, WidgetState>;
};

export type NodeStateConfig = {
  hideType?: boolean;
  hideLabel?: boolean;
  isVirtual?: boolean;
  isOutputNode?: boolean;

  // Node custom display colors
  bgColor?: string;
  textColor?: string;
};

// =========== Node Types ===========
// Node-definitions are converted into React components, and then registered with
// ReactFlow as a 'NodeType'.

export type NodeType = ComponentType<NodeProps<NodeState>>;

export type NodeTypes = Record<string, NodeType>;

export interface UpdateWidgetStateParams {
  name: string;
  nodeId: string;
  data: Partial<WidgetState>;
}

export type UpdateWidgetState = (params: UpdateWidgetStateParams) => void;

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

export type EdgeComponents = Record<string, ComponentType<EdgeProps>>;

export interface IMenuType {
  label: string;
  isOpen?: boolean;
  disabled?: boolean;
  hasSubMenu: boolean;
  subMenu: IMenuType[] | null;
  data: Record<string, any> | null | string;
  onClick?: (event: ReactMouseEvent) => void;
}

export type KeyboardHandler = (event?: KeyboardEvent) => void;

export interface SettingsLookup {
  id: string;
  name: string;
  render: (i: number) => ReactNode;
  onChange?: (...arg: any[]) => void;
}

export interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    types: {
      VAE: string;
      CLIP: string;
      MASK: string;
      MODEL: string;
      IMAGE: string;
      LATENT: string;
      DEFAULT: string;
      CLIP_VISION: string;
      CONTROL_NET: string;
      STYLE_MODEL: string;
      CONDITIONING: string;
      CLIP_VISION_OUTPUT: string;
      [x: string]: string;
    };
    appearance: {
      NODE_BG_COLOR: string;
      NODE_TEXT_SIZE: number;
      NODE_TEXT_COLOR: string;
      NODE_TITLE_COLOR: string;
      NODE_SELECTED_TITLE_COLOR: string;
      NODE_DEFAULT_BOX_COLOR: string;
      NODE_BOX_OUTLINE_COLOR: string;

      WIDGET_BG_COLOR: string;
      WIDGET_TEXT_COLOR: string;
      WIDGET_OUTLINE_COLOR: string;
      WIDGET_SECONDARY_TEXT_COLOR: string;

      EDGE_COLOR: string;
      CONNECTING_EDGE_COLOR: string;
    };
    CSSVariables: { [x: string]: string };
  };
}

export interface LogEntry {
  type: string;
  source: string;
  message: any[];
  timestamp: Date;
}

export interface AddValueControlWidget {
  widget: WidgetState;
  defaultValue?: string;
  options?: {
    addFilterList?: boolean;
    controlAfterGenerateName?: string;
  };
}

export type MessageType = 'status' | 'progress' | 'executing' | 'executed';

export interface ComfyStatusMessage {
  type: 'status';
  data: {
    sid?: string;
    status: { [key: string]: any };
  };
}

export interface ComfyProgressMessage {
  type: 'progress';
  data: {
    max: number;
    node: string;
    value: number;
    prompt_id: string;
  };
}

export interface ComfyExecutingMessage {
  type: 'executing';
  data: {
    prompt_id?: string;
    node: string | null;
  };
}

export interface ComfyExecutedMessage {
  type: 'executed';
  data: {
    node: string;
    prompt_id: string;
    output: { [key: string]: any };
  };
}

export type ComfyWsMessage =
  | ComfyStatusMessage
  | ComfyProgressMessage
  | ComfyExecutingMessage
  | ComfyExecutedMessage;

export interface SerializedFlow {
  [key: string]: {
    inputs: Record<string, string | number | boolean | [string, number]>;
    class_type: string;
    _meta: {
      title: string;
    };
  };
}

export interface ViewFileArgs {
  type: string;
  filename: string;
  subfolder?: string;
}
