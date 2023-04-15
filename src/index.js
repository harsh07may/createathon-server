require("dotenv").config();
const express = require("express");
// const session = require("express-session");
const app = express();
const authRoute = require("./routes/authRoute");
const sdpoRoute = require("./routes/subDivisionRoute");
const stationRoute = require("./routes/stationRoute");
const areaRoute = require("./routes/areaRoute");
const locationRoute = require("./routes/locationRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", authRoute);
app.use("/sdpo", sdpoRoute);
app.use("/station", stationRoute);
app.use("/area", areaRoute);
app.use("/location", locationRoute);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
