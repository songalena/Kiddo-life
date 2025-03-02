const express = require("express");
const Place = require("../models/place");
const router = express.Router();
const {
  Op: { iLike, or, and, eq },
  Op,
} = require("sequelize");
const {admin} = require("../middleware/admin");

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
    res.json(places);
  } catch (error) {
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
    const {placeId} = req.body;

    const place = await Place.findOne({ where: { id: placeId } });
    place.approval_status = "Active";
    await place.save();
    
    res.json({
      message:
        "Place has been approved.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error approving a place", error: error });
  }
});

router.post("/reject", admin, async (req, res) => {
  try {
    const {placeId} = req.body;

    const place = await Place.findOne({ where: { id: placeId } });
    place.approval_status = "Rejected";
    await place.save();

    res.json({
      message:
        "Place has been rejected.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error rejecting a place", error: error });
  }
});

module.exports = router;
