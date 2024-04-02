/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#252A34",
        txt: "#EAEAEA",
        custblue: "#08D9D6",
        custred: "#FF2E63",
      },
      fontFamily: {
        primary: ['Fira Sans'],
        secondary: ['Sarala']
      },
      dropShadow: {
        blue: "0px 8px 12px rgba(8,217,214,0.9)",
        red: "0px 8px 12px rgba(255,46,98,0.9)",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

