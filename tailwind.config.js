const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all relevant file types
    "./node_modules/flowbite-react/**/*.js",
    flowbite.content(),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbite.plugin(),
  ],
};
