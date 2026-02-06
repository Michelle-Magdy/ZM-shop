/** @type {import('tailwindcss').Config} */
const tailwindConfi = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#104e64",
        brand: {
          light: "#3b82f6",
          dark: "#000000",
        },
        background: {
          light: "#f9fafb",
          dark: "#111827",
        },
        text: {
          light: "#1f2937",
          dark: "#f9fafb",
        },
      },
    },
  },
  plugins: [],
};

export default tailwindConfi;
