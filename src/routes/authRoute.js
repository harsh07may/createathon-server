const express = require("express");
const bcrypt = require("bcryptjs");
const app = express.Router();
const User = require("../models/users");

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
