export type PanelPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface UIPosition {
  x: number;
  y: number;
}

export interface NodeDefinition {
  name: string;
  type: string;
  category: string;
  inputs: NodePort[];
  outputs: NodePort[];
}

export interface NodePort {
  type: string;
  name: string;
  label: string;
  handle: "input" | "output";
}
