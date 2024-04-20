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

// Route 1: GET /cars_by_region, Search by Location
const state_cars = async function (req, res) {
  const { state, region, pageSize, offset } = req.params;
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
    WHERE L.state = '${state}' AND L.region = ‘${region}’
    LIMIT ${pageSize} OFFSET ${offset};
 `;
  // Execute the query
  connection.query(query, [state, region, pageSize, offset], (err, data) => {
    if (err) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
};

// Route 2: GET /get_statistics, Home Page
const get_statistics = async function (req, res) {
  // const { state, region, pageSize, offset } = req.params;
  const query = `
  (WITH  CarTable AS (
    SELECT vin, manufacturer AS seller, transmission
    FROM Cars),
    ListTable AS (
    SELECT id, price, state, \`condition\`, odometer, color
    FROM Listing
    ),
    JoinedData AS (
       SELECT L.state, L.price, L.odometer, C.transmission, L.condition, L.color, C.seller
       FROM CarTable C JOIN ListTable L ON C.vin = L.id
    )
    SELECT
       state,
       AVG(price) AS avg_price,
       AVG(odometer) AS avg_odometer,
       (
           SELECT transmission
           FROM JoinedData JD2
           WHERE JD2.state = JD1.state
           GROUP BY transmission
           ORDER BY COUNT(transmission) DESC
           LIMIT 1
       ) AS most_frequent_transmission,
       (
           SELECT \`condition\`
           FROM JoinedData JD2
           WHERE JD2.state = JD1.state
           GROUP BY \`condition\`
           ORDER BY COUNT(\`condition\`) DESC
           LIMIT 1
       ) AS most_frequent_condition,
       (
           SELECT color
           FROM JoinedData JD2
           WHERE JD2.state = JD1.state
           GROUP BY color
           ORDER BY COUNT(color) DESC
           LIMIT 1
       ) AS most_frequent_color,
    (       SELECT seller
           FROM JoinedData JD2
           WHERE JD2.state = JD1.state
           GROUP BY seller
           ORDER BY COUNT(seller) DESC
           LIMIT 1
       ) AS most_frequent_seller
    FROM JoinedData JD1
    GROUP BY state)
    UNION
    (WITH VehicleTable AS (
    SELECT vin, transmission, state, odometer, \`condition\`, sellingprice, color, seller
    FROM Vehicle)
    SELECT
       state,
       AVG(sellingprice) AS avg_price,
       AVG(odometer) AS avg_odometer,
       (
           SELECT transmission
           FROM Vehicle V2
           WHERE V2.state = V1.state
           GROUP BY transmission
           ORDER BY COUNT(transmission) DESC
           LIMIT 1
       ) AS most_frequent_transmission,
       (
           SELECT \`condition\`
          FROM VehicleTable V2
           WHERE V2.state = V1.state
           GROUP BY \`condition\`
           ORDER BY COUNT(\`condition\`) DESC
           LIMIT 1
       ) AS most_frequent_condition,
       (
           SELECT color
          FROM Vehicle V2
           WHERE V2.state = V1.state
           GROUP BY color
           ORDER BY COUNT(color) DESC
           LIMIT 1
       ) AS most_frequent_color,
    (       SELECT seller
           FROM Vehicle V2
           WHERE V2.state = V1.state
           GROUP BY seller
           ORDER BY COUNT(seller) DESC
           LIMIT 1
       ) AS most_frequent_seller
    FROM Vehicle V1
    GROUP BY state);
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

// Route 3: GET/cars_by_criteria, Advanced Search
const criteria_cars = async function (req, res) {
  const { make, model, start_year, end_year, condition, pageSize, offset } =
    req.params;
  const query = `
   WITH ListTable AS (
        SELECT id, vin, price, region, state, image, description, \`condition\`
        FROM Listing),
    CarTable AS (
    SELECT vin, manufacturer, model
    FROM Cars)
    SELECT *
    FROM ListTable L JOIN CarTable C ON L.vin = C.vin
    WHERE manufacturer = 'chevrolet'
    AND model = 'silverado 1500'
    AND \`condition\` = 'good'
    ORDER BY model
    LIMIT ${pageSize} OFFSET ${offset};
 `;
  // Execute the query
  connection.query(
    query,
    [make, model, start_year, end_year, condition, pageSize, offset],
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

// Route 4
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
      JOIN Cars ON Listing.vin = Cars.vin
      WHERE manufacturer = ${manufacturer} AND
            model = ${model} AND
            year BETWEEN ${startYear} AND ${endYear}
    )
    SELECT avg_price FROM VehicleStats;
  `;

  // Execute the query
  connection.query(
    query,
    [make, model, start_year, end_year, condition, pageSize, offset],
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
// graph.js useful library?

// Route 5: GET /cars_by_price_range, Search by Price
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
      SELECT id, vin, price, region, state, image, description, condition
      FROM Listing),
    CarTable AS (
      SELECT vin, manufacturer, model
      FROM Cars)
    SELECT *
    FROM ListTable L JOIN CarTable C ON L.vin = C.vin
    WHERE L.price BETWEEN ${priceLow} AND ${priceHigh}
    ORDER BY ${sort} ${sortDirection}
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
const geo_cars = async function (req, res) {
  const { lat, lon, latRange, lonRange, pageSize, offset } = req.params;
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
    WHERE L.lat BETWEEN ${lat - latRange} AND ${lat + latRange}
      AND L.long BETWEEN ${lon - lonRange} AND ${lon + lonRange}
    LIMIT ${pageSize} OFFSET ${offset};
  `;

  // Execute the query
  connection.query(
    query,
    [lat, lon, latRange, lonRange, pageSize, offset],
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

// Route 7, Search by Description
const carsWithSafetyFeatures = async function (req, res) {
  const { pageSize, offset } = req.query;
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
    WHERE description LIKE '%safe%'
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

// Route 8, Advanced Search
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

// Route 9: GET/similar_cars, Comparison Pag
const similar_cars = async function (req, res) {
  const { pageSize, offset } = req.params;
  const query = `
   WITH SimListings AS (
 SELECT L1.id AS ListingID1, L2.id AS ListingID2, L1.price AS Price1, L2.price AS Price2, L1.vin AS VIN1, L2.vin AS vin2, L1.year as year1
 FROM Listing L1 JOIN Listing L2 ON L1.Vin = L2.Vin AND L1.id <> L2.id
 WHERE ABS(L1.price - L2.price) < 1000
    ),
   CarTable AS (
 SELECT vin, manufacturer, model
 FROM Cars)
   SELECT C1.VIN, C2.VIN, C1.model, C2.model, S.Price1, S.Price2
   FROM CarTable C1
   JOIN SimListings S ON S.VIN1 = C1.VIN
   JOIN CarTable C2 ON S.VIN2 = C2.VIN
   ORDER BY ABS(S.price1 - S.price2), S.year1;
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

// Route 10: GET/compare_cars
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

//Route 11: GET /criteria_by_region_and_state
const criteria_by_region_and_state = async function (req, res) {
  const { car_vin } = req.params;
  const query = `
WITH SelectedCar AS (
   SELECT L.price, L.state
   FROM Listing L
   JOIN Cars C ON L.Vin = C.vin
   WHERE C.vin = ${car_vin}
),
SimilarCars AS (
   SELECT C.vin, C.manufacturer, C.model, L.price, L.state
   FROM Cars C
   JOIN Listing L ON C.vin = L.Vin
   WHERE L.state = (SELECT state FROM SelectedCar LIMIT 1)
              AND ABS(L.price - (SELECT price FROM SelectedCar LIMIT 1)) <= 1000
                  AND C.vin <> ${car_vin}
   ORDER BY ABS(L.price - (SELECT price FROM SelectedCar LIMIT 1))
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
