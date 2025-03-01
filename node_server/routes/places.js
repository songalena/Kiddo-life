const express = require("express");
const Place = require("../models/place");
const router = express.Router();
const { Op:{iLike, or, and, eq} } = require('sequelize');

router.get("/test", async (req, res) => {
  console.log("Places works");
  res.json({ message: "places works" });
});

router.post("/search", async (req, res) => {
  try {
    const {search, age, price, category, area} = req.body;
    const fields = ["name", "category", "description"];
    const andConditions = []
    const searchStringConditions = fields.map((f) => {
      const obj =  {};
      obj[f] = {
        [iLike]: `%${search}%`,
      };
      return obj; 
    });

    andConditions.push({[or]: searchStringConditions});

    addEqualityCondition(andConditions, 'age', age);
    addEqualityCondition(andConditions, 'price', price);
    addEqualityCondition(andConditions, 'category', category);
    addEqualityCondition(andConditions, 'area', area);

    const places = await Place.findAll({ where: { [and]: andConditions }});
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: "Error searcing places", error: error });
  }
});

function addEqualityCondition(conditions, fieldName, fieldValue) {
  if (fieldValue !== '') {
    conditions.push({
      [fieldName]: {[eq]: fieldValue}
    })
  }
}

module.exports = router;
