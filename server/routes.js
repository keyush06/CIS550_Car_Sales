const mysql = require("mysql");
const config = require("./config.json");

// Creates MySQL connection using database credentials provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
});
connection.connect((err) => err && console.log(err));

// Route 1: GET /cars_by_region: Retrieves Cars based on region
// Used in: Search by Location Page
// Request Parameters: state: string, region: string, pageSize: int, offset: int
// Response Parameters: Car Data based on conditions
const state_cars = async function (req, res) {
  const { state } = req.query;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10; // Default to 10 if not provided
  const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0; // Default to 0 if not provided

  const query = `
    WITH ListTable AS (
      SELECT id, vin, price, state, image, description, \`condition\`
      FROM Listing
    ),
    CarTable AS (
      SELECT vin, manufacturer, model
      FROM Cars
    )
    SELECT *
    FROM ListTable L
    JOIN CarTable C ON L.vin = C.vin
    WHERE L.state = '${state}'
    LIMIT ${pageSize} OFFSET ${offset};
  `;
  connection.query(query, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to execute query" });
    } else {
      res.json(data);
    }
  });
};

// Route 2: GET /get_statistics: Gets the car database statistics
// Used in: Home Page
// Request Parameters: None
// Response Parameters: Car Database Statistics.
const get_statistics = async function (req, res) {
  const query = `
    WITH
  ListTable AS (
      SELECT id, price, state, \`condition\`, odometer, color, year
      FROM Listing
  ),
  PriceTable AS (
      SELECT state, year, AVG(price) AS avg_price
      FROM ListTable JD1
      GROUP BY state,year
  ),
  OdometerTable AS (
      SELECT state, year,AVG(odometer) AS avg_odometer
      FROM ListTable JD1
      GROUP BY state,year
  )
  SELECT
    P.state AS state, P.year as year,
    avg(avg_price) as avg_price,
    avg(avg_odometer) as avg_odometer
  FROM PriceTable P JOIN OdometerTable O ON P.state = O.state
  AND P.year = O.year
  GROUP BY P.state, P.year
  ORDER BY avg_price DESC;
 `;
  // Execute the query
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
};

// Route 3: GET/cars_by_criteria: Retrieves Cars based on the advanced search filters
// Used in: Advanced Search Page
// Request Parameters: make: string, model:string, start_year:int, end_year:int, condition:string, pageSize:int, offset:int
// Response Parameters: Car Data based on given conditions
const criteria_cars = async function (req, res) {
  var {
    manufacturer,
    model,
    start_year,
    end_year,
    condition,
    pageSize,
    offset,
  } = req.query;
  manufacturer = manufacturer ?? "";
  model = model ?? "";
  start_year = start_year ?? 2000;
  end_year = end_year ?? 2023;
  condition = condition ?? "";
  pageSize = pageSize ?? 10;
  offset = offset ?? 0;
  const query = `
   WITH ListTable AS (
        SELECT id, vin, price, region, state, image, description, \`condition\`, year
        FROM Listing),
        CarTable AS (
        SELECT vin, manufacturer, model
        FROM Cars)
    SELECT *
    FROM ListTable L JOIN CarTable C ON L.vin = C.vin
    WHERE manufacturer LIKE '%${manufacturer}%'
    AND model LIKE '%${model}%'
    AND \`condition\` LIKE '%${condition}'
    AND year BETWEEN ${start_year} AND ${end_year}
    LIMIT ${pageSize} OFFSET ${offset};
 `;
  // Execute the query
  connection.query(
    query,
    [manufacturer, model, start_year, end_year, condition, pageSize, offset],
    (err, data) => {
      if (err) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    }
  );
};

// Route 4: GET /average_price: Retrieves Average car price based on year
// Used in: Home Page
// Request Parameters: manufacturer: string, model:string, start_year:int, end_year:int
// Response Parameters: Average car price based on the given condition.
const averagePrice = async function (req, res) {
  const { startYear, endYear } = req.query;

  if (!startYear || !endYear) {
    res
      .status(400)
      .json({ error: "Start year and end year must be provided." });
    return;
  }

  const query = `
    WITH VehicleStats AS (
      SELECT AVG(price) AS avg_price
      FROM Listing
      WHERE year BETWEEN ${startYear} AND ${endYear}
    )
    SELECT avg_price FROM VehicleStats;
  `;

  // Execute the query
  connection.query(query, [startYear, endYear], (err, data) => {
    if (err) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
};

// Route 5: GET /cars_by_price_range, Search by Price
// Used in: Search by Price
// Request Parameters: priceLow: int, priceHigh: int, sort: string
// Response Parameters: Fetching cars based on the range of prices provided by the user.
const carsByPriceRange = async function (req, res) {
  const {
    priceLow,
    priceHigh,
    sort,
    sortDirection = "ASC",
    page = 1,
    limit = 10,
  } = req.query;
  const offset = (page - 1) * limit;
  const query = `
    WITH ListTable AS (
      SELECT id, vin, price, region, state, image, description, \`condition\`
      FROM Listing),
    CarTable AS (
      SELECT vin, manufacturer, model
      FROM Cars)
    SELECT *
    FROM ListTable L JOIN CarTable C ON L.vin = C.vin
    WHERE L.price BETWEEN ${priceLow} AND ${priceHigh}
    ORDER BY price ${sortDirection}
    LIMIT ${limit} OFFSET ${offset};
  `;

  // Execute the query
  connection.query(query, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(data);
    }
  });
};

