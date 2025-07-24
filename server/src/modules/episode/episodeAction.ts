import type { RequestHandler } from "express";
import episodeRepository from "./episodeRepository";

type Episode = {
  id: number;
  number: number;
  title: string;
  synopsis: string;
  season_id: number;
};

// Le B du BREAD - Browse (ReadAll) : Lister tous les épisodes
const browse: RequestHandler = async (req, res, next) => {
  try {
    const episodes = await episodeRepository.readAll();
    if (episodes.length === 0) {
      res.sendStatus(404); // Si aucun épisode n'est trouvé, renvoie un statut 404
    } else {
      res.json(episodes); // Sinon, renvoie la liste des épisodes au format JSON
  }
} catch (error) {
    next(error); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le R du BREAD - Read : Lire un épisode spécifique par son ID
const read: RequestHandler = async (req, res, next) => {
  try {
    const episodeId = Number(req.params.id);
    const episode = await episodeRepository.read(episodeId);
    if (episode == null) {
      res.sendStatus(404); // Si l'épisode n'est pas trouvé, renvoie un statut 404
    } else {
      res.json(episode); // Sinon, renvoie l'épisode au format JSON
    }
  } catch (error) {
    next(error); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le E du BREAD - Edit : Mettre à jour un épisode spécifique par son ID
const edit: RequestHandler = async (req, res, next) => {
  try {
    const episode: Episode = {
      id: Number(req.params.id),
      number: req.body.number,
      title: req.body.title,
      synopsis: req.body.synopsis,
      season_id: req.body.season_id,
    };
    const affectedRows = await episodeRepository.update(episode);
    if (!affectedRows) {
      res.sendStatus(404); // Si l'épisode n'est pas trouvé, renvoie un statut 404
    } else {
      res.sendStatus(204); // Sinon, renvoie un statut 204 (Aucune Contenu) pour indiquer que la mise à jour a réussi
    }
  } catch (error) {
    next(error); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le A du BREAD - Add : Création d'un nouvel épisode
const add: RequestHandler = async (req, res, next) => {
  try {
    const newepisode: Omit<Episode, "id"> = {
      number: req.body.number,
      title: req.body.title,
      synopsis: req.body.synopsis,
      season_id: req.body.season_id,
    };
    const insertId = await episodeRepository.create(newepisode);
if (!insertId) {
      res.sendStatus(400); // Si l'insertion échoue, renvoie un statut 400 (Mauvaise Requête)
    } else {
    res.status(201).json({ insertId }); // Si l'insertion réussit, renvoie l'ID de l'épisode créé
    }
  } catch (error) {
    next(error); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le D du BREAD - Destroy : Supprimer un épisode spécifique par son ID
const destroy: RequestHandler = async (req, res, next) => {
  try {
    const episodeId = Number(req.params.id);
    const affectedRows = await episodeRepository.delete(episodeId);
    if (!affectedRows) {
      res.sendStatus(404); // Si aucun épisode n'est trouvé, renvoie un statut 404 (Non trouvé)
    } else {
      res.sendStatus(204); // Sinon, renvoie un statut 204 (Aucune Contenu) pour indiquer que la suppression a réussi
    }
  } catch (error) {
    next(error); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

export default { browse, read, add, edit, destroy };
