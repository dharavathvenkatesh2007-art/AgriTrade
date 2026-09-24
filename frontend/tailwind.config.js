export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Manrope", "system-ui", "sans-serif"]
      },
      colors: {
        leaf: {
          50: "#eefbf0",
          100: "#d8f4dd",
          200: "#b5e8bf",
          300: "#86d697",
          500: "#2f9e44",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#143b22",
          950: "#052e16"
        },
        soil: {
          50: "#f8f5ef",
          100: "#eee5d5",
          500: "#9a6b3f",
          700: "#654629"
        },
        harvest: {
          100: "#fff3cc",
          500: "#f59f00",
          700: "#b76e00"
        }
      },
      boxShadow: {
        soft: "0 16px 50px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};
