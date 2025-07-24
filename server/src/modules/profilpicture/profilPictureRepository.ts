import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type ProfilPicture = {
  id: number;
  url: string;
};

class ProfilPictureRepository {

// Le R du CRUD - ReadAll : Lire toutes les images de profil
  async readAllPicture() {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM profilpicture",
    );
    return rows as ProfilPicture[]; // Retourne un tableau de toutes les images de profil
  }

// Le R du CRUD - Read : Lire l'image de profil d'un utilisateur par son ID
  async readProfilPicture(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT url FROM profilpicture AS pp INNER JOIN user AS u ON pp.id=u.profilpicture_id WHERE u.id = ?",
      [userId],
    );
    return rows[0]; // Retourne l'URL de l'image de profil de l'utilisateur
  }

  // Le U du CRUD - Update : Mettre à jour l'image de profil d'un utilisateur
  async updateProfilPicture(id: number, profilpicture_id: number) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE user SET profilpicture_id = ? WHERE id = ?",
      [profilpicture_id, id],
    );
    return result.affectedRows; // Retourne le nombre de lignes affectées par la mise à jour de l'image de profil
  }

}

export default new ProfilPictureRepository();