import express from "express";
import type { ErrorRequestHandler } from "express";
import cors from "cors";
import router from "./router";
import fs from "node:fs";
import path from "node:path";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());

if (process.env.CLIENT_URL != null) {
  app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  }));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Pour les formulaires HTML
app.use(express.text());
app.use(express.raw());


app.use(router);


const publicFolderPath = path.join(__dirname, "../../server/public");
if (fs.existsSync(publicFolderPath)) {
  app.use(express.static(publicFolderPath));
}

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
