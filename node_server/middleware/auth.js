const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/secrets");

const auth = (req, res, next) => {
  try {
    const decode = getUserFromToken(req);
    if (decode == null) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }
    req.user = decode;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid Token" });
  }
};

function getUserFromToken(req) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return null;
  const decode = jwt.verify(token, JWT_SECRET);
  return decode;
}

module.exports = { auth, getUserFromToken };
