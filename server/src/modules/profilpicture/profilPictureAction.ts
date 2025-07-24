import type { RequestHandler } from "express";
import profilPictureRepository from "./profilPictureRepository";

interface ProfilPicture {
    id: number;
    url: string;
    }

// Le R du CRUD - ReadAll : Lire toutes les images de profil
const readAllProfilPicture: RequestHandler = async (req, res, next) => {
  try {
    const pictures = await profilPictureRepository.readAllPicture();
    if (pictures.length === 0) {
      res.sendStatus(404); // Si aucune image de profil n'est trouvée, on renvoie un statut 404
      return;
    }
    res.json(pictures); // Sinon, on renvoie les images de profil au format JSON
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le R du CRUD - Read : Lire l'image de profil d'un utilisateur par son ID
const readProfilPicture: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    if (userId !== req.user?.id && !req.user?.is_admin) {
      res.status(403).json({ message: "Accès interdit" });
      return; // Si l'utilisateur n'est pas l'utilisateur connecté ou un admin, on renvoie un statut 403
    }
    const profilpicture = await profilPictureRepository.readProfilPicture(userId);
    if (!profilpicture) {
      res.status(404).json({ error: "Utilisateur non trouvé" }); // Si l'image de profil n'est pas trouvée, on renvoie un statut 404
      return;
    }
    res.json(profilpicture); // Sinon, on renvoie l'image de profil au format JSON
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

// Le U du CRUD - Update : Mettre à jour l'image de profil d'un utilisateur
const editProfilPicture: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.body.id);
    const profilpicture_id = req.body.profilpicture_id;
    const affectedRows = await profilPictureRepository.updateProfilPicture(
      id,
      profilpicture_id,
    );
    if (affectedRows === 0) {
      res.sendStatus(404); // Si l'utilisateur n'est pas trouvé, on renvoie un statut 404
    } else {
      res.json({ id, profilpicture_id }); // Sinon, on renvoie l'ID de l'utilisateur et l'ID de l'image de profil mise à jour
    }
  } catch (err) {
    next(err); // Transmet toutes les erreurs au middleware de gestion des erreurs
  }
};

export default {
  readAllProfilPicture,
  readProfilPicture,
  editProfilPicture,
};