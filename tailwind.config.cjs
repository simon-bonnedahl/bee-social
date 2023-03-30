/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js",
  ],

  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};

module.exports = config;
