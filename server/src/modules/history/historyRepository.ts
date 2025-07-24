import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type History = {
  id: number;
  user_id: number;
  anime_id: number;
};

class HistoryRepository {

  // Ajoute un animé à l'historique d'un utilisateur
  async create(history: Omit<History, "id">) {
        // Vérifie si l'utilisateur a déjà visionné l'anime
        const [existing] = await databaseClient.query<Rows>(
            "SELECT * FROM user_anime_history WHERE user_id = ? AND anime_id = ?",
            [history.user_id, history.anime_id],
        );
        // Si il existe déjà, on ne l'insère pas à nouveau
        if (existing.length > 0) {
            return { message: "Animé déjà présent dans l'historique" }; // Retourne un message indiquant que l'animé existe déjà 
        }
      const [result] = await databaseClient.query<Result>(
        "INSERT INTO user_anime_history (user_id, anime_id) VALUES (?, ?)",
        [history.user_id, history.anime_id],
      );
      return result.insertId; // Retourne l'ID de la nouvelle entrée d'historique insérée
  }

  // Lire l'historique d'un utilisateur
  async readUserHistory(user_id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user_anime_history INNER JOIN anime ON anime.id = user_anime_history.anime_id WHERE user_id = ?",
      [user_id],
    );
    return rows as History[]; // Retourne le tableau d'historique des animés de l'utilisateur
  }
}

export default new HistoryRepository();