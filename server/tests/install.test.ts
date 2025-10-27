import "dotenv/config";

import fs from "node:fs";

// Test pour vérifier si le ficher .env existe bien
describe("Installation", () => {
  test("You have created /server/.env", async () => {
    expect(fs.existsSync(`${__dirname}/../.env`)).toBe(true);
  });
});

// Test pour vérifier si le ficher App.tsx existe bien
describe("Installation", () => {
  test("You have created /client/src/App.tsx", async () => {
    expect(fs.existsSync(`${__dirname}/../../client/src/App.tsx`)).toBe(true);
  });
});