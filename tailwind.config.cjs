/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js",
  ],

  theme: {
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
    },
    extend: {
      colors: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};

module.exports = config;
