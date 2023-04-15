const express = require("express");
const app = express.Router();
const Location = require("../models/location");
const Area = require("../models/area");

app.get("/findall", (req, res) => {
  Location.find({})
    .then((location) => {
      res.status(500).send(location);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.get("/findLocations", (req, res) => {
  const STATION_ID = req.query;
  Location.find({ area: STATION_ID })
    .populate("area", "-_id -__v")
    .exec()
    .then((locations) => {
      res.send(locations);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.post("/add", (req, res) => {
  const { name, area_id } = req.body;

  Area.findById(area_id)
    .then((area) => {
      if (!area) {
        return res.status(400).json("Invalid Area number");
      }
      Location.findOne({ name })
        .then((existingLocation) => {
          if (existingLocation) {
            res.status(409).json("Already exists");
          } else {
            const newLocation = new Location({
              name: name,
              area: area_id,
            });
            newLocation
              .save()
              .then(() => {
                res.status(201).send("Location created successfully");
              })
              .catch((error) => {
                console.error(error);
                res.status(500).send("Error creating Location");
              });
          }
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Error creating Location");
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error creating Location");
    });
});

module.exports = app;
