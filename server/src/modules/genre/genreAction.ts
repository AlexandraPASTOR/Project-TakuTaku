import type { RequestHandler } from "express";
import genreRepository from "./genreRepository";

type Genre = {
  id: number;
  name: string;
};

// Le B du BREAD - Browse (ReadAll) : Lister tous les genres
const browse: RequestHandler = async (req, res, next) => {
  try {
    const genres = await genreRepository.readAll(); 
    if (genres.length === 0) {
      res.sendStatus(404); // Si aucun genre n'est trouvé, renvoie un statut 404
    } else {
      res.json(genres); // Sinon, renvoie la liste des genres au format JSON
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le R du BREAD - Read : Lire un genre spécifique par son ID
const read: RequestHandler = async (req, res, next) => {
  try {
    const genreId = Number(req.params.id);
    const genre = await genreRepository.read(genreId);
    if (genre == null) {
      res.sendStatus(404); // Si le genre n'est pas trouvé, renvoie un statut 404
    } else {
      res.json(genre); // Sinon, renvoie le genre au format JSON
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le E de BREAD - Edit : Mettre à jour un genre spécifique par son ID
const edit: RequestHandler = async (req, res, next) => {
  try {
    const genre: Genre = {
      id: Number(req.params.id),
      name: req.body.name,
    };
    const affectedRows = await genreRepository.update(genre);
    if (affectedRows === 0) {
      res.sendStatus(404); // Si aucune ligne n'est affectée, renvoie un statut 404
    } else {
      res.sendStatus(204); // Si la mise à jour réussit, renvoie un statut 204 (Aucun contenu)
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// The A of BREAD - Add : Creation d'un nouveau genre
const add: RequestHandler = async (req, res, next) => {
  try {
    const newGenre: Omit<Genre, "id"> = {
      name: req.body.name,
    };
    const insertId = await genreRepository.create(newGenre);
    if (insertId === 0) {
      res.sendStatus(400); // Si l'insertion échoue, renvoie un statut 400 (Mauvaise requête)
    } else {
      res.status(201).json({ insertId }); // Si l'insertion réussit, renvoie le nouvel ID du genre créé
  }
 } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le D de Destroy - Destroy : Supprimer un genre spécifique par son ID
const destroy: RequestHandler = async (req, res, next) => {
  try {
    const genreId = Number(req.params.id);
    await genreRepository.delete(genreId);
if (genreId === 0) {
      res.sendStatus(404); // Si le genre n'est pas trouvé, renvoie un statut 404
    } else {
    res.sendStatus(204); // Si la suppression réussit, renvoie un statut 204 (Aucun contenu)
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

export default { browse, read, add, destroy, edit };
