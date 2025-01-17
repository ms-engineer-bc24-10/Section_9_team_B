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
      },
      backgroundImage: {
        fuji: "url('/img/fuji_background.jpg')",
        signup: "url('/img/cloudy.png')",
        calendar: "url('/img/kumo_frame_new.png')",
      },
    },
  },
  plugins: [],
};
export default config;
