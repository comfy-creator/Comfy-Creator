/** @type {import('tailwindcss').Config} */
const { nextui } = require('@nextui-org/react');

export default {
   content: [
      './index.html',
      './lib/**/*.{js,ts,jsx,tsx}',
      './src/**/*.{js,ts,jsx,tsx}',
      './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
   ],

   theme: {
   	extend: {
   		colors: {
   			fg: 'var(--fg-color)',
   			bg: 'var(--bg-color)',
   			primary: {
   				DEFAULT: 'hsl(var(--primary))',
   				foreground: 'hsl(var(--primary-foreground))'
   			},
   			comfyMenuBg: 'var(--comfy-menu-bg)',
   			comfyInputBg: 'var(--comfy-input-bg)',
   			inputText: 'var(--input-text)',
   			descripText: 'var(--descrip-text)',
   			dragText: 'var(--drag-text)',
   			errorText: 'var(--error-text)',
   			borderColor: 'var(--border-color)',
   			trEvenBgColor: 'var(--tr-even-bg-color)',
   			trOddBgColor: 'var(--tr-odd-bg-color)',
   			background: 'hsl(var(--background))',
   			foreground: 'hsl(var(--foreground))',
   			card: {
   				DEFAULT: 'hsl(var(--card))',
   				foreground: 'hsl(var(--card-foreground))'
   			},
   			popover: {
   				DEFAULT: 'hsl(var(--popover))',
   				foreground: 'hsl(var(--popover-foreground))'
   			},
   			secondary: {
   				DEFAULT: 'hsl(var(--secondary))',
   				foreground: 'hsl(var(--secondary-foreground))'
   			},
   			muted: {
   				DEFAULT: 'hsl(var(--muted))',
   				foreground: 'hsl(var(--muted-foreground))'
   			},
   			accent: {
   				DEFAULT: 'hsl(var(--accent))',
   				foreground: 'hsl(var(--accent-foreground))'
   			},
   			destructive: {
   				DEFAULT: 'hsl(var(--destructive))',
   				foreground: 'hsl(var(--destructive-foreground))'
   			},
   			border: 'hsl(var(--border))',
   			input: 'hsl(var(--input))',
   			ring: 'hsl(var(--ring))',
   			chart: {
   				'1': 'hsl(var(--chart-1))',
   				'2': 'hsl(var(--chart-2))',
   				'3': 'hsl(var(--chart-3))',
   				'4': 'hsl(var(--chart-4))',
   				'5': 'hsl(var(--chart-5))'
   			}
   		},
   		borderRadius: {
   			lg: 'var(--radius)',
   			md: 'calc(var(--radius) - 2px)',
   			sm: 'calc(var(--radius) - 4px)'
   		}
   	}
   },
   darkMode: ['class', 'class'],
   plugins: [nextui(), require("tailwindcss-animate")]
};
