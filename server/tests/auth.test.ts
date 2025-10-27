// Test unitaire pour vérifier la fonction de hachage de mot de passe : logique identique à signup dans le module auth
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

// Test unitaire pour vérifier la fonction middleware checkEmailExists
import type { NextFunction, Request, Response } from "express";
import type { RowDataPacket } from "mysql2";
import { checkEmailExists } from "../src/middleware/checkEmailExists";
import authRepository from "../src/modules/auth/authRepository";

jest.mock("../src/modules/auth/authRepository"); 
const mockedAuthRepo = authRepository as jest.Mocked<typeof authRepository>; 

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
