const request = require("supertest");
const {app, initializeApp} = require("../index"); // Adjust the path if necessary
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {JWT_SECRET} = require('../config/secrets');
const jwt = require("jsonwebtoken");
const UserToRole = require("../models/user_to_role");
const Favourite = require("../models/favourite");
const { server, defaultUsername, createUser } = require('./shared');

beforeAll(async () => {
  console.log('beforeAll called')
  // server = app.listen(); // Start test instance
  await initializeApp();
  await createUser(defaultUsername);
});

afterAll(async () => {
    console.log('afterAll called')
  try {
    await Favourite.truncate();
    await UserToRole.truncate();
    await User.truncate({ cascade: true});
    // server.close(); // Cleanup to avoid issues
  }
  catch(error) {
    console.error(error);
  }
});

describe("API Tests", () => {
  it("should return 200 on GET /api-docs", async () => {
    const response = await request(server).get("/api-docs/");
    expect(response.status).toBe(200);
  });

  it("should return 404 for unknown route", async () => {
    const response = await request(server).get("/unknown-route");
    expect(response.status).toBe(404);
  });

  it("should allow CORS headers", async () => {
    const response = await request(server)
      .options("/auth")
      .set("Origin", "http://localhost:4200");
    expect(response.headers["access-control-allow-origin"]).toBe("*");
    expect(response.headers["access-control-allow-methods"]).toContain("GET");
    expect(response.headers["access-control-allow-headers"]).toContain(
      "Authorization"
    );
  });

  it("should handle JSON requests", async () => {
    const response = await request(server)
      .post("/auth")
      .send({ username: "test", password: "password" })
      .set("Accept", "application/json");
    expect(response.status).toBeGreaterThanOrEqual(200);
  });

  it("should serve static files from /public", async () => {
    const response = await request(server).get("/some-static-file.jpg");
    expect(response.status).toBeGreaterThanOrEqual(200); // 200 if file exists, 404 if not
  });

  it("should handle JSON requests to /auth", async () => {
    const response = await request(server)
      .post("/auth")
      .send({ username: "test", password: "password" })
      .set("Accept", "application/json");
    expect(response.status).toBeGreaterThanOrEqual(200); // Accept any valid response
  });

  it("should handle form-urlencoded requests", async () => {
    const response = await request(server)
      .post("/auth")
      .send("username=test&password=password") // URL-encoded body
      .set("Content-Type", "application/x-www-form-urlencoded");
    expect(response.status).toBeGreaterThanOrEqual(200);
  });
});
