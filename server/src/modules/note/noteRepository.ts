import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

interface Note {
  id: number;
  note: number; 
  user_id: number; 
  anime_id: number;
}

class noteRepository {

  // Le C du CRUD - Create : Création d'une nouvelle note
  async create(note: Omit<Note, "id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO user_anime_note ( user_id, anime_id, note) VALUES (?, ?, ?)",
      [note.user_id, note.anime_id, note.note],
    );
    return result.insertId; //Retourne l'ID de la nouvelle note inséré
  }

  // Le R du CRUD - Read : Lire la note moyenne d'un anime
  async read(anime_id: number) {
    const [noteRows] = await databaseClient.query<Rows>(
      "SELECT AVG(note) AS average FROM user_anime_note WHERE anime_id = ?",
      [anime_id],
    );
    return noteRows[0] as { average: number }; // Retourne la note moyenne
  }

  // Le R du CRUD - ReadAll : Lire toutes les notes
  async readAll() {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user_anime_note",
    );
    return rows as Note[]; // Retourne le tableau de toutes les notes
  }

  // Le U du CRUD - Update : Mettre à jour une note spécifique
  async update(note: Omit<Note, "id">) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE user_anime_note SET note = ? WHERE anime_id = ? AND user_id = ?",
      [note.note, note.anime_id, note.user_id],
    );
    return result.affectedRows; // Retourne le nombre de lignes affectées
  }

  // Le D du CRUD - Delete : Supprimer une note spécifique
  async delete(anime_id: number, user_id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM user_anime_note WHERE anime_id = ? AND user_id = ?",
      [anime_id, user_id],
    );
    return result.affectedRows; // Retourne le nombre de lignes affectées
  }

  // Requête pour lire la note du user selon l'anime_id
  async readUserNote(anime_id: number, user_id: number) {
    const [noteRows] = await databaseClient.query<Rows>(
      "SELECT note FROM user_anime_note WHERE anime_id = ? AND user_id = ?",
      [anime_id, user_id],
    );
    return noteRows[0]; // Retourne la note de l'utilisateur pour l'anime spécifique
  }
}

export default new noteRepository();
