/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#DF4237",
        "primary-paler": "#FDF2F2",
        "primary-palest": "#FEFBFB",
        black: "1F1F1F",
        gray: "#393939",
        "gray-light": "#6B6B6B",
        "grey-lightest": "#D1D1D1",
        "gray-pale": "#EBEBEB",
        "gray-paler": "#FDF2F2",
        "gray-palest": "#FBFBFB",
      },
            fontFamily: {
        krona: ["KronaOne-Regular"]
      }
    },

  },
  plugins: [],
};
