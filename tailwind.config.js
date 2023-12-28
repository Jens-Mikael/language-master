/** @type {import('tailwindcss').Config} */

import plugin from "tailwindcss/plugin";

const backfaceVisibility = plugin(function ({ addUtilities }) {
  addUtilities({
    ".backface-visible": {
      "backface-visibility": "visible",
    },
    ".backface-hidden": {
      "-webkit-backface-visibility": "hidden",
    },
  });
});

const transformStyle = plugin(function ({ addUtilities }) {
  addUtilities({
    ".transformStyle-3d": {
      "-webkit-transform-style": "preserve-3d",
    },
  });
});

const transform = plugin(function ({ addUtilities }) {
  addUtilities({
    ".transform-y-180": {
      "-webkit-transform": "rotateY(180deg)",
    },
  });
});

module.exports = {
  plugins: [backfaceVisibility],
};

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        croissantOne: ["var(--font-croissantOne)"],
        ubuntu: ["var(--font-ubuntu)"],
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [backfaceVisibility, transformStyle, transform],
};
