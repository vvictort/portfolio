import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

export default defineConfig({
  output: "server",
  adapter: vercel({
    maxDuration: 10,
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
});
