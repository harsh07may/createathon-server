require("dotenv").config();
const express = require("express");
const app = express();
const authRoute = require("./routes/authRoute");
const sdpoRoute = require("./routes/subDivisionRoute");
const stationRoute = require("./routes/stationRoute");
const areaRoute = require("./routes/areaRoute");
const locationRoute = require("./routes/locationRoute");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Createathon API",
      version: "1.0.0",
      description: "Createathon API documented in Swagger",
    },
    servers: [
      {
        url: "http://localhost:5000/",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

app.use("/user", authRoute);
app.use("/sdpo", sdpoRoute);
app.use("/station", stationRoute);
app.use("/area", areaRoute);
app.use("/location", locationRoute);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
