const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Raleway", ...defaultTheme.fontFamily.sans],
        Playfair: ["Raleway"],
        Def: defaultTheme.fontFamily.sans,
      },
    },
  },
  plugins: [],
};
