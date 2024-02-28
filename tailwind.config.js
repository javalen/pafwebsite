/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        pmp_primary: "#80c157",
        pmp_secondary: "#0093d0",
        paf_background: "#e2e8f0",
        error: "#FF0000",
        paf_secondary: "#1a5893",
        paf_primary: "#2a93e7",
        primary: "#1a5893",
        secondary: "#2a93e7",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "3rem",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
});

// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   darkMode: "class",
//   theme: {
//     extend: {
//       colors: {
//         pmp_primary: "#80c157",
//         pmp_secondary: "#0093d0",
//         paf_background: "#e2e8f0",
//         error: "#FF0000",
//         paf_secondary: "#1a5893",
//         paf_primary: "#2a93e7",
//         primary: "#1a5893",
//         secondary: "#2a93e7",
//       },
//       container: {
//         center: true,
//         padding: {
//           DEFAULT: "1rem",
//           sm: "3rem",
//         },
//       },
//     },
//   },
//   plugins: [require("@tailwindcss/forms")],
// };
