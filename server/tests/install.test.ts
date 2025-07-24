// Importe et charge automatiquement les variables d'environnement définies dans le fichier `.env`
import "dotenv/config";

// Importe le module `fs` de Node.js, qui permet d’interagir avec le système de fichiers
import fs from "node:fs";

// Définition d’un groupe de tests nommé "Installation"
describe("Installation", () => {
  // Test unitaire qui vérifie si le fichier `.env` existe bien à l'emplacement prévu
  test("You have created /server/.env", async () => {
    // Vérifie que le fichier `.env` existe dans le dossier parent de celui du test (__dirname/../.env)
    // __dirname = répertoire du fichier actuel
    // ../.env = le fichier `.env` à la racine du dossier /server
    expect(fs.existsSync(`${__dirname}/../.env`)).toBe(true);
    // Si le fichier existe, le test passe. Sinon, il échoue.
  });
});

// Test pour vérifier si le ficher App.tsx existe bien
describe("Installation", () => {
  test("You have created /client/src/App.tsx", async () => {
    expect(fs.existsSync(`${__dirname}/../../client/src/App.tsx`)).toBe(true);
  });
});

import type { NextFunction, Request, Response } from "express";
import type { RowDataPacket } from "mysql2";
import { checkEmailExists } from "../src/middleware/checkEmailExists";
import authRepository from "../src/modules/auth/authRepository";

jest.mock("../src/modules/auth/authRepository"); // Pour ce test, je vais remplacer toutes les fonctions de userRepository par des versions simulées(mockées)
const mockedAuthRepo = authRepository as jest.Mocked<typeof authRepository>; //je veux accéder à toute les fonctions du module userRepo, comme des fonctions Jest mockées(simulées)

describe("checkEmailExists", () => {
  it("doit renvoyer 409 si l'email existe déjà", async () => {
    // 1. On simule le retour de findByEmail
    mockedAuthRepo.findByEmail.mockResolvedValue({
      id: 1,
      mail: "test@test.com",
    } as unknown as RowDataPacket); // quand j'appelle la fonction findByEmail je retourne un user factice

    // 2. On crée les mocks de req, res, next
    const req = {
      body: { mail: "test@test.com" },
    } as Partial<Request> as Request; //permet de ne pas créer toutes les autres propriétés du vrai Request

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as Partial<Response> as Response; //simule une réponse

    const next = jest.fn() as NextFunction; //simule une fonction next

    // 3. On appelle le middleware
    await checkEmailExists(req, res, next);

    // 4. On vérifie les effets attendus
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.send).toHaveBeenCalledWith({
      message: "Adresse e-mail déjà existante",
    });
    expect(next).not.toHaveBeenCalled();
  });
});

// Test unitaire pour vérifier que la fonction de hachage de mot de passe fonctionne correctement : logique identique à signup dans le module auth
import bcrypt from "bcryptjs";

describe("hachage de mot de passe", () => {
  const password = "MonMotDePasse123!";

  it("génère un hash différent du mot de passe original", () => {
    const hashPassword = bcrypt.hashSync(password, 8);
    expect(hashPassword).not.toBe(password);
  });

  it("permet de vérifier le mot de passe via bcrypt.compareSync", () => {
    const hashPassword = bcrypt.hashSync(password, 8);
    const isPasswordValid = bcrypt.compareSync(password, hashPassword);
    expect(isPasswordValid).toBe(true);
  });

  it("échoue si le mot de passe est incorrect", () => {
    const hashPassword = bcrypt.hashSync(password, 8);
    const isPasswordValid = bcrypt.compareSync(
      "MauvaisMotDePasse",
      hashPassword,
    );
    expect(isPasswordValid).toBe(false);
  });
});
