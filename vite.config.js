import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { pathToFileURL } from "node:url";

/**
 * Menjalankan fungsi di folder /api saat `npm run dev` / `npm run preview`,
 * meniru Vercel. Di produksi, Vercel sendiri yang menjalankannya.
 */
function apiLokal(mode) {
  const pasang = (server) => {
    Object.assign(process.env, loadEnv(mode, process.cwd(), ""), process.env);
    server.middlewares.use(async (req, res, next) => {
      const m = (req.url || "").match(/^\/api\/([\w-]+)/);
      if (!m) return next();
      try {
        const file = pathToFileURL(path.resolve("api", `${m[1]}.js`)).href;
        const mod = await import(`${file}?t=${mode === "development" ? Date.now() : 0}`);
        await mod.default(req, res);
      } catch (e) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  };
  return { name: "api-lokal", configureServer: pasang, configurePreviewServer: pasang };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), apiLokal(mode)],
}));
