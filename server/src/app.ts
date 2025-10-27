import express from "express";
import type { ErrorRequestHandler } from "express";
import cors from "cors";
import router from "./router";
import fs from "node:fs";
import path from "node:path";
import cookieParser from "cookie-parser";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

// Initialisation de l'application Express
const app = express();

// ✅ CORS GLOBAL, tout en haut avant cookieParser, router, etc.
app.use(((req, res, next) => {
   console.log("✅ CORS middleware ACTIF");
  const allowedOrigin = process.env.CLIENT_URL!;
  
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  // ✅ Fix pour Cloudflare/Render
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    console.log("🛰️ Preflight OPTIONS OK");
    return res.sendStatus(204);
  }

  next();
}) as express.RequestHandler);

// Middleware pour parser les cookies
app.use(cookieParser());

// Middleware pour accepter différents types de requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(express.raw());

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api", (_, res) => {
  res.json({ message: "Bienvenue sur l'API TakuTaku !" });
});

// Router pour gérer les routes de l'application
app.use(router);

// Middleware pour servir les fichiers statiques
const publicFolderPath = path.join(__dirname, "../../server/public");
if (fs.existsSync(publicFolderPath)) {
  app.use(express.static(publicFolderPath));
}

// Middleware pour servir les fichiers du client
const clientBuildPath = path.join(__dirname, "../../client/dist");
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get("*", (_, res) => {
    res.sendFile("index.html", { root: clientBuildPath });
  });
}

// Middleware pour gérer les erreurs
const logErrors: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  console.error("on req:", req.method, req.path);
  next(err);
};

app.use(logErrors);

export default app;
