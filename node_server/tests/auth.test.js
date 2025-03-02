const request = require("supertest");
const User = require("../models/user");
const { server, defaultUsername, createUser } = require("./shared");
const {initializeApp} = require("../index"); // Adjust the path if necessary
const UserToRole = require("../models/user_to_role");
const Favourite = require("../models/favourite");

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

describe("Auth Routes", () => {

  it("should return 200 on GET /auth/test", async () => {
    const response = await request(server).get("/auth/test");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("auth works");
  });

  it("should register a new user successfully", async () => {
    const response = await request(server)
      .post("/auth/register")
      .send({ username: "newuser", password: "securepassword" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User registered successfully");

    const newUser = await User.findOne({ where: { username: "newuser" } });
    expect(newUser).not.toBeNull();
  });

  it("should not register a user with an existing username", async () => {
    await createUser(defaultUsername);
    const response = await request(server)
      .post("/auth/register")
      .send({ username: "testuser", password: "securepassword" });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error registering new user");
  });

  it("should login with valid credentials", async () => {
    const response = await request(server)
      .post("/auth/login")
      .send({ username: "testuser", password: "testpassword" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Logged in successfully");
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("isAdmin");
  });

  it("should not login with incorrect password", async () => {
    const response = await request(server)
      .post("/auth/login")
      .send({ username: "testuser", password: "wrongpassword" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should not login with a non-existent username", async () => {
    const response = await request(server)
      .post("/auth/login")
      .send({ username: "nonexistent", password: "password" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  it("should update profile successfully", async () => {
    const { user, userToken } = await createUser(defaultUsername);
    const response = await request(server)
      .post("/auth/update-profile")
      .send({ username: "updateduser" })
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Updated profile successfully");

    const updatedUser = await User.findOne({
      where: { username: "updateduser" },
    });
    expect(updatedUser).not.toBeNull();
  });

  it("should not update profile with an existing username", async () => {
    const { userToken } = await createUser(defaultUsername);
    await createUser("existinguser");

    const response = await request(server)
      .post("/auth/update-profile")
      .send({ username: "existinguser" })
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `The username existinguser has already been taken by the other user.`
    );

    await User.destroy({ where: { username: "existinguser" } });
  });

  it("should not update profile if the same username is provided", async () => {
    const { userToken } = await createUser(defaultUsername);
    const response = await request(server)
      .post("/auth/update-profile")
      .send({ username: "testuser" })
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `This user has already the username testuser`
    );
  });
});
