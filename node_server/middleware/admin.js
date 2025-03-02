const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/secrets");
const UserToRole = require("../models/user_to_role");
const Role = require("../models/role");

const admin = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;

    const isAdminRole = await isAdmin(user.id);
    if (!isAdminRole) {
        return res.status(401).json({ error: "Access denied. User is not an admin." });
    }
    next();
  } catch (error) {
    console.error(error);
    console.error("Invalid Token " + token );
    res.status(400).json({ error: "Invalid Token " + token });
  }
};

async function isAdmin(userId) {
  const linkedRoles = await UserToRole.findAll({ where: { user_id: userId } });
  const role = await getAdminRole();

  return linkedRoles.some((r) => r.role_id === role.id);
}

async function getAdminRole() {
  return await Role.findOne({ where: { name: "Admin" } });
}

async function getNonAdminRole() {
  return await Role.findOne({ where: { name: "User" } });
}

module.exports = {admin, isAdmin, getAdminRole, getNonAdminRole};
