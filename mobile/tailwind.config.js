/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "gray-darker": "#292929",
        gray: "#393939",
        "gray-light": "#6B6B6B",
        "gray-pale": "#EBEBEB",
        "red-dark": "#6A1B15",
        red: "#D5232A",
        "red-light": "#DF4237",
        "red-lighter": "#E66762",
        "red-lightest": "#ED9791",
        "red-pale": "#FAE3E3",
        "red-paler": "#FDF2F2",
        "red-palest": "#FEFBFB",
        white: "#FFFFFF",
      },
      fontFamily: {
        krona: ["KronaOne-Regular"],
      },
    },
  },
  plugins: [],
};
