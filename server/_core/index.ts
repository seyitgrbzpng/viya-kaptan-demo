import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  // Trust proxy headers (needed for secure cookies behind Render/Cloudflare etc.)
  app.set("trust proxy", 1);

  // CORS (allow any origin dynamically to support separate frontend hosting on Hostinger)
  app.use(cors({
    origin: function (origin, callback) {
      callback(null, origin || true);
    },
    credentials: true,
  }));

  // Health check
  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Simple admin login (username/password from env)
  app.post("/api/admin-login", async (req, res) => {
    const { username, password } = req.body || {};
    const adminUser = process.env.ADMIN_USERNAME || "admin";
    const adminPass = process.env.ADMIN_PASSWORD || "admin123";

    if (username !== adminUser || password !== adminPass) {
      return res.status(401).json({ error: "Geçersiz kullanıcı adı veya şifre" });
    }

    try {
      const { sdk } = await import("./sdk");
      const { COOKIE_NAME, ONE_YEAR_MS } = await import("@shared/const");
      const { getSessionCookieOptions } = await import("./cookies");
      const db = await import("../db");

      const openId = process.env.OWNER_OPEN_ID || "admin@localhost.dev";

      // Upsert admin user in DB
      await db.upsertUser({
        openId,
        name: "Admin",
        email: openId,
        role: "admin",
        lastSignedIn: new Date(),
      });

      // Create session token
      const sessionToken = await sdk.createSessionToken(openId, {
        name: "Admin",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      return res.json({ success: true });
    } catch (error) {
      console.error("[Admin Login] Error:", error);
      return res.status(500).json({ error: "Giriş işlemi başarısız" });
    }
  });

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    // In production, this service is typically API-only (frontend is hosted separately).
    // If you want this server to also serve the built frontend, set SERVE_STATIC=true and ensure assets exist.
    if (process.env.SERVE_STATIC === "true") {
      serveStatic(app);
    }
  }

  // Render/hosting platforms require listening on the exact PORT they provide.
  const port = parseInt(process.env.PORT || "3000", 10);

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch(console.error);
