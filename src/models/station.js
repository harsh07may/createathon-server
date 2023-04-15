const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  subdivision: {
    type: Schema.Types.ObjectId,
    ref: "Subdivision",
    required: true,
  },
});

const Station = mongoose.model("Station", stationSchema);

module.exports = Station;
