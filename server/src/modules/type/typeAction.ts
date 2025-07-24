import type { RequestHandler } from "express";
import typeRepository from "./typeRepository";

interface Type {
  id: number;
  name: string;
}

// Le B du BREAD - Browse (Read All) : Lister tous les types
const browse: RequestHandler = async (req, res, next) => {
  try {
    const types = await typeRepository.readAll();
    if (types.length === 0) {
      res.sendStatus(404); // Si aucun type n'est trouvé, renvoie un statut 404
    } else {
      res.json(types); // Sinon, renvoie la liste des types au format JSON
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le R du BREAD - Read : Lire un type spécifique par son ID
const read: RequestHandler = async (req, res, next) => {
  try {
    const typeId = Number(req.params.id);
    const type = await typeRepository.read(typeId);
    if (type == null) {
      res.sendStatus(404); // Si le type n'est pas trouvé, renvoie un statut 404
    } else {
      res.json(type); // Sinon, renvoie le type au format JSON
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le E de BREAD - Edit : Mettre à jour un type spécifique par son ID
const edit: RequestHandler = async (req, res, next) => {
  try {
    const type: Type = {
      id: Number(req.params.id),
      name: req.body.name,
    };
    const affectedRows = await typeRepository.update(type);
    if (affectedRows === 0) {
      res.sendStatus(404); // Si aucune ligne n'est affectée, renvoie un statut 404
    } else {
      res.sendStatus(204); // Sinon, renvoie un statut 204 (Aucun contenu)
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// The A of BREAD - Add : Creation d'un nouveau type
const add: RequestHandler = async (req, res, next) => {
  try {
    const newType: Omit<Type, "id"> = {
      name: req.body.name,
    };
    const insertId = await typeRepository.create(newType);
    if (insertId === 0) {
      res.sendStatus(400); // Si l'insertion échoue, renvoie un statut 400
    } else {
      res.status(201).json({ id: insertId }); // Sinon, renvoie le nouvel ID avec un statut 201
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le D de BREAD - Destroy : Supprimer un type spécifique par son ID
const destroy: RequestHandler = async (req, res, next) => {
  try {
    const typeId = Number(req.params.id);
    await typeRepository.delete(typeId);
if (typeId === 0) {
      res.sendStatus(404); // Si le type n'est pas trouvé, renvoie un statut 404
    } else {
      res.sendStatus(204); // Sinon, renvoie un statut 204 (Aucun contenu)
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

export default { browse, read, add, destroy, edit };
