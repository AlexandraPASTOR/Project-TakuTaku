import type { RequestHandler } from "express";
import userRepository from "./userRepository";
import type { Request } from "express";

// Extension du typage Request pour inclure l'utilisateur connecté et son rôle
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        is_admin: boolean;
      };
    }
  }
}

interface User {
  id: number;
  firstname: string;
  lastname: string;
  mail: string;
  password: string;
  is_admin: boolean;
  is_actif: boolean;
  abonnement_id: number;
  profilpicture_id: number;
}

//Le B DU Bread - Browse (ReadAll) : Lire tous les utilisateurs
const browse: RequestHandler = async (req, res, next) => {
  try {
    const user = await userRepository.readAll();
    if (user.length === 0) {
      res.sendStatus(404); // Si aucun utilisateur n'est trouvé, on renvoie un statut 404
    } else {
      res.json(user); // Sinon, on renvoie les utilisateurs au format JSON
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le R du BREAD - ReadConnectedUser : Lire l'utilisateur connecté
const readConnectedUser: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id; // On récupère l'ID de l'utilisateur connecté
    if (typeof userId !== "number") {
      res.sendStatus(400); // Si l'ID n'est pas défini, on renvoie un statut 400
      return;
    }
    const user = await userRepository.read(userId);
    if (user == null) {
      res.sendStatus(404); // Si l'utilisateur n'est pas trouvé, on renvoie un statut 404
    } else {
      const { password, ...userWithoutPassword } = user; // On exclut le mot de passe de la réponse
      res.json(userWithoutPassword); // On renvoie l'utilisateur sans le mot de passe
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le R du BREAD - Read : Lire un utilisateur par son ID
const read: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const user = await userRepository.read(userId);
    if (user == null) {
      res.sendStatus(404); // Si l'utilisateur n'est pas trouvé, on renvoie un statut 404
    } else if (user.id !== req.user?.id && !req.user?.is_admin) {
      res.status(403).json({ message: "Accès interdit" }); // Si l'utilisateur n'est pas l'utilisateur connecté ou un admin, on renvoie un statut 403
    } else {
      res.json(user); // Sinon, on renvoie l'utilisateur au format JSON
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le E du BREAD - Edit : Mettre à jour un utilisateur par son ID
const edit: RequestHandler = async (req, res, next) => {
  try {
    const user: Omit<User, "password"> = {
      id: Number(req.params.id),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      mail: req.body.mail,
      is_admin: req.body.is_admin,
      is_actif: req.body.is_actif,
      abonnement_id: req.body.abonnement_id,
      profilpicture_id: req.body.profilpicture_id,
    };
    const affectedRows = await userRepository.update(user);
    if (affectedRows === 0) {
      res.sendStatus(404); // Si l'utilisateur n'est pas trouvé, on renvoie un statut 404
    } else if (user.id !== req.user?.id && !req.user?.is_admin) {
      res.status(403).json({ message: "Accès interdit" }); // Si l'utilisateur n'est pas l'utilisateur connecté ou un admin, on renvoie un statut 403
    } else {
      res.json(user); // Sinon, on renvoie l'utilisateur mis à jour au format JSON
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le A de BREAD - Add : Ajouter un nouvel utilisateur
const add: RequestHandler = async (req, res, next) => {
  try {
    const newUser: Omit<User, "id"> = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      mail: req.body.mail,
      password: req.body.password,
      is_admin: req.body.is_admin,
      is_actif: req.body.is_actif,
      abonnement_id: req.body.abonnement_id,
      profilpicture_id: req.body.profilpicture_id,
    };
    const insertId = await userRepository.create(newUser);
if (insertId === 0) {
      res.sendStatus(400); // Si l'insertion échoue, on renvoie un statut 400
      return;
    } else {
    res.status(201).json({ insertId }); // Sinon, on renvoie l'ID du nouvel utilisateur créé avec un statut 201
  }
 } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le D de BREAD - Destroy : Supprimer un utilisateur par son ID
const destroy: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    await userRepository.delete(userId);
if (userId === 0) {
      res.sendStatus(404); // Si l'utilisateur n'est pas trouvé, on renvoie un statut 404
} else if (userId !== req.user?.id && !req.user?.is_admin) {
      res.status(403).json({ message: "Accès interdit" }); // Si l'utilisateur n'est pas l'utilisateur connecté ou un admin, on renvoie un statut 403
} else {
    res.sendStatus(204); // Sinon, on renvoie un statut 204 pour indiquer que la suppression a réussi
  }
 } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Lire TOUS les users avec le type d'abonnement en plus
const readUsersWithAbonnement: RequestHandler = async (req, res, next) => {
  try {
    const users = await userRepository.readAllWithAbonnement();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export default {
  browse,
  read,
  readConnectedUser,
  edit,
  add,
  destroy,
  readUsersWithAbonnement,
};
