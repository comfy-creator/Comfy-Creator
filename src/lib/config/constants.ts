import { EdgeType, InputDef, ViewFileArgs } from '../types.ts';
import { useFlowStore } from '../../store/flow.ts';

export const SUPPORTED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];

export const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

export const DEFAULT_SHORTCUT_KEYS = [
  'ctrl+enter',
  'ctrl+shift+enter',
  'ctrl+s',
  'ctrl+o',
  'ctrl+a',
  'ctrl+m',
  'ctrl+del',
  'ctrl+backspace',
  'space',
  'ctrl+left',
  'shift+left',
  'ctrl+c',
  'ctrl+v',
  'ctrl+shift+v',
  'ctrl+d',
  'q',
  'h',
  'r'
];

export const DEFAULT_HOTKEYS_HANDLERS = {
  'ctrl+enter': () => {
    alert('Hey man, you clicked on ctrl+enter');
  },
  'ctrl+shift+enter': () => {
    alert('Hey man, you clicked on ctrl+shift+enter');
  },
  'ctrl+s': () => {
    alert('Hey man, you clicked on ctrl+s');
  },
  'ctrl+o': () => {
    // alert('Hey man, you clicked on ctrl+o');

    const { addNode } = useFlowStore.getState();
    addNode({
      position: { x: 200, y: 200 },
      type: 'PrimitiveNode'
    });
  },
  'ctrl+a': () => {
    alert('Hey man, you clicked on ctrl+a');
  },
  'ctrl+m': () => {
    // alert('Hey man, you clicked on ctrl+m');

    // console.log('ddss');
    const { addNode } = useFlowStore.getState();
    addNode({
      position: { x: 200, y: 200 },
      type: 'RerouteNode'
    });
  },
  'ctrl+del': () => {
    alert('Hey man, you clicked on ctrl+del');
  },
  'ctrl+backspace': () => {
    alert('Hey man, you clicked on ctrl+backspace');
  },
  space: () => {
    alert('Hey man, you clicked on space');
  },
  'ctrl+left': () => {
    alert('Hey man, you clicked on ctrl+left');
  },
  'shift+left': () => {
    alert('Hey man, you clicked on shift+left');
  },
  'ctrl+c': () => {
    alert('Hey man, you clicked on ctrl+c');
  },
  'ctrl+v': () => {
    alert('Hey man, you clicked on ctrl+v');
  },
  'ctrl+shift+v': () => {
    alert('Hey man, you clicked on ctrl+shift+v');
  },
  'ctrl+d': () => {
    alert('Hey man, you clicked on ctrl+d');
  },
  q: () => {
    alert('Hey man, you clicked on q');
  },
  h: () => {
    alert('Hey man, you clicked on h');
  },
  r: () => {
    alert('Hey man, you clicked on r');
  }
};

export const WIDGET_TYPES: EdgeType[] = [
  'INT',
  'STRING',
  'BOOLEAN',
  'FLOAT',
  'ENUM'
  // 'IMAGE',
  // 'VIDEO'
];

export const HANDLE_TYPES: EdgeType[] = [
  'CLIP',
  'CLIP_VISION',
  'CLIP_VISION_OUTPUT',
  'CONDITIONING',
  'CONTROL_NET',
  'IMAGE',
  'LATENT',
  'MASK',
  'MODEL',
  'STYLE_MODEL',
  'VAE',
  'TAESD',

  // widget types
  'INT',
  'FLOAT',
  'STRING'
];

export const HANDLE_ID_DELIMITER = '::';

export const CONVERTABLE_WIDGET_TYPES: EdgeType[] = ['STRING', 'ENUM', 'INT', 'FLOAT', 'BOOLEAN'];

export const FLOW_KEY = 'flow';
export const FLOW_PADDING = 5; // in pixels
export const FLOW_MIN_ZOOM = 0.5;
export const FLOW_MAX_ZOOM = 2;

export const controlAfterGenerateDef: InputDef = {
  type: 'ENUM',
  serialize: false,
  valueControl: true,
  defaultValue: 'randomize',
  name: 'control_after_generate',
  options: ['fixed', 'increment', 'decrement', 'randomize']
};

export const DEFAULT_SERVER_URL = 'http://localhost:8188';
export const DEFAULT_SERVER_PROTOCOL = 'ws' as const;

// export const DEFAULT_SERVER_URL = 'http://localhost:30031';
// export const DEFAULT_SERVER_PROTOCOL = 'grpc' as const;

export const API_URL = {
  WS: '/ws',
  GET_EMBEDDINGS: '/embeddings',
  GET_NODE_DEFS: '/object_info',
  GET_HISTORY: (maxItems: number) => `/history?max_items=${maxItems}`,
  GET_SYSTEM_STATS: '/system_stats',
  GET_USER_CONFIG: '/users',
  CREATE_USER: '/users',
  GET_SETTINGS: '/settings',
  GET_SETTING_BY_ID: (id: string) => `/settings/${id}`,
  STORE_SETTINGS: '/settings',
  VIEW_FILE: ({ filename, subfolder = '', type }: ViewFileArgs) =>
    `/view?filename=${filename}&subfolder=${subfolder}&type=${type}`,
  GET_USER_DATA_FILE: (file: string) => `/userdata/${encodeURIComponent(file)}`,
  STORE_USER_DATA_FILE: (file: string) => `/userdata/${encodeURIComponent(file)}`
};
