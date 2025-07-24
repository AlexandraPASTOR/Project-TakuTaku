import type { RequestHandler } from "express";
import animeRepository from "./animeRepository";

type Anime = {
  id: number;
  title: string;
  synopsis: string;
  portrait: string;
  date: number;
  landscape: string;
  video: string;
  genre_id: number;
  genre_name?: string;
  types?: { id: number; name: string }[];
  note?: number;
};


// Le B du BREAD - Browse (ReadAll) : Lister tous les animés
const browse: RequestHandler = async (req, res, next) => {
  try {
    const animes = await animeRepository.readAll();
    if (animes.length === 0) {
      res.sendStatus(404); // Si aucun animé n'est trouvé, renvoie un statut 404
    } else {
      res.json(animes); // Sinon, renvoie la liste des animés au format JSON
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le R du BREAD - Read : Lire un animé spécifique par son ID
const read: RequestHandler = async (req, res, next) => {
  try {
    const animeId = Number(req.params.id);
    const anime = await animeRepository.read(animeId);
    if (anime == null) {
      res.sendStatus(404); // Si l'animé n'est pas trouvé, renvoie un statut 404
    } else {
      res.json(anime); // Sinon, renvoie l'animé au format JSON
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le E du BREAD - Edit : Mettre à jour un animé spécifique par son ID
const edit: RequestHandler = async (req, res, next) => {
  try {
    const anime: Anime = {
      id: Number(req.params.id),
      title: req.body.title,
      synopsis: req.body.synopsis,
      portrait: req.body.portrait,
      date: req.body.date,
      landscape: req.body.landscape,
      video: req.body.video,
      genre_name: req.body.genre_name,
      genre_id: req.body.genre_id,
    };
    const affectedRows = await animeRepository.update(anime);
    if (affectedRows === 0) {
      res.sendStatus(404); // Si l'animé n'est pas trouvé, renvoie un statut 404
    } else {
      res.sendStatus(204); // Sinon, renvoie un statut 204 (Aucune Contenu) pour indiquer que la mise à jour a réussi
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// The A du BREAD - Add : Creation d'un nouvel animé
const add: RequestHandler = async (req, res, next) => {
  try {
    const newAnime: Omit<Anime, "id"> = {
      title: req.body.title,
      synopsis: req.body.synopsis,
      portrait: req.body.portrait,
      date: req.body.date,
      landscape: req.body.landscape,
      video: req.body.video,
      genre_name: req.body.genre_name,
      genre_id: Number(req.body.genre_id),
    };
    const insertId = await animeRepository.create(newAnime);
    if (insertId === 0) {
      res.sendStatus(400); // Si l'insertion échoue, renvoie un statut 400 (Mauvaise requête)
    } else {
      res.status(201).json({ insertId }); // Si l'insertion réussit, renvoie le nouvel ID de l'animé créé
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le D du BREAD - Destroy : Supprimer un animé spécifique par son ID
const destroy: RequestHandler = async (req, res, next) => {
  try {
    const animeId = Number(req.params.id);
    await animeRepository.delete(animeId);
if (animeId === 0) {
      res.sendStatus(404); // Si l'animé n'est pas trouvé, renvoie un statut 404
    }
    res.sendStatus(204); // Si la suppression est réussie, renvoie un statut 204 (Aucun contenu)
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Lire tous les animés filtrés par genre et type
const browseFiltered: RequestHandler = async (req, res, next) => {
  try {
    const { genre, type } = req.params;
    const animes = await animeRepository.readAllFiltered(genre, type);
    if (animes.length === 0) {
      res.status(404).json({ message: "Aucun animé trouvé selon les critères de recherche." }); // Si aucun animé n'est trouvé, renvoie un statut 404
    } else {
      res.json(animes); // Sinon, renvoie la liste des animés filtrés au format JSON
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Lire TOUS les animés avec le genre en plus
const browseWithGenre: RequestHandler = async (req, res, next) => {
  try {
    const animes = await animeRepository.readAllWithGenre();
    if (animes.length === 0) {
      res.sendStatus(404); // Si aucun animé n'est trouvé, renvoie un statut 404
    }
    else {
    res.json(animes); // Sinon, renvoie la liste des animés avec le genre au format JSON
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Lire TOUS les animés avec la note en plus
const browseWithNote: RequestHandler = async (req, res, next) => {
  try {
    const animes = await animeRepository.readAllWithNote();
    if (animes.length === 0) {
      res.sendStatus(404); // Si aucun animé n'est trouvé, renvoie un statut 404
    } else {
      res.json(animes); // Sinon, renvoie la liste des animés avec la note au format JSON
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

export default {
  browse,
  read,
  add,
  destroy,
  edit,
  browseWithGenre,
  browseFiltered,
  browseWithNote,
};
