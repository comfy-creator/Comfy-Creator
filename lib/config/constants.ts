import { EdgeType, HandleState, ViewFileArgs, WidgetType } from '../types/types';
import { useFlowStore } from '../store/flow';
import { IPagination } from '../types/api';

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
   'ENUM',
   'FILEPICKER',
   'IMAGE_ROUTER'
];
export const DISPLAY_TYPES: EdgeType[] = ['IMAGE', 'VIDEO'];
export const PASS_OUTPUT_NODE_TYPE = ['MaskImage', 'LoadImage'];

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
   'EMBEDDING',
   // widget types
   'INT',
   'FLOAT',
   'STRING'
];

export const HANDLE_ID_DELIMITER = '::';

export const CONVERTABLE_WIDGET_TYPES: EdgeType[] = ['STRING', 'ENUM', 'INT', 'FLOAT', 'BOOLEAN'];

export const GRAPHS_KEY = 'graphs';
export const CURRENT_GRAPH_INDEX = 'currentGraphIndex';

export const SNAPSHOT_KEY = 'snapshot';
export const CURRENT_SNAPSHOT_INDEX = 'currentSnapshotIndex';

export const FLOW_PADDING = 5; // in pixels
export const FLOW_MIN_ZOOM = 0.5;
export const FLOW_MAX_ZOOM = 2;

export const controlAfterGenerateDef: HandleState | any = {
   edge_type: 'ENUM',
   serialize: false,
   valueControl: true,
   defaultValue: 'randomize',
   name: 'control_after_generate',
   options: ['fixed', 'increment', 'decrement', 'randomize']
};

export const DEFAULT_SERVER_URL = 'http://localhost:9009/api/v1';
export const DEFAULT_SERVER_PROTOCOL = 'ws' as const;

// export const DEFAULT_SERVER_URL = 'http://localhost:30031';
// export const DEFAULT_SERVER_PROTOCOL = 'grpc' as const;

export const API_URL = {
   WS: '/ws',
   GET_EMBEDDINGS: '/embeddings',
   GET_NODE_DEFS: '/object_info',
   GET_REACT_COMPONENTS: '/react-components',
   GENERATE: '/generate',
   UPLOAD: '/upload',
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
   STORE_USER_DATA_FILE: (file: string) => `/userdata/${encodeURIComponent(file)}`,
   GET_OUTPUT_IMAGE: (pagination: IPagination) =>
      `/view_all?page=${pagination.page}&page_size=${pagination.page_size}`
};

export const EDGES_UPDATABLE = true;
export const AUTO_PAN_ON_CONNECT = true;
export const ELEVATE_EDGES_ON_SELECT = true;
export const ZOOM_ON_DOUBLE_CLICK = false;
export const MULTI_SELECT_KEY_CODE = 'Shift';
export const REACTFLOW_PRO_OPTIONS_CONFIG = {
   account: 'paid-pro',
   hideAttribution: true
};

// Frequence we save to localStorage as nodes
export const SAVE_GRAPH_DEBOUNCE = 1000; // 1 second

// indexDB config
export const INDEX_DB_NAME = 'ComfyGraphStorage';
export const INDEX_DB_OJECT_NAME = 'comfy-graph-editor';

export const outputNodeTypesName = {
   MODEL: 'Model Output',
   CONDITIONING: 'Conditioning Data',
   LATENT: 'Latent Space Data',
   VAE: 'VAE Output',
   IMAGE: 'Image Data',
   CLIP: 'CLIP Text Embedding',
   CLIP_VISION: 'CLIP Image Embedding',
   CLIP_VISION_OUTPUT: 'CLIP Vision Output',
   STYLE_MODEL: 'Style Model Output',
   CONTROL_NET: 'ControlNet Output',
   UPSCALE_MODEL: 'Upscale Model Output',
   SAMPLER: 'Sampler Output',
   SIGMAS: 'Sigma Values',
   PHOTOMAKER: 'PhotoMaker Output',
   MASK: 'Mask Data',
   VIDEO: 'Video Data'
};

export const NODE_GROUP_NAME = 'Group';

// transform point
export const TRANSFORM_POINT = 1.7;