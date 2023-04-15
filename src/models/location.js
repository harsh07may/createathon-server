const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  area: {
    type: Schema.Types.ObjectId,
    ref: "Area",
    required: true,
  },
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
