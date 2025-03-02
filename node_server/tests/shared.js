const {app} = require("../index"); // Adjust the path if necessary
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {JWT_SECRET} = require('../config/secrets');
const jwt = require("jsonwebtoken");

const defaultUsername = "testuser";
let server = app.listen();

async function createUser(username) {
    const user = await User.findOne({ where: { username: username } });
    // console.log(user);
    if (user != null) {
      const userToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
      return {user, userToken};
    }

    console.log('Default user');
    console.log(user);
    const hashedPassword = await bcrypt.hash("testpassword", 10);
    const testUser = await User.create({
      username,
      password: hashedPassword,
    });
    const userToken = jwt.sign({ id: testUser.id }, JWT_SECRET, { expiresIn: "1h" });
    return {testUser, userToken};
}

module.exports = { server, defaultUsername, createUser };