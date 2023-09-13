/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito"],
      },
      colors: {
        "primary-orange": "#FF5722",
      },
      borderRadius: {
        sm: "20px",
      },
      blur: {
        sm: "3px",
      },
    },
  },
  plugins: [],
};
