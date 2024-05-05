import React, { useState, useEffect } from "react";
import axios from "axios";

function CompareCars() {
  const [carVIN, setcarVIN] = useState("");
  const [cars, setCars] = useState([]);
  const fetchCars = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/criteria_by_region_and_state",
        {
          params: { car_vin: carVIN },
        }
      );
      setCars(response.data);
      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const handleSearch = () => {
    fetchCars();
  };

  return (
    <div>
      <div className="container mt-3">
        <h1>
          <center>Compare Cars</center>
        </h1>
        <div className="input-group mb-3">
          <input
            type="text"
            placeholder="Enter car VIN"
            value={carVIN}
            onChange={(e) => setcarVIN(e.target.value)}
            className="form-control"
          />
          <div className="input-group-append">
            <button onClick={handleSearch} className="btn btn-primary">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="container mt-3">
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Attribute</th>
              <th scope="col">Car 1</th>
              <th scope="col">Car 2</th>
              <th scope="col">Car 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">VIN</th>
              <td>{cars.length > 0 ? cars[0].vin : "N/A"}</td>
              <td>{cars.length > 1 ? cars[1].vin : "N/A"}</td>
              <td>{cars.length > 2 ? cars[2].vin : "N/A"}</td>
            </tr>
            <tr>
              <th scope="row">Manufacturer</th>
              <td>{cars.length > 0 ? cars[0].manufacturer : "N/A"}</td>
              <td>{cars.length > 1 ? cars[1].manufacturer : "N/A"}</td>
              <td>{cars.length > 2 ? cars[2].manufacturer : "N/A"}</td>
            </tr>
            <tr>
              <th scope="row">Model</th>
              <td>{cars.length > 0 ? cars[0].model : "N/A"}</td>
              <td>{cars.length > 1 ? cars[1].model : "N/A"}</td>
              <td>{cars.length > 2 ? cars[2].model : "N/A"}</td>
            </tr>
            <tr>
              <th scope="row">Price</th>
              <td>{cars.length > 0 ? cars[0].price : "N/A"}</td>
              <td>{cars.length > 1 ? cars[1].price : "N/A"}</td>
              <td>{cars.length > 2 ? cars[2].price : "N/A"}</td>
            </tr>
            <tr>
              <th scope="row">State</th>
              <td>{cars.length > 0 ? cars[0].state : "N/A"}</td>
              <td>{cars.length > 1 ? cars[1].state : "N/A"}</td>
              <td>{cars.length > 2 ? cars[2].state : "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <SimilarCars />
    </div>
  );
}

function SimilarCars() {
  const [minPrice, setMinPrice] = useState(0);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [newCars, setnewCars] = useState([]);

  const fetchCars = async () => {
    let finalOffset = (page - 1) * itemsPerPage;
    try {
      const response = await axios.get("http://localhost:8080/similar_cars", {
        params: {
          minPrice: minPrice,
          pageSize: itemsPerPage,
          offset: finalOffset,
        },
      });
      setnewCars(response.data);
      console.log(newCars);
      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  useEffect(() => {
    fetchCars();
  }, [page, itemsPerPage]);

  return (
    <div className="container mt-5">
      <h2>Similar Cars</h2>
      <label>
        Min Price: $
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(parseInt(e.target.value, 10))}
          className="form-control"
          style={{ width: "auto", display: "inline", marginRight: "10px" }}
        />
      </label>
      <div className="input-group-append">
        <button onClick={fetchCars} className="btn btn-dark">
          Search
        </button>
      </div>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>VIN 1</th>
            <th>VIN 2</th>
            <th>Manufacturer 1</th>
            <th>Manufacturer 2</th>
            <th>Model 1</th>
            <th>Model 2</th>
            <th>Year 1</th>
            <th>Year 2</th>
            <th>Price 1</th>
            <th>Price 2</th>
          </tr>
        </thead>
        <tbody>
          {newCars.map((car, index) => (
            <tr key={index}>
              <td>{car.VIN1}</td>
              <td>{car.VIN2}</td>
              <td>{car.Man1}</td>
              <td>{car.Man2}</td>
              <td>{car.Model1}</td>
              <td>{car.Model2}</td>
              <td>{car.year1}</td>
              <td>{car.year2}</td>
              <td>${car.Price1}</td>
              <td>${car.Price2}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination d-flex justify-content-around">
        <button
          onClick={() => setPage(Math.max(page - 1, 1))}
          className="btn btn-dark mr-2"
        >
          Previous
        </button>
        <span className="align-self-center">Page {page}</span>
        <button onClick={() => setPage(page + 1)} className="btn btn-dark ml-2">
          Next
        </button>
      </div>
    </div>
  );
}

export default CompareCars;
