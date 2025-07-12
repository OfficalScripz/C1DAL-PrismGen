import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    console.log(`⚠️  Build directory not found: ${distPath}`);
    console.log("Serving basic HTML instead...");
    
    // Serve a basic HTML page if build directory doesn't exist
    app.use("*", (_req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Discord Key Bot Dashboard</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; background: #1a1a1a; color: white; }
              .container { max-width: 600px; margin: 0 auto; text-align: center; }
              .status { background: #2d2d2d; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .success { color: #4ade80; }
              .warning { color: #facc15; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Discord Key Bot Dashboard</h1>
              <div class="status">
                <h2 class="success">✅ Service is Running</h2>
                <p>The Discord Key Bot Dashboard service is successfully deployed and running on Render.</p>
              </div>
              <div class="status">
                <h3 class="warning">⚠️ Frontend Build Missing</h3>
                <p>The frontend build files are not available. The service is running but the dashboard UI needs to be built.</p>
              </div>
              <div class="status">
                <h3>🔧 Service Status</h3>
                <p>Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}</p>
                <p>Discord Bot: ${process.env.DISCORD_TOKEN ? 'Configured' : 'Not configured'}</p>
                <p>Timestamp: ${new Date().toISOString()}</p>
              </div>
            </div>
          </body>
        </html>
      `);
    });
    return;
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
