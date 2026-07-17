/* ═══════════════════════════════════════════════════════════
   Dev-only Vite plugin: runs the Netlify Functions locally.

   The app calls fetch("/api/disease-detection"), fetch("/api/ai-assistant"),
   etc. Those routes only exist once deployed to Netlify (or when running
   `netlify dev`). Plain `vite dev` has no idea what "/api/*" means, so
   every call to it 404s and the frontend throws things like
   "Unexpected token '<', "<!doctype "... is not valid JSON" — which is
   exactly what looked like "AI assistant / disease detection / market
   price errors".

   This plugin closes that gap: it loads each Netlify function module and
   wires it up as real middleware inside Vite's own dev server, so
   `npm run dev` behaves the same as a real deployment (as long as the
   relevant API keys are present in `.env`).
   ═══════════════════════════════════════════════════════════ */

import path from "path";
import { pathToFileURL } from "url";

const ROUTES = {
  "/api/ai-assistant": "netlify/functions/ai-assistant.js",
  "/api/disease-detection": "netlify/functions/disease-detection.js",
  "/api/market-prices": "netlify/functions/market-prices.js",
  "/api/marketplace-images": "netlify/functions/marketplace-images.js",
};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

export function netlifyFunctionsDevPlugin() {
  return {
    name: "netlify-functions-dev",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = (req.url || "").split("?")[0];
        const relPath = ROUTES[pathname];
        if (!relPath) return next();

        try {
          const fileUrl = pathToFileURL(path.resolve(process.cwd(), relPath)).href;
          // Cache-bust so edits to the function file are picked up without restarting Vite
          const mod = await import(`${fileUrl}?t=${Date.now()}`);
          const handler = mod.handler || mod.default?.handler;
          if (typeof handler !== "function") {
            throw new Error(`No "handler" export found in ${relPath}`);
          }

          const url = new URL(req.url, "http://localhost");
          const queryStringParameters = Object.fromEntries(url.searchParams.entries());
          const body = req.method === "POST" ? await readRawBody(req) : null;

          const event = {
            httpMethod: req.method,
            path: pathname,
            queryStringParameters,
            headers: req.headers,
            body,
          };

          const result = await handler(event);
          res.statusCode = result.statusCode || 200;
          const headers = result.headers || {};
          for (const [key, value] of Object.entries(headers)) {
            res.setHeader(key, value);
          }
          res.end(result.body ?? "");
        } catch (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              configured: true,
              error: "Local dev API middleware failed",
              detail: err instanceof Error ? err.message : String(err),
            }),
          );
        }
      });
    },
  };
}
