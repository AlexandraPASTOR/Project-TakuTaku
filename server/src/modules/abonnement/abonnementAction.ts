import type { RequestHandler } from "express";
import AbonnementRepository from "./abonnementRepository";

type AbonnementName = "découverte" | "premium";

type Abonnement = {
  id: number;
  name: AbonnementName;
};

// Le B du BREAD - Browse (ReadAll) : Lister tous les abonnements
const browse: RequestHandler = async (req, res, next) => {
  try {
    const abonnements = await AbonnementRepository.readAll();
    if (abonnements.length === 0) {
      res.sendStatus(404); // Si aucun abonnement n'est trouvé, renvoie un statut 404
    } else {
      res.json(abonnements); // Sinon, renvoie la liste des abonnements au format JSON
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le R du BREAD - Read : Lire un abonnement spécifique par son ID
const read: RequestHandler = async (req, res, next) => {
  try {
    const abonnementId = Number(req.params.id);
    const abonnement = await AbonnementRepository.read(abonnementId);
    if (abonnement == null) {
      res.sendStatus(404); // Si l'abonnement n'est pas trouvé, renvoie un statut 404
    } else {
      res.json(abonnement); // Sinon, renvoie l'abonnement au format JSON
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le E du BREAD - Edit : Mettre à jour un abonnement spécifique par son ID
const edit: RequestHandler = async (req, res, next) => {
  try {
    const abonnement: Abonnement = {
      id: Number(req.params.id),
      name: req.body.name,
    };
    const affectedRows = await AbonnementRepository.update(abonnement);
    if (affectedRows === 0) {
      res.sendStatus(404); // Si aucune ligne n'est affectée, renvoie un statut 404
    } else {
      res.sendStatus(204); // Si la mise à jour est réussie, renvoie un statut 204 (Aucun contenu)
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// The A du BREAD - Add: Creation d'un nouvel abonnement
const add: RequestHandler = async (req, res, next) => {
  try {
    const newAbonnement: Omit<Abonnement, "id"> = {
      name: req.body.name,
    };
    const insertId = await AbonnementRepository.create(newAbonnement);
if (insertId === 0) {
      res.sendStatus(400); // Si l'insertion échoue, renvoie un statut 400 (Mauvaise requête)
    } else {
      res.status(201).json({ insertId }); // Si l'insertion réussit, renvoie le nouvel ID de l'abonnement créé
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le D du BREAD - Destroy : Supprimer un abonnement spécifique par son ID
const destroy: RequestHandler = async (req, res, next) => {
  try {
    const abonnementId = Number(req.params.id);
    const affectedRows = await AbonnementRepository.delete(abonnementId);
    if (affectedRows === 0) {
      res.sendStatus(404); // Si l'abonnement n'est pas trouvé, renvoie un statut 404
    } else {
      res.sendStatus(204); // Si la suppression est réussie, renvoie un statut 204 (Aucun contenu)
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

export default { browse, read, add, destroy, edit };
