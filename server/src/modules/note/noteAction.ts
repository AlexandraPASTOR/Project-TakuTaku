import type { RequestHandler } from "express";
import noteRepository from "./noteRepository";

interface Note {
  id: number;
  note: number;
  user_id: number; 
  anime_id: number; 
}

// Le B du BREAD - Browse (ReadAll) : Lister toutes les notes
const browse: RequestHandler = async (_req, res, next) => {
  try {
    const notes = await noteRepository.readAll();
    if (notes.length === 0) {
      res.sendStatus(404); // Si aucune note n'est trouvée, renvoie un statut 404
    } else {
      res.json(notes); // Sinon, renvoie la liste des notes au format JSON
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le R du BREAD - Read : Lire la note moyenne d'un anime
const readAverage: RequestHandler = async (req, res, next) => {
  try {
    const anime_id = Number(req.params.anime_id);
    const averageNote = await noteRepository.read(anime_id);
    if (averageNote == null) {
      res.sendStatus(404); // Si aucune note moyenne n'est trouvée, renvoie un statut 404
    } else {
      res.json(averageNote); // Sinon, renvoie la note moyenne au format JSON
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le E de BREAD - Edit : Mettre à jour une note spécifique par son ID
const edit: RequestHandler = async (req, res, next) => {
  try {
    const note: Note = {
      id: Number(req.params.id),
      note: Number(req.body.note),
      anime_id: Number(req.params.anime_id),
      user_id: Number(req.params.user_id),
    };
    const affectedRows = await noteRepository.update(note);
    if (affectedRows === 0) {
      res.sendStatus(404); // Si aucune note n'est mise à jour, renvoie un statut 404
    }  else if (note.user_id !== req.user?.id && !req.user?.is_admin) {
      res.status(403).json({ message: "Accès interdit" }); // Si l'utilisateur n'est pas l'utilisateur connecté ou un admin, on renvoie un statut 403
    }  else {
      res.json(note); // Sinon, renvoie la note mise à jour au format JSON
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    const newNote: Omit<Note, "id"> = {
      note: req.body.note,
      user_id: req.body.user_id,
      anime_id: req.body.anime_id,
    };
    const insertId = await noteRepository.create(newNote);
if (insertId === 0) {
      res.sendStatus(404); // Si aucune note n'est insérée, renvoie un statut 404
    } else {
    res.status(201).json({ insertId }); // Sinon, renvoie l'ID de la nouvelle note insérée
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le D du BREAD - Destroy : Supprimer une note spécifique par son anime_id et user_id
const destroy: RequestHandler = async (req, res, next) => {
  try {
    const anime_id = Number(req.params.anime_id);
    const user_id = Number(req.params.user_id);
    const affectedRows = await noteRepository.delete(anime_id, user_id);
    if (affectedRows === 0) {
      res.sendStatus(404); // Si aucune note n'est supprimée, renvoie un statut 404
    }  else if (user_id !== req.user?.id && !req.user?.is_admin) {
      res.status(403).json({ message: "Accès interdit" }); // Si l'utilisateur n'est pas l'utilisateur connecté ou un admin, on renvoie un statut 403
    } else {
      res.sendStatus(204); // Sinon, renvoie un statut 204 (Aucun Contenu) pour indiquer que la suppression a réussi
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Pour lire la note d'un utilisateur
const readUserNote: RequestHandler = async (req, res, next) => {
  try {
    const anime_id = Number(req.params.anime_id);
    const user_id = Number(req.params.user_id);
    const userNote = await noteRepository.readUserNote(anime_id, user_id);
    if (userNote == null) {
      res.status(200).json("Vous n'avez pas encore noté cet animé"); // Si l'utilisateur n'a pas noté l'anime, renvoie un message
    }  else if (user_id !== req.user?.id && !req.user?.is_admin) {
      res.status(403).json({ message: "Accès interdit" }); // Si l'utilisateur n'est pas l'utilisateur connecté ou un admin, on renvoie un statut 403
    } else {
      res.json(userNote); // Sinon, renvoie la note de l'utilisateur pour l'anime spécifique
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

export default {
  browse,
  readAverage,
  add,
  edit,
  destroy,
  readUserNote,
};
