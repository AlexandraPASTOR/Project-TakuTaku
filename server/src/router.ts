import express from "express";
const router = express.Router();

// Import des middlewares de sécurité
import { checkEmailExists } from "./middleware/checkEmailExists";
import { checkToken } from "./middleware/checkTocken";
import { checkAdmin } from "./middleware/checkAdmin";

// Import des modules d'action
import abonnementAction from "./modules/abonnement/abonnementAction";
import animeAction from "./modules/anime/animeAction";
import authAction from "./modules/auth/authAction";
import episodeAction from "../src/modules/episode/episodeAction";
import favoriteAction from "./modules/favorite/favoriteAction";
import genreAction from "./modules/genre/genreAction";
import historyAction from "./modules/history/historyAction";
import profilPictureAction from "./modules/profilpicture/profilPictureAction";
import noteAction from "./modules/note/noteAction";
import seasonAction from "../src/modules/season/seasonAction";
import typeAction from "./modules/type/typeAction";
import userAction from "./modules/user/userAction";

// Routes du module abonnement
router.get("/api/abonnement", abonnementAction.browse);
router.get("/api/abonnement/:id([0-9]+)", abonnementAction.read);
router.post("/api/abonnement", abonnementAction.add);
router.put("/api/abonnement/:id([0-9]+)", checkToken, abonnementAction.edit);
router.delete("/api/abonnement/:id([0-9]+)", checkToken, abonnementAction.destroy);

// Routes du module anime
router.get("/api/anime", animeAction.browse);
router.get("/api/anime_with_genre", animeAction.browseWithGenre);
router.get("/api/anime_with_note", animeAction.browseWithNote);
router.get("/api/animetype/:genre/:type", animeAction.browseFiltered);
router.get("/api/anime/:id([0-9]+)", animeAction.read);
router.post("/api/anime", checkToken, checkAdmin, animeAction.add);
router.put("/api/anime/:id([0-9]+)", checkToken, checkAdmin, animeAction.edit);
router.delete("/api/anime/:id([0-9]+)", checkToken, checkAdmin, animeAction.destroy);

//Routes du module auth
router.post("/api/auth/signin", authAction.signIn);
router.post("/api/auth/signup", checkEmailExists, authAction.signUp);
router.post("/api/auth/signout", checkToken, authAction.signOut);

// Routes du module episode
router.get("/api/episode", checkToken, episodeAction.browse);
router.get("/api/episode/:id([0-9]+)", checkToken, episodeAction.read);
router.post("/api/episode", checkToken, checkAdmin, episodeAction.add);
router.put("/api/episode/:id([0-9]+)", checkToken, checkAdmin, episodeAction.edit);
router.delete("/api/episode/:id([0-9]+)", checkToken, checkAdmin, episodeAction.destroy);

// Routes du module favorite
router.get("/api/favorite_anime/:user_id([0-9]+)", checkToken, favoriteAction.browse);
router.get("/api/favorite_anime/:user_id([0-9]+)/:anime_id([0-9]+)", checkToken, favoriteAction.read);
router.post("/api/favorite_anime", checkToken, favoriteAction.add);
router.delete("/api/favorite_anime/:user_id([0-9]+)/:anime_id([0-9]+)", checkToken, favoriteAction.destroy);

//Routes du module genre
router.get("/api/genre", genreAction.browse);
router.get("/api/genre/:id([0-9]+)", genreAction.read);
router.post("/api/genre", checkToken, checkAdmin, genreAction.add);
router.put("/api/genre/:id([0-9]+)", checkToken, checkAdmin, genreAction.edit);
router.delete("/api/genre/:id([0-9]+)", checkToken, checkAdmin, genreAction.destroy);

// Routes du module history
router.get("/api/user/:id([0-9]+)/history", checkToken, historyAction.readUserHistory);
router.post("/api/history", checkToken, historyAction.add);

//Routes du module note
router.get("/api/note", noteAction.browse);
router.get("/api/note/:anime_id([0-9]+)/:user_id([0-9]+)", checkToken, noteAction.readUserNote);
router.get("/api/note/:anime_id([0-9]+)/average", noteAction.readAverage);
router.post("/api/note", checkToken, noteAction.add);
router.put("/api/note/:anime_id([0-9]+)/:user_id([0-9]+)", checkToken, noteAction.edit);
router.delete("/api/note/:anime_id([0-9]+)/:user_id([0-9]+)", checkToken, noteAction.destroy);

// Routes du module profilpicture
router.get("/api/user/profilpicture", checkToken, profilPictureAction.readAllProfilPicture);
router.get("/api/user/profilpicture/:id", checkToken, profilPictureAction.readProfilPicture);
router.put("/api/user/profilpicture", checkToken, profilPictureAction.editProfilPicture);

// Routes du module season
router.get("/api/season", checkToken, seasonAction.browse);
router.get("/api/season/:id([0-9]+)", checkToken, seasonAction.read);
router.post("/api/season", checkToken, checkAdmin, seasonAction.add);
router.put("/api/season/:id([0-9]+)", checkToken, checkAdmin, seasonAction.edit);
router.delete("/api/season/:id([0-9]+)", checkToken, checkAdmin, seasonAction.destroy);

// Routes du module type
router.get("/api/type", typeAction.browse);
router.get("/api/type/:id([0-9]+)", typeAction.read);
router.post("/api/type", checkToken, checkAdmin, typeAction.add);
router.put("/api/type/:id([0-9]+)", checkToken, checkAdmin, typeAction.edit);
router.delete("/api/type/:id([0-9]+)", checkToken, checkAdmin, typeAction.destroy);

// Routes du module user
router.get("/api/user", checkToken, checkAdmin, userAction.browse);
router.get("/api/user/connected", checkToken, userAction.readConnectedUser);
router.get("/api/user/abonnement", checkToken, checkAdmin, userAction.readUsersWithAbonnement);
router.get("/api/user/:id([0-9]+)", checkToken, userAction.read);
router.post("/api/user", checkToken, checkAdmin, userAction.add);
router.put("/api/user/:id([0-9]+)", checkToken, userAction.edit);
router.delete("/api/user/:id([0-9]+)", checkToken, userAction.destroy);


export default router;
