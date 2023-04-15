const express = require("express");
const bcrypt = require("bcryptjs");
const app = express.Router();
const User = require("../models/users");
const authMiddleware = require("../middleware/authMiddleware");
const { createAccessToken, createRefreshToken } = require("../utils/token");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - password
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name
 *         password:
 *           type: string
 *           description: The user's password
 *         role:
 *           type: string
 *           description: The user's role
 *           enum:
 *             [admin,user]
 *       example:
 *         name: John Doe
 *         password: 123456
 *         role: user
 *
 * /user/findall:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request. Could not get users.
 *       500:
 *         description: Internal server error.
 */

app.get("/findall", (req, res) => {
  User.find({})
    .then((users) => {
      res.status(500).send(users);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});
/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *     responses:
 *       '201':
 *         description: User created successfully
 *       '409':
 *         description: User already exists
 *       '500':
 *         description: Error creating user
 */

app.post("/register", async (req, res) => {
  const { name, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      res.status(409).send("User already exists");
    } else {
      const hashedPwd = await bcrypt.hash(password, 10);
      const user = new User({ name, password: hashedPwd, role });
      await user.save();
      res.status(201).send("User created successfully");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { name, password, role } = req.body;
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(404).send("User not Found");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).send("Username or Password is incorrect");
    }

    const accessToken = createAccessToken(user._id, user.name, user.role);
    const refreshToken = createRefreshToken(user._id, user.name, user.role);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/user/refresh_token",
      sameSite: "none",
    });
    res.send({ accessToken });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", { path: "/user/refresh_token" });
  return res.send({
    message: "Logged Out",
  });
});

app.post("/update", async (req, res) => {
  const { Oldname, name } = req.body;
  User.findOneAndUpdate(
    { name: Oldname },
    { $set: { name: name } },
    { new: true }
  )
    .then((updatedUser) => {
      console.log(updatedUser);
    })
    .catch((error) => {
      console.error(error);
    });
});

module.exports = app;
