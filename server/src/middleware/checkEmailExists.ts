import type { NextFunction, Request, Response } from "express";
import authRepository from "../modules/auth/authRepository";

export const checkEmailExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { mail } = req.body;

    // Toujours ajouter les headers CORS sur les retours immédiats
  const addCorsHeaders = () => {
    res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL!);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  };

  if (!mail) {
    addCorsHeaders();
    res.status(400).send({ message: "Adresse e-mail requise" });
    return;
  }
  try {
    const checkEmail = await authRepository.findByEmail(mail);
    if (checkEmail) {
      addCorsHeaders();
      res.status(409).send({ message: "Adresse e-mail déjà existante" });
      return;
    }
    next();
  } catch (error) {
    addCorsHeaders();
    console.error("Erreur lors de la vérification de l'adresse e-mail", error);
    res.status(500).send({ message: "Erreur interne du serveur" });
  }
};
