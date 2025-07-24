import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Favorite = {
  id?: number;
  user_id: number;
  anime_id: number;
};

class favoriteRepository {

  // Le C du CRUD - Create : Création d'un nouveau favori
  async create(favorite: Favorite) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO user_anime_favorite (user_id, anime_id) VALUES (?, ?)",
      [favorite.user_id, favorite.anime_id],
    );
    return result.insertId; // Retourne l'ID du nouvel favori inséré
  }

  // Le R du CRUD - Read : Lire un favori spécifique par l'ID de l'utilisateur et l'ID de l'anime
  async read(user_id: number, anime_id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user_anime_favorite WHERE user_id = ? AND anime_id = ?",
      [user_id, anime_id],
    );
    return rows[0] as Favorite; // Retourne la première ligne du résultat de la requête
  }

  // Le R du CRUD - Read All : Lire tous les favoris d'un utilisateur
  async readAll(user_id: number) {
    const [rows] = await databaseClient.query(
      `SELECT fa.anime_id, a.title, a.portrait
     FROM user_anime_favorite fa
     JOIN anime a ON fa.anime_id = a.id
     WHERE fa.user_id = ?`,
      [user_id],
    );
    return rows as Favorite[]; // Retourne un tableau de favoris
  }

  // Le D du CRUD - Delete : Supprimer un favori spécifique par l'ID de l'utilisateur et l'ID de l'anime
  async delete(user_id: number, anime_id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM user_anime_favorite WHERE user_id = ? AND anime_id = ?",
      [user_id, anime_id],
    );
    return result.affectedRows; // Retourne le nombre de lignes affectées par la suppression
  }
}

export default new favoriteRepository();
