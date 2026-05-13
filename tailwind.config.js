/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17212b",
        surface: "#f5fbfe",
        brand: {
          50: "#eefaff",
          100: "#d7f1fb",
          500: "#016997",
          600: "#007bb1",
          700: "#005f89",
        },
        coral: {
          50: "#fff1ed",
          500: "#e46645",
          600: "#c84f31",
          700: "#9e3b24",
          800: "#762918",
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 33, 43, 0.08)",
      },
    },
  },
  plugins: [],
};
