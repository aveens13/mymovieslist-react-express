import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const envFile = `.env.${mode}`;
  const envPath = path.resolve(__dirname, envFile);

  // Load the environment variables
  dotenv.config({ path: envPath });

  // Log the environment variables to ensure they are loaded correctly
  console.log("Environment Variables:", process.env);

  if (!process.env.VITE_API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL environment variable is not defined");
  }
  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: process.env.VITE_API_BASE_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
