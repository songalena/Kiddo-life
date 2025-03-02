const express = require("express");
const Place = require("../models/place");
const Favourite = require("../models/favourite");
const router = express.Router();
const {
  Op: { iLike, or, and, eq },
  Op,
} = require("sequelize");
const { admin } = require("../middleware/admin");
const { getUserFromToken, auth } = require("../middleware/auth");

router.get("/test", async (req, res) => {
  console.log("Places works");
  res.json({ message: "places works" });
});

router.post("/search", async (req, res) => {
  try {
    const { search, age, price, category, area } = req.body;
    const fields = ["name", "category", "description"];
    const andConditions = [];
    const searchStringConditions = fields.map((f) => {
      const obj = {};
      obj[f] = {
        [iLike]: `%${search}%`,
      };
      return obj;
    });

    andConditions.push({ [or]: searchStringConditions });

    addEqualityCondition(andConditions, "age", age);
    addEqualityCondition(andConditions, "price", price);
    addEqualityCondition(andConditions, "category", category);
    addEqualityCondition(andConditions, "area", area);

    andConditions.push({ ["approval_status"]: { [eq]: "Active" } });

    const places = await Place.findAll({ where: { [and]: andConditions } });
    await applyFavouritesFlag(req, places);
    res.json(places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searcing places", error: error });
  }
});

function addEqualityCondition(conditions, fieldName, fieldValues) {
  if (fieldValues.length > 0) {
    conditions.push({
      [fieldName]: { [Op.in]: fieldValues },
    });
  }
}

router.post("/add", async (req, res) => {
  try {
    const {
      age,
      price,
      category,
      area,
      name,
      description,
      imageUrl,
      latitude,
      longitude,
    } = req.body;
    const approval_status = "Draft";

    const place = await Place.create({
      age,
      price,
      category,
      area,
      name,
      description,
      image_src: imageUrl,
      latitude,
      longitude,
      approval_status,
    });
    res.json({
      message:
        "Place was successfully created. Please, wait for administrator approval.",
      place: place,
    });
  } catch (error) {
    res.status(500).json({ message: "Error searcing places", error: error });
  }
});

router.get("/get-drafts", admin, async (req, res) => {
  try {
    const places = await Place.findAll({ where: { approval_status: "Draft" } });
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: "Error searcing places", error: error });
  }
});

router.post("/approve", admin, async (req, res) => {
  try {
    const { placeId } = req.body;

    const place = await Place.findOne({ where: { id: placeId } });
    place.approval_status = "Active";
    await place.save();

    res.json({
      message: "Place has been approved.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error approving a place", error: error });
  }
});

router.post("/reject", admin, async (req, res) => {
  try {
    const { placeId } = req.body;

    const place = await Place.findOne({ where: { id: placeId } });
    place.approval_status = "Rejected";
    await place.save();

    res.json({
      message: "Place has been rejected.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error rejecting a place", error: error });
  }
});

router.get("/get-favourite-places", auth, async (req, res) => {
  try {
    const favourites = (
      await Favourite.findAll({
        where: { user_id: req.user.id },
      })
    ).map((f) => f.place_id);

    const places = await Place.findAll({
      where: { ["id"]: { [Op.in]: favourites } },
    });
    res.json(places);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error getting favourite places", error: error });
  }
});

router.post("/add-favourite", auth, async (req, res) => {
  try {
    console.log(req.body.placeId);
    console.log(req.user.id);
    const existingPlace = await Favourite.findOne({
      where: {
        user_id: req.user.id,
        place_id: req.body.placeId,
      },
    });
    console.log(existingPlace);
    if (existingPlace != null) {
      res.status(400).json({ message: "The place has already been added." });
      return;
    }

    await Favourite.create({
      user_id: req.user.id,
      place_id: req.body.placeId,
    });

    res.json({ message: "Successfully added a place to favourites." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error adding a favourite places", error: error });
  }
});

router.post("/remove-favourite", auth, async (req, res) => {
  try {
    const existingPlace = await Favourite.findOne({
      where: {
        user_id: req.user.id,
        place_id: req.body.placeId,
      },
    });
    if (existingPlace == null) {
      res.status(400).json({ message: "The place is not in favourites." });
      return;
    }

    await existingPlace.destroy();

    res.json({ message: "Successfully removed a place to favourites." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error removing a favourite places", error: error });
  }
});

async function applyFavouritesFlag(req, places) {
  const user = getUserFromToken(req);
  if (user == null) {
    return;
  }

  const favourites = (
    await Favourite.findAll({
      where: { user_id: user.id },
    })
  ).map((f) => f.place_id);

  favouritesSet = new Set(favourites);
  // console.log(favouritesSet);

  places.forEach((p) => {
    p.dataValues.isInFavourite = favouritesSet.has(p.id);
  });

  // console.log(places);
}

module.exports = router;
