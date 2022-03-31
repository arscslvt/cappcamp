const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    maxWidth: {
      xxxs: "8rem",
      xxs: "16rem",
    },
    extend: {
      keyframes: {
        fadeInDown: {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        fadeInDown: "fadeInDown 0.5s ease-out",
      },
      fontFamily: {
        sans: ["Raleway", ...defaultTheme.fontFamily.sans],
        Playfair: ["Raleway"],
        Def: defaultTheme.fontFamily.sans,
      },
    },
  },
  plugins: [],
};
