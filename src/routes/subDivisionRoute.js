const express = require("express");
const app = express.Router();
const Subdivision = require("../models/subdivision");

app.get("/findall", (req, res) => {
  Subdivision.find({})
    .then((office) => {
      res.status(500).send(office);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.post("/add", (req, res) => {
  const { name } = req.body;

  Subdivision.findOne({ name })
    .then((existingOffice) => {
      if (existingOffice) {
        res.status(409).json("Already exists");
      } else {
        const newSubdivision = new Subdivision({
          name: name,
        });
        newSubdivision
          .save()
          .then(() => {
            res.status(201).send("Office created successfully");
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error creating Office");
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error creating Office");
    });
});

module.exports = app;
