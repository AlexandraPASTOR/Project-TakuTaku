"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Import des middlewares de sécurité
const checkEmailExists_1 = require("./middleware/checkEmailExists");
const checkTocken_1 = require("./middleware/checkTocken");
const checkAdmin_1 = require("./middleware/checkAdmin");
// Import des modules d'action
const abonnementAction_1 = __importDefault(require("./modules/abonnement/abonnementAction"));
const animeAction_1 = __importDefault(require("./modules/anime/animeAction"));
const authAction_1 = __importDefault(require("./modules/auth/authAction"));
const episodeAction_1 = __importDefault(require("../src/modules/episode/episodeAction"));
const favoriteAction_1 = __importDefault(require("./modules/favorite/favoriteAction"));
const genreAction_1 = __importDefault(require("./modules/genre/genreAction"));
const historyAction_1 = __importDefault(require("./modules/history/historyAction"));
const profilPictureAction_1 = __importDefault(require("./modules/profilpicture/profilPictureAction"));
const noteAction_1 = __importDefault(require("./modules/note/noteAction"));
const seasonAction_1 = __importDefault(require("../src/modules/season/seasonAction"));
const typeAction_1 = __importDefault(require("./modules/type/typeAction"));
const userAction_1 = __importDefault(require("./modules/user/userAction"));
// Routes du module abonnement
router.get("/api/abonnement", abonnementAction_1.default.browse);
router.get("/api/abonnement/:id([0-9]+)", abonnementAction_1.default.read);
router.post("/api/abonnement", abonnementAction_1.default.add);
router.put("/api/abonnement/:id([0-9]+)", checkTocken_1.checkToken, abonnementAction_1.default.edit);
router.delete("/api/abonnement/:id([0-9]+)", checkTocken_1.checkToken, abonnementAction_1.default.destroy);
// Routes du module anime
router.get("/api/anime", animeAction_1.default.browse);
router.get("/api/anime_with_genre", animeAction_1.default.browseWithGenre);
router.get("/api/anime_with_note", animeAction_1.default.browseWithNote);
router.get("/api/animetype/:genre/:type", animeAction_1.default.browseFiltered);
router.get("/api/anime/:id([0-9]+)", animeAction_1.default.read);
router.post("/api/anime", checkTocken_1.checkToken, checkAdmin_1.checkAdmin, animeAction_1.default.add);
router.put("/api/anime/:id([0-9]+)", checkTocken_1.checkToken, checkAdmin_1.checkAdmin, animeAction_1.default.edit);
router.delete("/api/anime/:id([0-9]+)", checkTocken_1.checkToken, checkAdmin_1.checkAdmin, animeAction_1.default.destroy);
//Routes du module auth
router.post("/api/auth/signin", authAction_1.default.signIn);
router.post("/api/auth/signup", checkEmailExists_1.checkEmailExists, authAction_1.default.signUp);
router.post("/api/auth/signout", checkTocken_1.checkToken, authAction_1.default.signOut);
// Routes du module episode
router.get("/api/episode", checkTocken_1.checkToken, episodeAction_1.default.browse);
router.get("/api/episode/:id([0-9]+)", checkTocken_1.checkToken, episodeAction_1.default.read);
router.post("/api/episode", checkTocken_1.checkToken, checkAdmin_1.checkAdmin, episodeAction_1.default.add);
router.put("/api/episode/:id([0-9]+)", checkTocken_1.checkToken, checkAdmin_1.checkAdmin, episodeAction_1.default.edit);
router.delete("/api/episode/:id([0-9]+)", checkTocken_1.checkToken, checkAdmin_1.checkAdmin, episodeAction_1.default.destroy);
// Routes du module favorite
router.get("/api/favorite_anime/:user_id([0-9]+)", checkTocken_1.checkToken, favoriteAction_1.default.browse);
router.get("/api/favorite_anime/:user_id([0-9]+)/:anime_id([0-9]+)", checkTocken_1.checkToken, favoriteAction_1.default.read);
router.post("/api/favorite_anime", checkTocken_1.checkToken, favoriteAction_1.default.add);
router.delete("/api/favorite_anime/:user_id([0-9]+)/:anime_id([0-9]+)", checkTocken_1.checkToken, favoriteAction_1.default.destroy);
//Routes du module genre
router.get("/api/genre", genreAction_1.default.browse);
router.get("/api/genre/:id([0-9]+)", genreAction_1.default.read);
router.post("/api/genre", checkTocken_1.checkToken, checkAdmin_1.checkAdmin, genreAction_1.default.add);
router.put("/api/genre/:id([0-9]+)", checkTocken_1.checkToken, checkAdmin_1.checkAdmin, genreAction_1.default.edit);
router.delete("/api/genre/:id([0-9]+)", checkTocken_1.checkToken, checkAdmin_1.checkAdmin, genreAction_1.default.destroy);
// Routes du module history
router.get("/api/user/:id([0-9]+)/history", checkTocken_1.checkToken, historyAction_1.default.readUserHistory);
router.post("/api/history", checkTocken_1.checkToken, historyAction_1.default.add);
//Routes du module note
router.get("/api/note", noteAction_1.default.browse);
router.get("/api/note/:anime_id([0-9]+)/:user_id([0-9]+)", checkTocken_1.checkToken, noteAction_1.default.readUserNote);
router.get("/api/note/:anime_id([0-9]+)/average", noteAction_1.default.readAverage);
router.post("/api/note", checkTocken_1.checkToken, noteAction_1.default.add);
router.put("/api/note/:anime_id([0-9]+)/:user_id([0-9]+)", checkTocken_1.checkToken, noteAction_1.default.edit);
router.delete("/api/note/:anime_id([0-9]+)/:user_id([0-9]+)", checkTocken_1.checkToken, noteAction_1.default.destroy);
// Routes du module profilpicture
router.get("/api/user/profilpicture", checkTocken_1.checkToken, profilPictureAction_1.default.readAllProfilPicture);
router.get("/api/user/profilpicture/:id", checkTocken_1.checkToken, profilPictureAction_1.default.readProfilPicture);
router.put("/api/user/profilpicture", checkTocken_1.checkToken, profilPictureAction_1.default.editProfilPicture);
// Routes du module season
router.get("/api/season", checkTocken_1.checkToken, seasonAction_1.default.browse);
router.get("/api/season/:id([0-9]+)", checkTocken_1.checkToken, seasonAction_1.default.read);
router.post("/api/season", checkTocken_1.checkToken, checkAdmin_1.checkAdmin, seasonAction_1.default.add);
router.put("/api/season/:id([0-9]+)", checkTocken_1.checkToken, checkAdmin_1.checkAdmin, seasonAction_1.default.edit);
router.delete("/api/season/:id([0-9]+)", checkTocken_1.checkToken, checkAdmin_1.checkAdmin, seasonAction_1.default.destroy);
// Routes du module type
router.get("/api/type", typeAction_1.default.browse);
router.get("/api/type/:id([0-9]+)", typeAction_1.default.read);
router.post("/api/type", checkTocken_1.checkToken, checkAdmin_1.checkAdmin, typeAction_1.default.add);
router.put("/api/type/:id([0-9]+)", checkTocken_1.checkToken, checkAdmin_1.checkAdmin, typeAction_1.default.edit);
router.delete("/api/type/:id([0-9]+)", checkTocken_1.checkToken, checkAdmin_1.checkAdmin, typeAction_1.default.destroy);
// Routes du module user
router.get("/api/user", checkTocken_1.checkToken, checkAdmin_1.checkAdmin, userAction_1.default.browse);
router.get("/api/user/connected", checkTocken_1.checkToken, userAction_1.default.readConnectedUser);
router.get("/api/user/abonnement", checkTocken_1.checkToken, checkAdmin_1.checkAdmin, userAction_1.default.readUsersWithAbonnement);
router.get("/api/user/:id([0-9]+)", checkTocken_1.checkToken, userAction_1.default.read);
router.post("/api/user", checkTocken_1.checkToken, checkAdmin_1.checkAdmin, userAction_1.default.add);
router.put("/api/user/:id([0-9]+)", checkTocken_1.checkToken, userAction_1.default.edit);
router.delete("/api/user/:id([0-9]+)", checkTocken_1.checkToken, userAction_1.default.destroy);
exports.default = router;
