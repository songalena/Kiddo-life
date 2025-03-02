const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Role = require("../models/role");
const UserToRole = require("../models/user_to_role");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  admin,
  isAdmin,
  getAdminRole,
  getNonAdminRole,
} = require("../middleware/admin");
const { JWT_SECRET, admin_name, admin_password } = require("../config/secrets");

router.get("/test", async (req, res) => {
  console.log("Auth works");
  res.json({ message: "auth works" });
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    const role = await getNonAdminRole();

    await UserToRole.create({
      user_id: newUser.id,
      role_id: role.id,
    });

    res.json({ message: "User registered successfully" });
    console.log("created a new user");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering new user", error: error });
    console.error("Error occured while creating user" + error);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    const isAdminResult = await isAdmin(user.id);
    res.json({
      message: "Logged in successfully",
      token,
      username,
      isAdmin: isAdminResult,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in", error: error });
  }
});

router.post("/update-profile", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const newUsername = req.body.username;

    const existingUser = await User.findOne({
      where: { username: newUsername },
    });

    const callingUser = await User.findOne({ where: { id: userId } });

    if (callingUser.username === newUsername) {
      res
        .status(400)
        .json({ message: `This user has already the username ${newUsername}` });
      return;
    }

    if (existingUser !== null) {
      res
        .status(400)
        .json({
          message: `The username ${newUsername} has already been taken by the other user.`,
        });
      return;
    }

    callingUser.username = newUsername;
    await callingUser.save();

    res.json({ message: "Updated profile successfully", newUsername });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user profile", error: error });
  }
});

async function createDefaultAdminUser() {
  const user = await User.findOne({where: {username: admin_name}});
  if (user !== null) {
    return;
  }

  try {
    console.log('Admin user ');
    console.log(user);
  
    const hashedPassword = await bcrypt.hash(admin_password, 10);
    const createdUser = await User.create({
      username: admin_name,
      password: hashedPassword,
    });
  
    const role = await getAdminRole();
  
    await UserToRole.create({
      user_id: createdUser.id,
      role_id: role.id,
    });
  }
  catch(error) {
    console.error(error);
    throw error;
  }
}

async function createRoles() {
  const roles = await Role.findAll();
  if (roles.length > 0) {
    return;
  }

  await Role.create({
    name: "Admin",
  });

  await Role.create({
    name: "User",
  });
}

module.exports = {authRouter: router, createRoles, createDefaultAdminUser};
