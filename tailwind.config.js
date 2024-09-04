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
            primary: '#76b900',
            comfyMenuBg: 'var(--comfy-menu-bg)',
            comfyInputBg: 'var(--comfy-input-bg)',
            inputText: 'var(--input-text)',
            descripText: 'var(--descrip-text)',
            dragText: 'var(--drag-text)',
            errorText: 'var(--error-text)',
            borderColor: 'var(--border-color)',
            trEvenBgColor: 'var(--tr-even-bg-color)',
            trOddBgColor: 'var(--tr-odd-bg-color)'
         }
      }
   },
   darkMode: 'class',
   plugins: [nextui()]
};
