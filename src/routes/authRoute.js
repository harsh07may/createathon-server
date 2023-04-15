const express = require("express");
const bcrypt = require("bcryptjs");
const app = express.Router();
const User = require("../models/users");

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
 *             - admin
 *             - user
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

// app.post("/register",  (req, res) => {
//   const { name, password, role } = req.body;
//   User.findOne({ name })
//     .then((existingUser) => {
//       if (existingUser) {
//         res.status(409).json({ message: "User already exists" });
//       } else {
//         const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
//         const user = new User({ name, password, role });
//         user
//           .save()
//           .then(() => {
//             res.status(201).send("User created successfully");
//           })
//           .catch((error) => {
//             console.error(error);
//             res.status(500).send("Error creating user");
//           });
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//       res.status(500).send("Error creating user");
//     });
// });
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
    console.log(user);
    if (!user) {
      return res.status(404).send("User not Found");
    }
    const valid = await compare(password, user.rows[0].password);
    if (!valid) {
      return res.status(400).send("Username or Password is incorrect");
    }
    console.log(user);
    res.send("Successfully Logged In");
  } catch (error) {
    res.status(500).send(error);
  }
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
