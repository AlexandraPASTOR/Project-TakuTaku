"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
// Import the supertest library for making HTTP requests
const supertest_1 = __importDefault(require("supertest"));
// Import the Express application
const app_1 = __importDefault(require("../../src/app"));
// Import databaseClient
const client_1 = __importDefault(require("../../database/client"));
// Restore all mocked functions after each test
afterEach(() => {
    jest.restoreAllMocks();
});
// Test suite for the GET /api/items route
describe("GET /api/items", () => {
    it("should fetch items successfully", async () => {
        // Mock empty rows returned from the database
        const rows = [];
        // Mock the implementation of the database query method
        jest
            .spyOn(client_1.default, "query")
            .mockImplementation(async () => [rows, []]);
        // Send a GET request to the /api/items endpoint
        const response = await (0, supertest_1.default)(app_1.default).get("/api/items");
        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(rows);
    });
});
// Test suite for the GET /api/items/:id route
describe("GET /api/items/:id", () => {
    it("should fetch a single item successfully", async () => {
        // Mock rows returned from the database
        const rows = [{}];
        // Mock the implementation of the database query method
        jest
            .spyOn(client_1.default, "query")
            .mockImplementation(async () => [rows, []]);
        // Send a GET request to the /api/items/:id endpoint
        const response = await (0, supertest_1.default)(app_1.default).get("/api/items/1");
        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(rows[0]);
    });
    it("should fail on invalid id", async () => {
        // Mock empty rows returned from the database
        const rows = [];
        // Mock the implementation of the database query method
        jest
            .spyOn(client_1.default, "query")
            .mockImplementation(async () => [rows, []]);
        // Send a GET request to the /api/items/:id endpoint with an invalid ID
        const response = await (0, supertest_1.default)(app_1.default).get("/api/items/0");
        // Assertions
        expect(response.status).toBe(404);
        expect(response.body).toEqual({});
    });
});
// Test suite for the POST /api/items route
// Doesn't pass: maybe something to change in app config :/
describe("POST /api/items", () => {
    it("should add a new item successfully", async () => {
        // Mock result of the database query
        const result = { insertId: 1 };
        // Mock the implementation of the database query method
        jest
            .spyOn(client_1.default, "query")
            .mockImplementation(async () => [result, []]);
        // Fake item data
        const fakeItem = { title: "foo", user_id: 0 };
        // Send a POST request to the /api/items endpoint with a test item
        const response = await (0, supertest_1.default)(app_1.default).post("/api/items").send(fakeItem);
        // Assertions
        expect(response.status).toBe(201);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.insertId).toBe(result.insertId);
    });
    it("should fail on invalid request body", async () => {
        // Mock result of the database query
        const result = { insertId: 1 };
        // Mock the implementation of the database query method
        jest
            .spyOn(client_1.default, "query")
            .mockImplementation(async () => [result, []]);
        // Fake item data with missing user_id
        const fakeItem = { title: "foo" };
        // Send a POST request to the /api/items endpoint with a test item
        const response = await (0, supertest_1.default)(app_1.default).post("/api/items").send(fakeItem);
        // Assertions
        expect(response.status).toBe(400);
        expect(response.body).toEqual({});
    });
});
// Test suite for the PUT /api/items/:id route
// This route is not yet implemented :/
describe("PUT /api/items/:id", () => {
    it("should update an existing item successfully", async () => {
        // Mock result of the database query
        const result = { affectedRows: 1 };
        // Mock the implementation of the database query method
        jest
            .spyOn(client_1.default, "query")
            .mockImplementation(async () => [result, []]);
        // Fake item data
        const fakeItem = { title: "foo", user_id: 0 };
        // Send a PUT request to the /api/items/:id endpoint with a test item
        const response = await (0, supertest_1.default)(app_1.default).put("/api/items/42").send(fakeItem);
        // Assertions
        expect(response.status).toBe(204);
        expect(response.body).toEqual({});
    });
    it("should fail on invalid request body", async () => {
        // Mock result of the database query
        const result = { affectedRows: 1 };
        // Mock the implementation of the database query method
        jest
            .spyOn(client_1.default, "query")
            .mockImplementation(async () => [result, []]);
        // Fake item data with missing user_id
        const fakeItem = { title: "foo" };
        // Send a PUT request to the /api/items/:id endpoint with a test item
        const response = await (0, supertest_1.default)(app_1.default).put("/api/items/42").send(fakeItem);
        // Assertions
        expect(response.status).toBe(400);
        expect(response.body).toEqual({});
    });
    it("should fail on invalid id", async () => {
        // Mock result of the database query
        const result = { affectedRows: 0 };
        // Mock the implementation of the database query method
        jest
            .spyOn(client_1.default, "query")
            .mockImplementation(async () => [result, []]);
        // Fake item data with missing user_id
        const fakeItem = { title: "foo", user_id: 0 };
        // Send a PUT request to the /api/items/:id endpoint with a test item
        const response = await (0, supertest_1.default)(app_1.default).put("/api/items/43").send(fakeItem);
        // Assertions
        expect(response.status).toBe(404);
        expect(response.body).toEqual({});
    });
});
// Test suite for the DELETE /api/items/:id route
// This route is not yet implemented :/
describe("DELETE /api/items/:id", () => {
    it("should delete an existing item successfully", async () => {
        // Mock result of the database query
        const result = { affectedRows: 1 };
        // Mock the implementation of the database query method
        jest
            .spyOn(client_1.default, "query")
            .mockImplementation(async () => [result, []]);
        // Send a DELETE request to the /api/items/:id endpoint
        const response = await (0, supertest_1.default)(app_1.default).delete("/api/items/42");
        // Assertions
        expect(response.status).toBe(204);
        expect(response.body).toEqual({});
    });
    it("should fail on invalid id", async () => {
        // Mock result of the database query
        const result = { affectedRows: 0 };
        // Mock the implementation of the database query method
        jest
            .spyOn(client_1.default, "query")
            .mockImplementation(async () => [result, []]);
        // Send a DELETE request to the /api/items/:id endpoint
        const response = await (0, supertest_1.default)(app_1.default).delete("/api/items/43");
        // Assertions
        expect(response.status).toBe(404);
        expect(response.body).toEqual({});
    });
});
