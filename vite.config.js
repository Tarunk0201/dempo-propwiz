import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],
  server: {
    // Allows local network access for your mobile/Meta Quest testing
    host: true,
    allowedHosts: [
      "xzavier-overwary-dodie.ngrok-free.dev",
      ".ngrok-free.app",
      ".ngrok-free.dev",
    ],
  },
});
