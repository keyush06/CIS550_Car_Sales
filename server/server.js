const express = require("express");
const cors = require("cors");
const config = require("./config");
const routes = require("./routes");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get("/cars_by_region", routes.state_cars);
app.get("/get_statistics", routes.get_statistics);
app.get("/cars_by_criteria", routes.criteria_cars);
app.get("/average_price", routes.averagePrice);
app.get("/cars_by_price_range", routes.carsByPriceRange);
app.get("/cars_by_geolocation", routes.geo_cars);
app.get("/cars_with_safety_features", routes.carsWithSafetyFeatures);
app.get("/gas_pricing_analysis", routes.gasPricingAnalysis);
app.get("/similar_cars", routes.similar_cars);
// app.get("/compare_cars", routes.compare_cars);
app.get("/criteria_by_region_and_state", routes.criteria_by_region_and_state);

app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
