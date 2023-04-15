const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const areaSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  station: {
    type: Schema.Types.ObjectId,
    ref: "Station",
    required: true,
  },
});

const Area = mongoose.model("Area", areaSchema);

module.exports = Area;
