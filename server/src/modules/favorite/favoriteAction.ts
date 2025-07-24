import type { RequestHandler } from "express";
import favoriteRepository from "./favoriteRepository";

type Favorite = {
  id?: number;
  user_id: number;
  anime_id: number;
};


// Le B du BREAD - Browse (ReadAll) : Lister tous les favoris d'un utilisateur
const browse: RequestHandler = async (req, res, next) => {
  try {
    const user_id = Number(req.params.user_id);
    const favori = await favoriteRepository.readAll(user_id);
    if (favori.length === 0) {
      res.sendStatus(404); // Si aucun favori n'est trouvé, renvoie un statut 404
    } else if (user_id !== req.user?.id && !req.user?.is_admin) {
      res.status(403).json({ message: "Accès interdit" }); // Si l'utilisateur n'est pas l'utilisateur connecté ou un admin, on renvoie un statut 403
} else {
      res.json(favori); // Sinon, renvoie la liste des favoris au format JSON
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le R du BREAD - Read : Lire un favori spécifique par l'ID de l'utilisateur et l'ID de l'anime
const read: RequestHandler = async (req, res, next) => {
  try {
    const user_id = Number(req.params.user_id);
    const anime_id = Number(req.params.anime_id);
    const favori = await favoriteRepository.read(user_id, anime_id);
    if (!favori) {
      res.sendStatus(404); // Si le favori n'est pas trouvé, renvoie un statut 404
    } else if (user_id !== req.user?.id && !req.user?.is_admin) {
      res.status(403).json({ message: "Accès interdit" }); // Si l'utilisateur n'est pas l'utilisateur connecté ou un admin, on renvoie un statut 403
    } else {
      res.json(favori); // Sinon, renvoie le favori au format JSON
    }
  } catch (error) {
    next(error); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le A du BREAD - Add : Création d'un nouveau favori
const add: RequestHandler = async (req, res, next) => {
  try {
    const newFavori: Favorite = {
      user_id: req.body.user_id,
      anime_id: req.body.anime_id,
    };
    const insertFavorite = await favoriteRepository.create(newFavori);
    if (!insertFavorite) {
      res.sendStatus(400); // Si l'insertion échoue, renvoie un statut 400
    } else {
    res.status(201).json({ insertFavorite }); // Sinon, renvoie l'ID du nouveau favori créé
  }
 } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le D du BREAD - Destroy : Supprimer un favori spécifique par l'ID de l'utilisateur et l'ID de l'anime
const destroy: RequestHandler = async (req, res, next) => {
  try {
    const user_id = Number(req.params.user_id);
    const anime_id = Number(req.params.anime_id);
    const affectedRows = await favoriteRepository.delete(user_id, anime_id);
    if (!affectedRows) {
      res.sendStatus(404); // Si le favori n'est pas trouvé, renvoie un statut 404
    } else {
      res.sendStatus(204); // Si la suppression est réussie, renvoie un statut 204 (Aucun contenu)
    }
  } catch (error) {
    next(error); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

export default { browse, read, add, destroy };
