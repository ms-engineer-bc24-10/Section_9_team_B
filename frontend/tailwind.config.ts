import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}', // src 配下全ての JSX/TSX/MDX ファイルをスキャン
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'sky-light': '#d8e9fe',
        'mountain-blue': '#bfdffe ',
      },
      backgroundImage: {
        fuji: "url('/img/fuji_background.jpg')",
      },
    },
  },
  plugins: [],
};
export default config;
