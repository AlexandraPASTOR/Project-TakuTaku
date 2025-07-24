import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type User = {
  id: number;
  firstname: string;
  lastname: string;
  mail: string;
  password?: string;
  is_admin: boolean;
  is_actif: boolean;
  abonnement_id: number;
  profilpicture_id: number;
};

class UserRepository {

  // Le C du CRUD - CREATE : Création d'un nouvel utilisateur
  async create(user: Omit<User, "id">) {
      const [result] = await databaseClient.query<Result>(
        "INSERT INTO user (firstname, lastname, mail, password, is_admin, is_actif, abonnement_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          user.firstname,
          user.lastname,
          user.mail,
          user.password,
          user.is_admin,
          user.is_actif,
          user.abonnement_id,
        ],
      );
      return result.insertId; // Retourne l'ID du nouvel utilisateur inséré
  }

  // Le R du CRUD - READ : Lire un utilisateur par son ID
  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user WHERE id = ?",
      [id],
    );
    return rows[0] as User; // Retourne la première ligne du résultat de la requête ou undefined si aucun utilisateur n'est trouvé
  }

  // Le R du CRUD - ReadAll : Lire tous les utilisateurs
  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM user");
    return rows as User[]; // Retourne un tableau de tous les utilisateurs
  }

  //  Le U du CRUD - Update : Mettre à jour un utilisateur par son ID
  async update(user: User) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE user SET firstname = ?, lastname = ?, mail = ?, is_admin = ?, is_actif = ?, abonnement_id = ? WHERE id = ?",
      [
        user.firstname,
        user.lastname,
        user.mail,
        user.is_admin,
        user.is_actif,
        user.abonnement_id,
        user.id,
      ],
    );
    return result.affectedRows; // Retourne le nombre de lignes affectées par la mise à jour
  }

  // Le D du CRUD - Delete : Supprimer un utilisateur par son ID
  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM user WHERE id= ?",
      [id],
    );
    return result.affectedRows; // Retourne le nombre de lignes affectées par la suppression
  }

  // Abonnement : Lire les utilisateurs avec leur abonnement
    async readAllWithAbonnement() {
    const [rows] = await databaseClient.query(
      `SELECT u.id, u.firstname, u.lastname, u.mail, u.is_admin, u.is_actif,
            a.name AS abonnement_name
      FROM user u
      LEFT JOIN abonnement a ON u.abonnement_id = a.id`,
    );
    return rows; // Retourne un tableau d'utilisateurs avec le nom de leur abonnement
  }
}

export default new UserRepository();
