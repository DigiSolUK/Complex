import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cookieParser from "cookie-parser";
import session from "express-session";
import { storage } from "./storage";
import { auth } from "./auth";

const app = express();

// Make storage available to the entire application
app.set('storage', storage);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SESSION_SECRET || "complex-care-secret"));

// Set trust proxy - essential for secure cookies to work in Replit environment
// Support both proxied and direct requests
app.set("trust proxy", 1);

// Configure express-session with appropriate settings for Replit environment
app.use(session({
  secret: process.env.SESSION_SECRET || 'complex-care-secret',
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  },
  resave: false,
  saveUninitialized: false,
  store: storage.sessionStore,
  name: 'complexcare.sid'
}));

// Log request protocol for debugging and set secure cookie flags
app.use((req, res, next) => {
  // Log the request protocol information
  console.log(`Request protocol: ${req.protocol}, secure: ${req.secure}, originalUrl: ${req.originalUrl}`);
  console.log(`x-forwarded-proto: ${req.headers['x-forwarded-proto']}`);
  
  // Add a custom property to the request to indicate protocol confidence
  (req as any).isSecureConnection = req.secure || req.headers['x-forwarded-proto'] === 'https';
  
  console.log(`isSecureConnection set to: ${(req as any).isSecureConnection}`);
  next();
});

// Log all requests for better debugging
app.use((req, res, next) => {
  console.log(`\n[REQUEST] ${req.method} ${req.url}`);
  console.log(`Cookie Headers: ${req.headers.cookie}`);
  // Session data will be logged after it's set by the authentication middleware
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
