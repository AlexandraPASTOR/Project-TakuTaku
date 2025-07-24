import type { RequestHandler } from "express";
import historyRepository from "./historyRepository";

interface History {
  id: number;
  user_id: number;
  anime_id: number;
}

// Lire l'historique d'un utilisateur
const readUserHistory: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const histories = await historyRepository.readUserHistory(userId);
    if (histories.length === 0) {
      res.status(404).json({ message: "Aucun historique trouvé pour cet utilisateur." });
      return;
    }
    else if (userId !== req.user?.id && !req.user?.is_admin) {
      res.status(403).json({ message: "Accès interdit" }); // Si l'utilisateur n'est pas l'utilisateur connecté ou un admin, on renvoie un statut 403
    } else {
      res.json(histories); // Retourne l'historique des animés de l'utilisateur
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Ajouter un animé à l'historique d'un utilisateur
const add: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.body.userId);
    const animeId = Number(req.body.animeId);
    const history: Omit<History, "id"> = {
      user_id: userId,
      anime_id: animeId,
    };
    const result = await historyRepository.create(history);
      res.status(200).json(result); // Retourne l'historique mis à jour
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

export default {
  readUserHistory,
  add,
};

