import { ChangeEvent, MouseEvent } from "react";

export type InputSpec = {
  type: string;
  min?: number;
  max?: number;
  step?: number;
  default?: any;
  options?: string[];
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
