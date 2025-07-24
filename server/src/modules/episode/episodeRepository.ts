import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Episode = {
  id: number;
  number: number;
  title: string;
  synopsis: string;
  season_id: number;
};

class EpisodeRepository {
  // Le C du CRUD - Create : Création d'un nouvel épisode
  async create(episode: Omit<Episode, "id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO episode (number, title, synopsis, season_id) VALUES (?, ?, ?, ?)",
      [episode.number, episode.title, episode.synopsis, episode.season_id],
    );
    return result.insertId; // Retourne l'ID du nouvel episode inséré
  }

  // Le R du CRUD - Read : Lire un épisode spécifique par son ID
  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM episode WHERE id = ?",
      [id],
    );
    return rows[0] as Episode; // Retourne la première ligne du résultat de la requête
  }
 
  // Le R du CRUD - Read All : Lire tous les épisodes
  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM episode");
    return rows as Episode[]; // Retourne le tableau des episodes
  }

  // Le U du CRUD - Update : Mettre à jour un épisode spécifique par son ID
  async update(episode: Episode) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE episode SET number = ?, title = ?, synopsis = ?, season_id = ? WHERE id = ?",
      [
        episode.number,
        episode.title,
        episode.synopsis,
        episode.season_id,
        episode.id,
      ],
    );
    return result.affectedRows; // Retourne le nombre de lignes affectées par la mise à jour
  }

  // Le D du CRUD - Delete : Supprimer un épisode spécifique par son ID
  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM episode WHERE id = ?",
      [id],
    );
    return result.affectedRows; // Retourne le nombre de lignes affectées par la suppression
  }
}

export default new EpisodeRepository();
