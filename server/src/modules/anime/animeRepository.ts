import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Anime = {
  id: number;
  title: string;
  synopsis: string;
  portrait: string;
  date: number;
  landscape: string;
  video: string;
  genre_id: number;
  genre_name?: string;
  types?: { id: number; name: string }[];
  note?: number;
};

class AnimeRepository {

  // Le C du CRUD - Create : Création d'un nouvel animé
  async create(anime: Omit<Anime, "id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO anime (title, synopsis, portrait, date, landscape, video, genre_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        anime.title,
        anime.synopsis,
        anime.portrait,
        anime.date,
        anime.landscape,
        anime.video,
        anime.genre_id,
      ],
    );
    return result.insertId; //Retourne l'ID du nouvel animé inséré
  }

  // Le R du CRUD - Read : Lire un animé spécifique par son ID
  async read(id: number) {
    const [animeRows] = await databaseClient.query<Rows>(
      "SELECT * FROM anime WHERE id = ?",
      [id],
    );
    const anime = animeRows[0] as Anime; // Recupère la première ligne du résultat de la requête
 
    const [typeRows] = await databaseClient.query<Rows>(
      "SELECT type.id, type.name FROM type JOIN anime_type ON type.id = anime_type.type_id WHERE anime_type.anime_id = ?",
      [id],
    ); // Récupère les types associés

    const [genreRows] = await databaseClient.query<Rows>(
      "SELECT id, name FROM genre WHERE id = ?",
      [anime.genre_id],
    ); // Récupère le nom de genre via genre_id

    return { ...anime, types: typeRows, genre: genreRows[0] }; // Retourne l'objet complet
  }

  // Le R du CRUD - Read All : Lire tous les animés
  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM anime");
    return rows as Anime[]; // Retourne le tableau d'animés
  }

 // Le U du CRUD - Update : Mettre à jour un animé existant
  async update(anime: Anime) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE anime SET title = ?, synopsis = ?, portrait = ?, date = ?, landscape = ?, video = ?, genre_id = ? WHERE id = ?",
      [
        anime.title,
        anime.synopsis,
        anime.portrait,
        anime.date,
        anime.landscape,
        anime.video,
        anime.genre_id,
        anime.id,
      ],
    );
    return result.affectedRows; // Retourne le nombre de lignes affectées par la mise à jour
  }

  // Le D du CRUD - Delete : Supprimer un anime par son ID
  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM anime WHERE id = ?",
      [id],
    );
    return result.affectedRows; // Retourne le nombre de lignes affectées par la suppression
  }

// Lire les animés avec des filtres sur le genre et le type
  async readAllFiltered(genre: string, type: string) {
    const where = [];
    const values = [];

    if (genre === "all") {
      where.push("a.genre_id IN (?, ?, ?)");
      values.push(1, 2, 3);
    } else {
      where.push("a.genre_id = ?");
      values.push(Number(genre));
    }

    if (type !== "all") {
      where.push("t.id = ?");
      values.push(Number(type));
    }

    const whereSQL = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";

    const query = `
    SELECT 
      a.id, a.title, a.synopsis, a.genre_id, a.portrait, a.date, a.landscape, a.video,
      GROUP_CONCAT(t.id) as tid 
    FROM anime a 
    INNER JOIN anime_type at ON a.id = at.anime_id 
    INNER JOIN type t ON at.type_id = t.id 
    ${whereSQL}
    GROUP BY a.id, a.title, a.synopsis, a.genre_id, a.portrait, a.date, a.landscape, a.video
  `;

    const [rows] = await databaseClient.query<Rows>(query, values);

    return rows as Anime[]; // Retourne les animés filtrés par genre et type
  }

  // Lire TOUS les animés avec le genre en plus
  async readAllWithGenre() {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT a.id, a.title, a.synopsis, a.portrait, a.date, a.landscape, a.video, g.name AS genre_name
      FROM anime AS a
      LEFT JOIN genre AS g ON a.genre_id = g.id`,
    );
    return rows as Anime[]; // Retourne les animés avec leur genre
  }

  // Lire TOUS les animés avec la note moyenne
  async readAllWithNote() {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT a.id, a.title, ROUND(AVG(n.note), 1) AS note FROM anime AS a LEFT JOIN user_anime_note AS n ON n.anime_id = a.id GROUP BY a.id, a.title ORDER BY note DESC",
    );
    return rows as Anime[]; // Retourne les animés avec leur note moyenne
  }
}

export default new AnimeRepository();
