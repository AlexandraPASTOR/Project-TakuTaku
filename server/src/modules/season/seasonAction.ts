import type { RequestHandler } from "express";
import seasonRepository from "./seasonRepository";

interface Season {
  id: number;
  number: number;
  anime_id: number;
}

// Le B du BREAD - Browse (ReadAll) : Lister toutes les saisons
const browse: RequestHandler = async (req, res, next) => {
  try {
    const seasons = await seasonRepository.readAll();
    if (seasons.length === 0) {
      res.sendStatus(404); // Si aucune saison n'est trouvée, renvoie un statut 404
    } else {
      res.json(seasons); // Sinon, renvoie la liste des saisons au format JSON
    }
  } catch (error) {
    next(error); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le R du BREAD - Read : Lire une saison spécifique par son ID
const read: RequestHandler = async (req, res, next) => {
  try {
    const seasonId = Number(req.params.id); 
    const season = await seasonRepository.read(seasonId); 
    if (season == null) {
      res.sendStatus(404); // Si la saison n'est pas trouvée, renvoie un statut 404
    } else {
      res.json(season); // Sinon, renvoie la saison au format JSON
    }
  } catch (error) {
    next(error); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le E du BREAD - Edit : Mettre à jour une saison spécifique par son ID
const edit: RequestHandler = async (req, res, next) => {
  try {
    const season: Season = {
      id: Number(req.params.id),
      number: req.body.number,
      anime_id: req.body.anime_id,
    };
    const affectedRows = await seasonRepository.update(season);
    if (!affectedRows) {
      res.sendStatus(404); // Si aucune saison n'est affectée, renvoie un statut 404
    } else {
      res.sendStatus(204); // Renvoie un statut 204 (Aucun Contenu) pour indiquer que la mise à jour a réussi
    }
  } catch (error) {
    next(error); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le A du BREAD - Add : Ajouter une nouvelle saison
const add: RequestHandler = async (req, res, next) => {
  try {
    const newSeason: Omit<Season, "id"> = {
      number: req.body.number,
      anime_id: req.body.anime_id,
    };
    const insertId = await seasonRepository.create(newSeason);
if (!insertId) {
      res.sendStatus(400); // Si l'insertion échoue, renvoie un statut 400
    } else {
    res.status(201).json({ insertId }); // Renvoie l'ID de la nouvelle saison créée
    }
  } catch (error) {
    next(error); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le D du BREAD - Destroy : Supprimer une saison par son ID
const destroy: RequestHandler = async (req, res, next) => {
  try {
    const seasonId = Number(req.params.id);
    await seasonRepository.delete(seasonId);
    if (!seasonId) {
      res.sendStatus(404); // Si la saison n'est pas trouvée, renvoie un statut 404
    }
    else {
    res.sendStatus(204); // Renvoie un statut 204 (Aucun Contenu) pour indiquer que la suppression a réussi
  } 
} catch (error) {
    next(error); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

export default { browse, read, add, edit, destroy };
