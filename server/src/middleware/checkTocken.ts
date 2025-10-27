import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";

interface JwtPayload extends DefaultJwtPayload {
  id: number;
  is_admin: boolean;
}

const allowCors = (res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL!);
  res.setHeader("Access-Control-Allow-Credentials", "true");
};

//Middleware qui protège une route on vérifie si le token a été envoyé par le client et s'il est valide (il reçoit tous les objets req,res,next)
export const checkToken = async (req: Request, res: Response, next: NextFunction): Promise<void>  => {
  const token = req.cookies.token; // on récupère le token dans le cookie

  if (!token) {
    allowCors(res);
    res.status(401).send({ message: "Accès non autorisé : Token manquant" });
    return;
  } 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    if (!decoded || !decoded.id) {
      allowCors(res);
      console.error("Erreur de vérification du token");
      res.status(401).send({ message: "Token invalide" });
      return;
    } //Grâce a verify on vérifie si le token est unique (fonctionnalité native de JWT) pour ça on lui donne : le token et la clé secrète
req.user = decoded;
    next();
  } catch (err) {
    console.error("Erreur de vérification du token :", err);
    allowCors(res);
    res.status(401).send({ message: "Token invalide" });
  }
};