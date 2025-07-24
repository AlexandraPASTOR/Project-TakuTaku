import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Type = {
  id: number;
  name: string;
};

class TypeRepository {

  // Le C du CRUD - Create : Création d'un nouveau type
  async create(type: Omit<Type, "id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO type (name) VALUES (?)",
      [type.name],
    );
    return result.insertId; // Retourne l'ID du nouveau type inséré
  }

  // Le R du CRUD - Read : Lire un type spécifique par son ID
  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM type WHERE id = ?",
      [id],
    );
    return rows[0] as Type; // Retourne la première ligne du résultat de la requête
  }

  // Le R du CRUD - Read All : Lire tous les types
  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM type");
    return rows as Type[]; // Retourne le tableau de tous les types
  }

  // Le U du CRUD - Update : Mettre à jour un type spécifique par son ID
  async update(type: Type) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE type SET name = ? WHERE id = ?",
      [type.name, type.id],
    );
    return result.affectedRows; // Retourne le nombre de lignes affectées par la mise à jour
  }

  // Le D du CRUD - Delete : Supprimer un type spécifique par son ID
  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM type WHERE id = ?",
      [id],
    );
    return result.affectedRows; // Retourne le nombre de lignes affectées par la suppression
  }
}

export default new TypeRepository();
