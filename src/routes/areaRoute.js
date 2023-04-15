const express = require("express");
const app = express.Router();
const Station = require("../models/station");
const Area = require("../models/area");

app.get("/findall", (req, res) => {
  Area.find({})
    .then((area) => {
      res.status(500).send(area);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.get("/findAreas", (req, res) => {
  const STATION_ID = "64392f5be3f19933cdff65fb";
  Area.find({ station: STATION_ID })
    .populate("station", "-_id -__v")
    .exec()
    .then((areas) => {
      res.send(areas);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.post("/add", (req, res) => {
  const { name, station_id } = req.body;

  Station.findById(station_id)
    .then((station) => {
      if (!station) {
        return res.status(400).json("Invalid Station number");
      }
      Area.findOne({ name })
        .then((existingArea) => {
          if (existingArea) {
            res.status(409).json("Already exists");
          } else {
            const newArea = new Area({
              name: name,
              station: station_id,
            });
            newArea
              .save()
              .then(() => {
                res.status(201).send("Area created successfully");
              })
              .catch((error) => {
                console.error(error);
                res.status(500).send("Error creating Area");
              });
          }
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Error creating Area");
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error creating Area");
    });
});

module.exports = app;
