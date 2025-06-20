/** @type {import('tailwindcss').Config} */

module.exports = {
  content: {
    relative: true,
    files: [
      './assets/**/*.{js,ts,jsx,tsx,mdx,liquid}',
      './theme/**/*.{js,ts,jsx,tsx,mdx,liquid}',
      './sections/**/*.{js,ts,jsx,tsx,mdx,liquid}',
      './snippets/**/*.{js,ts,jsx,tsx,mdx,liquid}',
    ],
  },
  theme: {
    extend: { 
      keyframes: {
       appear: {
         "0%": {
           opacity: "0",
         },
         "100%": {
           opacity: "1",
         },
       },
      },
      animation: {
         appear: "appear 1s ease-in-out",
      }
    },
  },
  plugins: [],
}
