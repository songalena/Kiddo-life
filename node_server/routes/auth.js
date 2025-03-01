const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();
const auth = require('../middleware/auth');
const JWT_SECRET = require('../config/secrets');

router.get('/test', async (req, res) => {
  console.log('Auth works')
  res.json({message: 'auth works'})
})

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({
      username,
      password: hashedPassword
    });
    res.json({ message: "User registered successfully" });
    console.log('created a new user')
  } catch (error) {
    res.status(500).json({ message: "Error registering new user", error: error });
    console.error('Error occured while creating user' + error)
  }
});


router.post('/login', async (req, res) => {
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

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' }); // Use a more secure secret key and manage via environment variables
    res.json({ message: "Logged in successfully", token, username });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error });
  }
});

router.post('/update-profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const newUsername = req.body.username;
    
    const existingUser = await User.findOne({ where: { username: newUsername } });

    const callingUser = await User.findOne({ where: { id: userId } });

    if (callingUser.username === newUsername) {
      res.status(400).json({ message: `This user has already the username ${newUsername}`});
      return;
    }

    if (existingUser !== null) {
      res.status(400).json({ message: `The username ${newUsername} has already been taken by the other user.`});
      return;
    }

    callingUser.username = newUsername;
    await callingUser.save()

    res.json({ message: "Updated profile successfully", newUsername });
  } catch (error) {
    res.status(500).json({ message: "Error updating user profile", error: error });
  }
});

module.exports = router;