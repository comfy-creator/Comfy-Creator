import { InputHTMLAttributes } from 'react';

declare global {
  interface Event {
    detail: any;
  }

  interface UIEvent {
    canvasX: number;
    canvasY: number;
  }

  interface EventTarget {
    type: string;
    localName: string;
    className: string;
  }
}

// This is also defined in our protofiles
export interface WorkflowStep {
  class_type: string;
  inputs: { [key: string]: any } | undefined;
  _meta?: { title: string };
}

export interface TemplateData {
  templates?: {
    data: string;
  }[];
}

export interface PngInfo {
  parameters: string;
  Workflow: string;
  workflow: string;
  prompt: string;
}

export interface LatentInfo {
  workflow: string;
  prompt: string;
}

export interface ComfyProgress {
  max: number;
  min: number;
  value: number;
}

export interface ComfyButtonWidget {
  name: string;
  type: 'button';
  value: HTMLButtonElement;
  callback: (value: any) => void;
}

export interface ComfyImageWidget {
  name: string;
  type: 'image';
  last_y: number;
  computedHeight: number;
  value: HTMLImageElement;
  computeSize: () => number[];
  callback: (value: any) => void;
}

export interface ComfyFileWidget {
  name: string;
  type: 'file';
  value: ComfyFile;
  callback: (value: any) => void;
}

export interface ComfyTextWidget {
  name: string;
  type: 'text';
  value: string;
  callback: (value: any) => void;
}

export interface ComfyFile {
  type: string;
  filename: string;
  subfolder: string;
}

export type ComfyImages = HTMLImageElement[] | ComfyFile[];

export interface BooleanInputProps {
  id: string;
  onChange?: (value: boolean) => void;
  setSettingValue: (id: string, value: boolean) => void;
}

export interface NumberInputProps {
  id: string;
  setter: (value: string) => void;
  attrs: InputHTMLAttributes<HTMLInputElement>;
}

export interface SliderInputProps extends NumberInputProps {}

export interface ComboOption {
  text: string;
  value?: string;
}

export interface ComboInputProps {
  value: string;
  setter: (value: string) => void;
  options: ComboOption[] | ((value: string) => (ComboOption | string)[]);
}

export interface TextInputProps {
  id: string;
  setter: (value: string) => void;
  attrs: InputHTMLAttributes<HTMLInputElement>;
}

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

export type QueueItem = {
  jobId: string;
  status: JobStatus;
};

export type NodeErrorDetail = {
  message: string;
  details: string;
  extra_info?: {
    input_name?: string;
  };
};

export type NodeError = {
  class_type: string;
  errors: NodeErrorDetail[];
};

export type LastNodeErrors = {
  [nodeId: string]: NodeError;
};
