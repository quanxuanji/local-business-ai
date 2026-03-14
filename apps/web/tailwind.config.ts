import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1b1d1f",
        slate: "#6f757b",
        mist: "#eef2f1",
        pine: "#0f5132",
        sand: "#f5efe3",
        sky: "#d7ecff",
      },
      boxShadow: {
        panel: "0 20px 60px rgba(10, 24, 33, 0.08)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