// Route 6: GET /cars_by_geolocation, Search by Geolocation, new page
// Used in: Geolocation page
// Request Parameters: lat: int, lon: int, latRange:int, lonRange:int, pageSize:int, offset:int
// Response Parameters: Fetching cars based on the location of the availability of the cars
const geo_cars = async function (req, res) {
  console.log(req.query);
  const { lat, lon, latRange, lonRange, pageSize, offset } = req.query;

  // Parse and calculate latitude and longitude boundaries
  const latMin = parseFloat(lat) - parseFloat(latRange);
  const latMax = parseFloat(lat) + parseFloat(latRange);
  const lonMin = parseFloat(lon) - parseFloat(lonRange);
  const lonMax = parseFloat(lon) + parseFloat(lonRange);

  // Prepare SQL query using placeholders for parameters
  const query = `
    WITH ListTable AS (
      SELECT id, vin, price, region, state, image, description, \`condition\`, lat, \`long\`
      FROM Listing
    ),
    CarTable AS (
      SELECT vin, manufacturer, model
      FROM Cars
    )
    SELECT *
    FROM ListTable L
    JOIN CarTable C ON L.vin = C.vin
    WHERE L.lat BETWEEN ${latMin} AND ${latMax}
      AND L.long BETWEEN ${lonMin} AND ${lonMax}
    LIMIT ${pageSize} OFFSET ${offset};
  `;

  // Parameter array for safe SQL execution
  const params = [
    latMin,
    latMax,
    lonMin,
    lonMax,
    parseInt(pageSize, 10),
    parseInt(offset, 10),
  ];

  // Execute the query safely
  connection.query(query, params, (err, data) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Failed to fetch data" });
    } else {
      res.json(data);
      console.log(data);
    }
  });
};

// Route 7: GET/carsWithSafetyFeatures: retrieves cars that match the description given by the user
// Used in: Search by Description Page
// Request Parameters: description: string, pageSize:int, offset:int
// Response Parameters: Cars fetched based on the desription input by the user
const carsWithSafetyFeatures = async function (req, res) {
  var { description, pageSize, offset } = req.query;
  // Set default values for pagination if not provided
  pageSize = pageSize || 20;
  offset = offset || 0;

  const query = `
    WITH ListTable AS (
      SELECT id, vin, price, region, state, image, description, \`condition\`
      FROM Listing
    ),
    CarTable AS (
      SELECT vin, manufacturer, model
      FROM Cars
    )
    SELECT *
    FROM ListTable L
    JOIN CarTable C ON L.vin = C.vin
    WHERE description LIKE '%${description}%'
    LIMIT ${pageSize} OFFSET ${offset};
  `;

  // Execute the query
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to execute query" });
    } else {
      res.json(results);
    }
  });
};

// Route 8: GET/gasPricingAnalysis: Retrieves cars with user-specified features within a given price range
// Used in: Search and Results Page
// Request Parameters: lowerPriceLimit: int, upperPriceLimit: int, pageSize: int, offset: int
// Response Parameters: Cars with user-specified features within a given price range
const gasPricingAnalysis = async function (req, res) {
  const { lowerPriceLimit, upperPriceLimit } = req.query;

  // Validate required parameters
  if (!lowerPriceLimit || !upperPriceLimit) {
    return res.status(400).json({
      error: "Both lowerPriceLimit and upperPriceLimit are required.",
    });
  }

  const query = `
    WITH Comparison AS (
      SELECT C.manufacturer, C.model, L.price, L.year, L.state
      FROM Cars C
      INNER JOIN (
        SELECT * FROM Listing
        WHERE price BETWEEN 0 AND 10000
      ) L ON C.vin = L.vin
      WHERE C.fuel = 'gas'
    )
    SELECT manufacturer, model, AVG(price) AS avg_price, COUNT(*) AS num_listings
    FROM Comparison
    GROUP BY manufacturer, model
    HAVING AVG(price) BETWEEN ${lowerPriceLimit} AND ${upperPriceLimit}
    ORDER BY num_listings DESC;
  `;

  // Execute the query
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to execute query" });
    } else {
      res.json(results);
    }
  });
};

