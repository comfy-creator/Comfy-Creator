import { ChangeEvent, MouseEvent } from "react";

export type InputSpec = {
  type: string;
  min?: number;
  max?: number;
  step?: number;
  default?: number;
};

export type NodeData = {
  label: string;
  function: string;
  category: string;
  outputs: string[];
  inputs: {
    required: Record<string, InputSpec>;
    optional?: Record<string, InputSpec>;
  };
};

export interface ContextMenuProps {
  id?: string | null;
  top: number;
  left: number;
  right: number;
  bottom: number;

  reset?: () => void;

  [key: string]: any;
}

export interface Widget {
  y?: number;
  last_y: number;
  disabled?: boolean;
  width?: number;
  clicked?: boolean;
  value?: any;
  options?: any;
  marker?: any;
}

export interface ButtonWidget extends Widget {
  type: "button";
  label?: string;
  name?: string;

  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export interface ToggleWidget extends Widget {
  type: "toggle";
  label?: string;
  name?: string;
  value?: boolean;

  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface SliderWidget extends Widget {
  type: "slider";
  options: {
    min: number;
    max: number;
    slider_color?: string;
    marker_color?: string;
  };
}

export interface NumberWidget extends Widget {
  type: "number";
}

export interface ComboWidget extends Widget {
  type: "combo";
}

export interface StringWidget extends Widget {
  type: "string";
}

export interface TextWidget extends Widget {
  type: "text";
}
