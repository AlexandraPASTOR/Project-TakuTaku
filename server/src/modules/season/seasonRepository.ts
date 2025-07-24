import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Season = {
  id: number;
  number: number;
  anime_id: number;
};

class SeasonRepository {

  // Le C du CRUD - Create : Création d'une nouvelle saison
  async create(season: Omit<Season, "id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO season (number, anime_id) VALUES (?, ?)",
      [season.number, season.anime_id],
    );
    return result.insertId; // Retourne l'ID de la saison nouvellement créée
  }

  // Le R du CRUD - Read : Lire une saison spécifique par son ID
  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM season WHERE id = ?",
      [id],
    );
    return rows[0] as Season; // Retourne la saison trouvée ou undefined si aucune saison n'est trouvée
  }

  // Le R du CRUD - Read All : Lire toutes les saisons
  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM season");
    return rows as Season[]; // Retourne un tableau de toutes les saisons
  }

  // Le U du CRUD - Update : Mettre à jour une saison existante
  async update(season: Season) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE season SET number = ?, anime_id = ? WHERE id = ?",
      [season.number, season.anime_id, season.id],
    );
    return result.affectedRows; // Retourne le nombre de lignes affectées par la mise à jour
  }

  // Le D du CRUD - Delete : Supprimer une saison par son ID
  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM season WHERE id = ?",
      [id],
    );
    return result.affectedRows; // Retourne le nombre de lignes affectées par la suppression
  }
}

export default new SeasonRepository();
