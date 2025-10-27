import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Auth = {
  id: number;
  firstname: string;
  lastname: string;
  mail: string;
  password: string;
  abonnement_id: number;
  is_admin: boolean;
  is_actif: boolean;
  profilpicture_id: number;
};

class AuthRepository {

  // Vérification de l'existence de l'e-mail en BDD pour le middleware checkEmailExists
  async findByEmail(mail: string) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id FROM user WHERE mail = ?",
      [mail],
    );
    return rows[0];
  }

  // Connexion d'un utilisateur : lire un utilisateur par son mail
  async signIn(mail: string) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user WHERE mail = ?",
      [mail],
    );
    return rows[0] as Auth; // Retourne le premier utilisateur trouvé ou undefined si aucun utilisateur n'est trouvé
  }

  // Inscription d'un utilisateur : créer un nouvel utilisateur
  async signUp(
    firstname: string,
    lastname: string,
    mail: string,
    passHash: string,
    abonnement_id: number,
    is_admin: boolean,
    is_actif: boolean,
    profilpicture_id: number,
  ) {
    // Exécute la requête SQL pour créer un nouvel utilisateur
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO user (firstname, lastname, mail, password, abonnement_id, is_admin, is_actif, profilpicture_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [firstname, lastname, mail, passHash, abonnement_id, is_admin, is_actif, profilpicture_id],
    );
    return result.insertId; // Retourne l'ID du nouvel utilisateur inséré
  }

}

export default new AuthRepository();
