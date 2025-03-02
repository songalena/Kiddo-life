const request = require("supertest");
const { initializeApp } = require("../index"); // Adjust the path if necessary
const User = require("../models/user");
const UserToRole = require("../models/user_to_role");
const Favourite = require("../models/favourite");
const { server, defaultUsername, createUser } = require("./shared");
const { JWT_SECRET, admin_name, admin_password } = require("../config/secrets");

beforeAll(async () => {
  console.log("beforeAll called");
  // server = app.listen(); // Start test instance
  await initializeApp();
  await createUser(defaultUsername);
  await addSamplePlace();
});

afterAll(async () => {
  console.log("afterAll called");
  try {
    await Favourite.truncate();
    // server.close(); // Cleanup to avoid issues
  } catch (error) {
    console.error(error);
  }
});

describe("Places Routes", () => {
  it("should return 200 on GET /places/test", async () => {
    const response = await request(server).get("/places/test");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("places works");
  });

  it("should search for places based on filters", async () => {
    const response = await request(server)
      .post("/places/search")
      .send({
        search: "restaurant",
        age: ["3+"],
        price: ["$", "$$"],
        category: ["restaurants", "cafes"],
        area: ["Chilonzor", "Mirzo Ulugbek"],
      });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);

    const places = response.body;
    places.forEach((place) => {
      expect(["restaurants", "cafes"]).toContain(place.category);
      expect(["3+"]).toContain(place.age);
      expect(["Chilonzor", "Mirzo Ulugbek"]).toContain(place.area);
    });
  });

  it("should add a place successfully", async () => {
    const response = await addSamplePlace();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Place was successfully created. Please, wait for administrator approval."
    );
    expect(response.body.place.name).toBe("Best Restaurant");
  });

  it("should return drafts for admin", async () => {
    const { user, userToken } = await createUser(admin_name);
    
    const response = await request(server)
      .get("/places/get-drafts")
      .set("Authorization", `Bearer ${userToken}`); // assuming adminToken is defined

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("should approve a place successfully", async () => {
    const place = await addSamplePlace();
    const { user, userToken } = await createUser(admin_name);
    
    const response = await request(server)
      .post("/places/approve")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ placeId: place.body.place.id });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Place has been approved.");
  });

  it("should reject a place successfully", async () => {
    const {user, userToken} = await createUser(admin_name);
    
    const samplePlace = await addSamplePlace();
    const response = await request(server)
      .post("/places/reject")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ placeId: samplePlace.body.place.id });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Place has been rejected.");
  });

  it("should add a place to favourites", async () => {
    const {userToken, place, favResponse} = await addPlaceToFavourites();

    expect(favResponse.status).toBe(200);
    expect(favResponse.body.message).toBe(
      "Successfully added a place to favourites."
    );
  });

  it("should remove a place from favourites", async () => {
    const {userToken, place, favResponse} = await addPlaceToFavourites();
    
    const response = await request(server)
      .post("/places/remove-favourite")
      .send({ placeId: place.body.place.id })
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Successfully removed a place to favourites."
    );
  });
});

async function addSamplePlace() {
    const { user, userToken } = await createUser(defaultUsername);
    const result = await request(server)
      .post("/places/add")
      .send({
        age: "3+",
        price: '$$',
        category: "restaurants",
        area: "Chilonzor",
        name: "Best Restaurant",
        description: "A family-friendly restaurant",
        imageUrl: "http://example.com/restaurant.jpg",
        latitude: 41.3164, // Chilonzor coordinates
        longitude: 69.2676, // Chilonzor coordinates
      })
      .set("Authorization", `Bearer ${userToken}`);
      return result;
  }

  async function addPlaceToFavourites() {
    const { user, userToken } = await createUser(defaultUsername);
    
    const place = await addSamplePlace();
    const favResponse = await request(server)
      .post("/places/add-favourite")
      .send({ placeId: place.body.place.id  }) // Assuming placeId 1 exists
      .set("Authorization", `Bearer ${userToken}`);

    return {userToken, place, favResponse}
  }