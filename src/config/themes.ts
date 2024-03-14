import { ThemeConfig } from '../types.ts';

const themes = ['dark', 'light', 'solarized', 'arc', 'nord', 'github'];

export const defaultThemeConfig: { [x: string]: ThemeConfig } = {
  dark: {
    id: 'dark',
    name: 'Dark (Default)',
    colors: {
      types: {
        CLIP: '#FFD500', // bright yellow
        CLIP_VISION: '#A8DADC', // light blue-gray
        CLIP_VISION_OUTPUT: '#ad7452', // rusty brown-orange
        CONDITIONING: '#FFA931', // vibrant orange-yellow
        CONTROL_NET: '#6EE7B7', // soft mint green
        IMAGE: '#64B5F6', // bright sky blue
        LATENT: '#FF9CF9', // light pink-purple
        MASK: '#81C784', // muted green
        MODEL: '#B39DDB', // light lavender-purple
        STYLE_MODEL: '#C2FFAE', // light green-yellow
        VAE: '#FF6E6E', // bright red
        TAESD: '#DCC274', // cheesecake
        DEFAULT: '#66BB6A'
      },
      appearance: {
        NODE_TITLE_COLOR: '#999',
        NODE_SELECTED_TITLE_COLOR: '#FFF',
        NODE_TEXT_SIZE: 14,
        NODE_TEXT_COLOR: '#AAA',
        NODE_BG_COLOR: '#353535',
        NODE_DEFAULT_BOX_COLOR: '#666',
        NODE_BOX_OUTLINE_COLOR: '#FFF',

        WIDGET_BG_COLOR: '#222',
        WIDGET_OUTLINE_COLOR: '#666',
        WIDGET_TEXT_COLOR: '#DDD',
        WIDGET_SECONDARY_TEXT_COLOR: '#999',

        EDGE_COLOR: '#9A9',
        CONNECTING_EDGE_COLOR: '#AFA'
      },
      CSSVariables: {
        'fg-color': '#fff',
        'bg-color': '#202020',
        'comfy-menu-bg': '#353535',
        'comfy-input-bg': '#222',
        'input-text': '#ddd',
        'descrip-text': '#999',
        'drag-text': '#ccc',
        'error-text': '#ff4444',
        'border-color': '#4e4e4e',
        'tr-even-bg-color': '#222',
        'tr-odd-bg-color': '#353535'
      }
    }
  },
  light: {
    id: 'light',
    name: 'Light',
    colors: {
      types: {
        CLIP: '#FFA726', // orange
        CLIP_VISION: '#5C6BC0', // indigo
        CLIP_VISION_OUTPUT: '#8D6E63', // brown
        CONDITIONING: '#EF5350', // red
        CONTROL_NET: '#66BB6A', // green
        IMAGE: '#42A5F5', // blue
        LATENT: '#AB47BC', // purple
        MASK: '#9CCC65', // light green
        MODEL: '#7E57C2', // deep purple
        STYLE_MODEL: '#D4E157', // lime
        VAE: '#FF7043', // deep orange,
        DEFAULT: '#66BB6A'
      },
      appearance: {
        NODE_TITLE_COLOR: '#222',
        NODE_SELECTED_TITLE_COLOR: '#000',
        NODE_TEXT_SIZE: 14,
        NODE_TEXT_COLOR: '#444',
        NODE_BG_COLOR: '#F5F5F5',
        NODE_DEFAULT_BOX_COLOR: '#CCC',
        NODE_BOX_OUTLINE_COLOR: '#000',

        WIDGET_BG_COLOR: '#D4D4D4',
        WIDGET_OUTLINE_COLOR: '#999',
        WIDGET_TEXT_COLOR: '#222',
        WIDGET_SECONDARY_TEXT_COLOR: '#555',

        EDGE_COLOR: '#4CAF50',
        CONNECTING_EDGE_COLOR: '#2196F3'
      },
      CSSVariables: {
        'fg-color': '#222',
        'bg-color': '#DDD',
        'comfy-menu-bg': '#F5F5F5',
        'comfy-input-bg': '#C9C9C9',
        'input-text': '#222',
        'descrip-text': '#444',
        'drag-text': '#555',
        'error-text': '#F44336',
        'border-color': '#888',
        'tr-even-bg-color': '#f9f9f9',
        'tr-odd-bg-color': '#fff'
      }
    }
  },
  solarized: {
    id: 'solarized',
    name: 'Solarized',
    colors: {
      types: {
        CLIP: '#2AB7CA', // light blue
        CLIP_VISION: '#6c71c4', // blue violet
        CLIP_VISION_OUTPUT: '#859900', // olive green
        CONDITIONING: '#d33682', // magenta
        CONTROL_NET: '#d1ffd7', // light mint green
        IMAGE: '#5940bb', // deep blue violet
        LATENT: '#268bd2', // blue
        MASK: '#CCC9E7', // light purple-gray
        MODEL: '#dc322f', // red
        STYLE_MODEL: '#1a998a', // teal
        UPSCALE_MODEL: '#054A29', // dark green
        VAE: '#facfad', // light pink-orange
        DEFAULT: '#00f16a'
      },
      appearance: {
        NODE_TITLE_COLOR: '#fdf6e3', // Base3
        NODE_SELECTED_TITLE_COLOR: '#A9D400',
        NODE_TEXT_SIZE: 14,
        NODE_TEXT_COLOR: '#657b83', // Base00
        NODE_BG_COLOR: '#073642', // Base02
        NODE_DEFAULT_BOX_COLOR: '#839496', // Base0
        NODE_BOX_OUTLINE_COLOR: '#fdf6e3', // Base3

        WIDGET_BG_COLOR: '#002b36', // Base03
        WIDGET_OUTLINE_COLOR: '#839496', // Base0
        WIDGET_TEXT_COLOR: '#fdf6e3', // Base3
        WIDGET_SECONDARY_TEXT_COLOR: '#93a1a1', // Base1

        EDGE_COLOR: '#2aa198', // Solarized Cyan
        CONNECTING_EDGE_COLOR: '#859900' // Solarized Green
      },
      CSSVariables: {
        'fg-color': '#fdf6e3', // Base3
        'bg-color': '#002b36', // Base03
        'comfy-menu-bg': '#073642', // Base02
        'comfy-input-bg': '#002b36', // Base03
        'input-text': '#93a1a1', // Base1
        'descrip-text': '#586e75', // Base01
        'drag-text': '#839496', // Base0
        'error-text': '#dc322f', // Solarized Red
        'border-color': '#657b83', // Base00
        'tr-even-bg-color': '#002b36',
        'tr-odd-bg-color': '#073642'
      }
    }
  },
  arc: {
    id: 'arc',
    name: 'Arc',
    colors: {
      types: {
        BOOLEAN: '',
        CLIP: '#eacb8b',
        CLIP_VISION: '#A8DADC',
        CLIP_VISION_OUTPUT: '#ad7452',
        CONDITIONING: '#cf876f',
        CONTROL_NET: '#00d78d',
        CONTROL_NET_WEIGHTS: '',
        FLOAT: '',
        GLIGEN: '',
        IMAGE: '#80a1c0',
        IMAGEUPLOAD: '',
        INT: '',
        LATENT: '#b38ead',
        LATENT_KEYFRAME: '',
        MASK: '#a3bd8d',
        MODEL: '#8978a7',
        SAMPLER: '',
        SIGMAS: '',
        STRING: '',
        STYLE_MODEL: '#C2FFAE',
        T2I_ADAPTER_WEIGHTS: '',
        TAESD: '#DCC274',
        TIMESTEP_KEYFRAME: '',
        UPSCALE_MODEL: '',
        VAE: '#be616b',
        DEFAULT: '#04f8b0'
      },
      appearance: {
        NODE_TITLE_COLOR: '#b2b7bd',
        NODE_SELECTED_TITLE_COLOR: '#FFF',
        NODE_TEXT_SIZE: 14,
        NODE_TEXT_COLOR: '#AAA',
        NODE_BG_COLOR: '#242730',
        NODE_DEFAULT_BOX_COLOR: '#6e7581',
        NODE_BOX_OUTLINE_COLOR: '#FFF',
        WIDGET_BG_COLOR: '#2b2f38',
        WIDGET_OUTLINE_COLOR: '#6e7581',
        WIDGET_TEXT_COLOR: '#DDD',
        WIDGET_SECONDARY_TEXT_COLOR: '#b2b7bd',
        EDGE_COLOR: '#9A9',
        CONNECTING_EDGE_COLOR: '#AFA'
      },
      CSSVariables: {
        'fg-color': '#fff',
        'bg-color': '#2b2f38',
        'comfy-menu-bg': '#242730',
        'comfy-input-bg': '#2b2f38',
        'input-text': '#ddd',
        'descrip-text': '#b2b7bd',
        'drag-text': '#ccc',
        'error-text': '#ff4444',
        'border-color': '#6e7581',
        'tr-even-bg-color': '#2b2f38',
        'tr-odd-bg-color': '#242730'
      }
    }
  },
  nord: {
    id: 'nord',
    name: 'Nord',
    colors: {
      types: {
        BOOLEAN: '',
        CLIP: '#eacb8b',
        CLIP_VISION: '#A8DADC',
        CLIP_VISION_OUTPUT: '#ad7452',
        CONDITIONING: '#cf876f',
        CONTROL_NET: '#00d78d',
        CONTROL_NET_WEIGHTS: '',
        FLOAT: '',
        GLIGEN: '',
        IMAGE: '#80a1c0',
        IMAGEUPLOAD: '',
        INT: '',
        LATENT: '#b38ead',
        LATENT_KEYFRAME: '',
        MASK: '#a3bd8d',
        MODEL: '#8978a7',
        SAMPLER: '',
        SIGMAS: '',
        STRING: '',
        STYLE_MODEL: '#C2FFAE',
        T2I_ADAPTER_WEIGHTS: '',
        TAESD: '#DCC274',
        TIMESTEP_KEYFRAME: '',
        UPSCALE_MODEL: '',
        VAE: '#be616b',
        DEFAULT: '#f10404'
      },
      appearance: {
        NODE_TITLE_COLOR: '#999',
        NODE_SELECTED_TITLE_COLOR: '#e5eaf0',
        NODE_TEXT_SIZE: 14,
        NODE_TEXT_COLOR: '#bcc2c8',
        NODE_BG_COLOR: '#161b22',
        NODE_DEFAULT_BOX_COLOR: '#545d70',
        NODE_BOX_OUTLINE_COLOR: '#e5eaf0',
        WIDGET_BG_COLOR: '#2e3440',
        WIDGET_OUTLINE_COLOR: '#545d70',
        WIDGET_TEXT_COLOR: '#bcc2c8',
        WIDGET_SECONDARY_TEXT_COLOR: '#999',
        EDGE_COLOR: '#9A9',
        CONNECTING_EDGE_COLOR: '#AFA'
      },
      CSSVariables: {
        'fg-color': '#e5eaf0',
        'bg-color': '#2e3440',
        'comfy-menu-bg': '#161b22',
        'comfy-input-bg': '#2e3440',
        'input-text': '#bcc2c8',
        'descrip-text': '#999',
        'drag-text': '#ccc',
        'error-text': '#ff4444',
        'border-color': '#545d70',
        'tr-even-bg-color': '#2e3440',
        'tr-odd-bg-color': '#161b22'
      }
    }
  },
  github: {
    id: 'github',
    name: 'Github',
    colors: {
      types: {
        BOOLEAN: '',
        CLIP: '#eacb8b',
        CLIP_VISION: '#A8DADC',
        CLIP_VISION_OUTPUT: '#ad7452',
        CONDITIONING: '#cf876f',
        CONTROL_NET: '#00d78d',
        CONTROL_NET_WEIGHTS: '',
        FLOAT: '',
        GLIGEN: '',
        IMAGE: '#80a1c0',
        IMAGEUPLOAD: '',
        INT: '',
        LATENT: '#b38ead',
        LATENT_KEYFRAME: '',
        MASK: '#a3bd8d',
        MODEL: '#8978a7',
        SAMPLER: '',
        SIGMAS: '',
        STRING: '',
        STYLE_MODEL: '#C2FFAE',
        T2I_ADAPTER_WEIGHTS: '',
        TAESD: '#DCC274',
        TIMESTEP_KEYFRAME: '',
        UPSCALE_MODEL: '',
        VAE: '#be616b',
        DEFAULT: '#3ae702'
      },
      appearance: {
        NODE_TITLE_COLOR: '#999',
        NODE_SELECTED_TITLE_COLOR: '#e5eaf0',
        NODE_TEXT_SIZE: 14,
        NODE_TEXT_COLOR: '#bcc2c8',
        NODE_BG_COLOR: '#13171d',
        NODE_DEFAULT_BOX_COLOR: '#30363d',
        NODE_BOX_OUTLINE_COLOR: '#e5eaf0',
        WIDGET_BG_COLOR: '#161b22',
        WIDGET_OUTLINE_COLOR: '#30363d',
        WIDGET_TEXT_COLOR: '#bcc2c8',
        WIDGET_SECONDARY_TEXT_COLOR: '#999',
        EDGE_COLOR: '#9A9',
        CONNECTING_EDGE_COLOR: '#AFA'
      },
      CSSVariables: {
        'fg-color': '#e5eaf0',
        'bg-color': '#161b22',
        'comfy-menu-bg': '#13171d',
        'comfy-input-bg': '#161b22',
        'input-text': '#bcc2c8',
        'descrip-text': '#999',
        'drag-text': '#ccc',
        'error-text': '#ff4444',
        'border-color': '#30363d',
        'tr-even-bg-color': '#161b22',
        'tr-odd-bg-color': '#13171d'
      }
    }
  }
};
