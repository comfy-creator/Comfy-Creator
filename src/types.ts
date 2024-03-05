import { ComponentType, type MouseEvent as ReactMouseEvent } from 'react';
import { EdgeProps, NodeProps, XYPosition } from 'reactflow';

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
  | '*';

// =========== Input Definitions ===========
// Provides constraints on top of state

// Base type for the discriminator
export interface BaseInputDef {
  readonly name: string;
  readonly type: EdgeType;
  readonly optional?: boolean; // assumed false if undefined
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
  readonly defaultValue?: string;
}

export interface VideoInputDef extends BaseInputDef {
  readonly type: 'VIDEO';
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
  inputWidgetValues: Record<string, any>;
}

// =========== Input States ===========

export interface BaseInputState {
  name: string;
  type: EdgeType;
  config?: InputDef;
  optional?: boolean;
  isHighlighted?: boolean;
}

export interface OutputHandle {
  name: string;
  type: EdgeType;
  isHighlighted?: boolean;
}

export interface InputHandle extends BaseInputState {
  widget?: WidgetState;
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
  value: string | string[];
}

export interface ImageInputState extends BaseInputState {
  type: 'IMAGE';
  value: string;
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
  | PrimitiveInputState;

// =========== Entire Node State ===========
// This is the 'data' type stored inside a node instance

export type NodeState = {
  readonly name: string;
  inputs: Record<number, InputHandle>;
  outputs: Record<number, OutputHandle>;
  widgets: Record<string, WidgetState>;
};

// =========== Node Types ===========
// Node-definitions are converted into React components, and then registered with
// ReactFlow as a 'NodeType'.

export type NodeType = ComponentType<NodeProps<NodeState>>;

export type NodeTypes = Record<string, NodeType>;

export interface UpdateWidgetStateParams {
  name: string;
  nodeId: string;
  newState: Partial<WidgetState>;
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
  disabled?: boolean;
  label: string;
  hasSubMenu: boolean;
  node: Record<string, Object> | string | null;
  subMenu: IMenuType[] | null;
  isOpen?: boolean;
  onClick?: (event: ReactMouseEvent) => void;
}
