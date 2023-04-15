const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subdivisionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const Subdivision = mongoose.model("Subdivision", subdivisionSchema);

module.exports = Subdivision;
