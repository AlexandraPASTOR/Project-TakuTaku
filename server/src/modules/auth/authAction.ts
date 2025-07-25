import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import authRepository from "../auth/authRepository";

// Clé secrète pour signer les tokens et verifier leur authenticité (obligatoire pour la sécurité, à mettre dans .env ne doit pas être exposée)
const tokenKey = process.env.JWT_SECRET;
if (!tokenKey) {
  throw new Error("La clé secrète du token n'est pas définie dans le .env");
}

// Connexion d'un utilisateur
const signIn = async (request: Request, response: Response): Promise<any> => {
  // Récupération des données envoyées depuis le client via le formulaire et insertion dans le corps de la requête
  const { mail, password } = request.body;
  // Appel du repository pour vérifier si un utilisateur existe dans la base de donnees
  const user = await authRepository.signIn(mail);

  if (!user) {
    return response.status(401).send({ message: "Erreur d'authentification" });
  }

  // Vérifier le mot de passe
  const isPasswordValid = bcrypt.compareSync(password, user.password || "");

  // Si le mot de passe est incorrect, renvoyer une erreur 401
  if (!isPasswordValid) {
    return response.status(401).send({ message: "Mot de passe incorrect" });
  }

  // Si un user est trouvé, récupération du token de l'utilisateur
  const userId = user.id;
  const token = jwt.sign({ id: userId, is_admin: user.is_admin }, tokenKey);
  // Envoie au client un message de succes, le token dauthentification (JWT) et l'identifiant du nouvel utilisateur
  response
  .cookie("token", token, {
    httpOnly: true, // Le cookie est accessible uniquement par le serveur
    secure: true, 
    path: "/", // Le cookie est accessible sur tout le site
    sameSite: "none", // Le cookie est envoyé uniquement pour les requêtes du même site
    maxAge: 24 * 60 * 60 * 1000, // Durée de vie du cookie (1 jour)
  })
  .send({
    message: "Utilisateur connecté",
    user: {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      mail: user.mail,
      abonnement_id: user.abonnement_id,
      is_admin: Boolean(user.is_admin),
      is_actif: Boolean(user.is_actif),
    },
  });
};

// Inscription d'un utilisateur (sign up)
const signUp = async (request: Request, response: Response): Promise<any> => {
  // Récupération des données envoyées depuis le client via le formulaire et insertion dans le corps de la requête
  const {
    firstname,
    lastname,
    mail,
    password,
    abonnement_id,
    is_actif,
    is_admin,
  } = request.body;
  const passHash = bcrypt.hashSync(password, 8);

  const userId = await authRepository.signUp(
    firstname,
    lastname,
    mail,
    passHash,
    abonnement_id,
    is_admin,
    is_actif,
  );

  if (!userId) {
    return response
      .status(500)
      .send({ message: "Utilisateur créé mais non retrouvé" });
  }
  // Si un user est cree, un token lui est attribue qui permet de l'identifier lors des futures requetes
  const token = jwt.sign({ id: userId, is_admin : is_admin }, tokenKey);
  // Envoie au client un message de succees, le token dauthentification (JWT) et l'identifiant du nouvel utilisateur
  // Renvoyer tout l'objet user + token
  response
  .cookie("token", token, {
    httpOnly: true,
    secure: true,
    path: "/", // Le cookie est accessible sur tout le site
    sameSite: "none", // ✅ indispensable pour Vercel ↔ Render
    maxAge: 24 * 60 * 60 * 1000,
  })
  .send({
    message: "Utilisateur inscrit avec succès",
    userId,
  });

};

  // Deconnexion d'un utilisateur (sign out)
const signOut = async (_req: Request, res: Response): Promise<any> => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 0, // Supprimer le cookie en définissant sa durée de vie
    })
    .send({ message: "Déconnexion réussie" });
};

export default { signIn, signUp, signOut };
