import React, { useState, useEffect } from "react";
import axios from "axios";

function CompareCars() {
  const [carVIN, setcarVIN] = useState("");
  const [price, setPrice] = useState(100000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchCars = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:8080/criteria_by_region_and_state", {
          params: {
            car_vin: carVIN, //"1FTEW1E52LKD14191",
          },
        });
      setCars(response.data);
      console.log(response);
    } catch (error) {
      setError("Failed to fetch data: " + error.message);
      console.error(error);
    } finally {
      console.log();
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [price, carVIN]);

  const handleSearch = () => {
    // setCurrentPage(1); // Reset to page 1 for new search
    fetchCars();
  };
  
  return (
    <div>
      <div className="container mt-3">
        <h1>Compare Cars</h1>
        <div className="d-flex flex-row align-items-center justify-content-between">
          {/* <input
            type="range"
            min="0"
            max="100000"
            step="100"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="form-range w-25"
          />
          <p className="mb-0 px-2">Maximum Price: ${price}</p> */}
          <input
            type="text"
            placeholder="Enter car VIN"
            value={carVIN}
            onChange={(e) => setcarVIN(e.target.value)}
            className="form-control me-2"
          />
          <button onClick={handleSearch} className="btn btn-primary me-2">
            Search
          </button>
        </div>
      </div>

      <table className="table" border="1">
        <thead>
          <tr>
              <th scope="col"></th> 
              <th scope="col">Car 1</th> 
              <th scope="col">Car 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
              <th scope="row">Manufacturer</th>
              <td>{cars.length > 0 ? cars[0].manufacturer : 'N/A'}</td>
              <td>{cars.length > 1 ? cars[1].manufacturer : 'N/A'}</td>
          </tr>
          <tr>
              <th scope="row">Model</th> 
              <td>{cars.length > 0 ? cars[0].model : 'N/A'}</td>
              <td>{cars.length > 1 ? cars[1].model : 'N/A'}</td>
          </tr>
          <tr>
              <th scope="row">Transmission</th>
              <td>{cars.length > 0 ? cars[0].transmission : 'N/A'}</td>
              <td>{cars.length > 1 ? cars[1].transmission : 'N/A'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CompareCars;