// Route 9: GET/similar_cars: Retrieves cars with comparable prices
// Used in: Comparison Page
// Request Parameters: pageSize: int, offset: int
// Response Parameters: Cars with price comparable to price specified by user
const similar_cars = async function (req, res) {
  const { pageSize, offset, minPrice } = req.query;
  const query = `
  WITH SimListings AS (
    SELECT L1.id AS ListingID1, L2.id AS ListingID2, L1.price AS Price1, L2.price AS Price2, L1.vin AS VIN1, L2.vin AS VIN2, L1.year as year1, L2.year AS year2
    FROM Listing L1 CROSS JOIN Listing L2
    WHERE ABS(L1.price - L2.price) < 1000 AND L1.price > ${minPrice} AND  L2.price > ${minPrice} AND L1.id <> L2.id
       ),
      CarTable AS (
    SELECT vin, manufacturer, model
    FROM Cars)
    SELECT S.ListingID1, S.ListingID2, S.Price1, S.Price2, S.VIN1, S.VIN2, S.Year1, S.Year2, C1.manufacturer AS Man1, C2.manufacturer AS Man2, C1.model AS Model1, C2.model AS Model2
      FROM CarTable C1
      JOIN SimListings S ON S.VIN1 = C1.VIN
      JOIN CarTable C2 ON S.VIN2 = C2.VIN
      WHERE C1.VIN <> C2.VIN
      LIMIT ${pageSize} OFFSET ${offset};
 `;
  // Execute the query
  connection.query(query, [pageSize, offset], (err, data) => {
    if (err) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
};

// Route 10: GET/compare_cars: Retrieves manufacturer, price, model, transmission of a car selected by the user
// across different regions and states
// Used in: Home Page
// Request Parameters: pageSize: int, offset: int
// Response Parameters: Cars with manufacturer, price, model, transmission of a car selected by the user
// across different regions and states
const compare_cars = async function (req, res) {
  const { pageSize, offset } = req.params;
  const query = `SELECT
   C1.manufacturer AS Manufacturer1,
   C2.manufacturer AS Manufacturer2,
   C1.model AS Model,
   C1.transmission AS Transmission1,
   C2.transmission AS Transmission2,
   L1.price AS Price1,
   L2.price AS Price2,
   L1.region AS Region1,
   L2.region AS Region2
FROM Cars C1
JOIN Cars C2 ON C1.model = C2.model
JOIN Listing L1 ON C1.vin = L1.Vin
JOIN Listing L2 ON C2.vin = L2.Vin AND L1.region <> L2.region
ORDER BY C1.model, L1.price, L2.price
LIMIT ${pageSize} OFFSET ${offset};
`;
  // Execute the query
  connection.query(query, [pageSize, offset], (err, data) => {
    if (err) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
};

// Route 11: GET /criteria_by_region_and_state: Retrieves cars by state and price range
// Used in: Car comparison page
// Request Parameters: car_vin: string
// Response Parameters: Cars in the same state and price range as the car the user has selected
const criteria_by_region_and_state = async function (req, res) {
  const { car_vin } = req.query;
  console.log("Car Vin", car_vin);
  const query = `
WITH SelectedCar AS (
   SELECT L.price, L.state
   FROM Listing L
   JOIN Cars C ON L.Vin = C.vin
   WHERE C.vin = '${car_vin}'
),
SimilarCars AS (
   SELECT C.vin, C.manufacturer, C.model, L.price, L.state
   FROM Cars C
   JOIN Listing L ON C.vin = L.Vin
   WHERE L.state = (SELECT state FROM SelectedCar LIMIT 1)
              AND ABS(L.price - (SELECT price FROM SelectedCar LIMIT 1)) <= 1000
                  AND C.vin <> '${car_vin}'
   LIMIT 3
)
SELECT * FROM SimilarCars;
`;

  // Execute the query
  connection.query(query, [car_vin], (err, data) => {
    if (err) {
      console.log(err);
      res.json([]);
    } else {
      console.log(data);
      res.json(data);
    }
  });
};

module.exports = {
  state_cars,
  get_statistics,
  criteria_cars,
  averagePrice,
  carsByPriceRange,
  geo_cars,
  carsWithSafetyFeatures,
  gasPricingAnalysis,
  similar_cars,
  compare_cars,
  criteria_by_region_and_state,
};
