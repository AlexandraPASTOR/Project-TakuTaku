import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Genre = {
  id: number;
  name: string;
};

class GenreRepository {

  // Le C du CRUD - Create : Création d'un nouveau genre
  async create(genre: Omit<Genre, "id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO genre (name) VALUES (?)",
      [genre.name],
    );
    return result.insertId; // Retourne l'ID du nouveau genre inséré
  }

  // Le R du CRUD - Read : Lire un genre spécifique par son ID
  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM genre WHERE id = ?",
      [id],
    ); 
    return rows[0] as Genre; // Retourne la première ligne du résultat de la requête
  }

  // Le R du CRUD - Read All : Lire tous les genres
  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM genre");
    return rows as Genre[]; // Retourne le tableau des genres
  }

  // Le U du CRUD - Update : Mettre à jour un genre spécifique par son ID
  async update(genre: Genre) {
    const [result] = await databaseClient.query<Result>(
      "Update genre SET name = ? WHERE id = ?",
      [genre.name, genre.id],
    );
    return result.affectedRows; // Retourne le nombre de lignes affectées par la mise à jour
  }

  // Le D du CRUD - Delete : Supprimer un genre spécifique par son ID
  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM genre WHERE id = ?",
      [id],
    );
    return result.affectedRows; // Retourne le nombre de lignes affectées par la suppression
  }
}

export default new GenreRepository();
