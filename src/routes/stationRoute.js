const express = require("express");
const app = express.Router();
const mongoose = require("mongoose");
const Station = require("../models/station");
const Subdivision = require("../models/subdivision");

app.get("/findall", (req, res) => {
  Station.find({})
    .then((station) => {
      res.status(500).send(station);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.get("/findStations", (req, res) => {
  const SUBDIVISION_ID = "64392f5be3f19933cdff65fb";
  Station.find({ subdivision: SUBDIVISION_ID })
    .populate("subdivision", "-_id -__v")
    .exec()
    .then((stations) => {
      res.send(stations);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.post("/add", (req, res) => {
  const { name, subdivision_id } = req.body;

  Subdivision.findById(subdivision_id)
    .then((subdivisionOffice) => {
      if (!subdivisionOffice) {
        return res.status(400).json("Invalid Subdivision number");
      }
      Station.findOne({ name })
        .then((existingOffice) => {
          if (existingOffice) {
            res.status(409).json("Already exists");
          } else {
            const newStation = new Station({
              name: name,
              subdivision: subdivision_id,
            });
            newStation
              .save()
              .then(() => {
                res.status(201).send("Station created successfully");
              })
              .catch((error) => {
                console.error(error);
                res.status(500).send("Error creating Station");
              });
          }
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Error creating Station");
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error creating Station");
    });
});

module.exports = app;
