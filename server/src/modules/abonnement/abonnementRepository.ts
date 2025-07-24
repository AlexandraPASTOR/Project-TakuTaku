import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type AbonnementName = "découverte" | "premium";

type Abonnement = {
  id: number;
  name: AbonnementName;
};

class AbonnementRepository {

  // Le C du CRUD - Create : Création d'un nouvel abonnement
  async create(abonnement: Omit<Abonnement, "id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO abonnement (name) VALUES (?)",
      [abonnement.name],
    );
    return result.insertId;  // Retourne l'ID du nouvel abonnement inséré
  }

  // Le R du CRUD - Read : Lire un abonnement spécifique par son ID
  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM abonnement WHERE id = ?",
      [id],
    );
    return rows[0] as Abonnement; // Retourne la première ligne du résultat de la requête
  }

  // Le R du CRUD - Read All : Lire tous les abonnements
  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM abonnement");
    return rows as Abonnement[]; // Retourne le tableau d'abonnements
  }

  // Le U du CRUD - Update : Mettre à jour un abonnement existant
  async update(abonnement: Abonnement) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE abonnement SET name = ? WHERE id = ?",
      [abonnement.name, abonnement.id],
    );
    return result.affectedRows; // Retourne le nombre de lignes affectées par la mise à jour
  }

  // Le D du CRUD - Delete : Supprimer un abonnement par son ID
  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM abonnement WHERE id = ?",
      [id],
    );
    return result.affectedRows; // Retourne le nombre de lignes affectées par la suppression
  }
}

export default new AbonnementRepository();
