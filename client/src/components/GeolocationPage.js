import React, { useState, useEffect } from "react";
import axios from "axios";

function SearchByGeolocation() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [range, setRange] = useState("");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInitiated, setSearchInitiated] = useState(false); // Track if search has been triggered
  const pageSize = 10;

  const fetchCars = async () => {
    if (!latitude || !longitude || !range) return; // Prevent fetching if parameters are not set

    setLoading(true);
    const latRange = range; // Convert km to approximate degrees
    const lonRange = range;
    const offset = (currentPage - 1) * pageSize; // Calculate offset based on current page
    const params = {
      lat: latitude,
      lon: longitude,
      latRange: latRange,
      lonRange: lonRange,
      pageSize: pageSize,
      offset: offset,
    };

    try {
      const response = await axios.get(
        `http://localhost:8080/cars_by_geolocation`,
        { params }
      );
      setCars(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchInitiated) {
      fetchCars();
    }
  }, [currentPage]);

  const handleSearch = () => {
    if (!latitude || !longitude || !range) {
      alert("Please enter all fields before searching.");
      return;
    }
    setSearchInitiated(true);
    setCurrentPage(1); // Always reset to first page on new search
    fetchCars();
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (cars.length === pageSize) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="container mt-3">
      <h1>
        <center>Search Cars by Geolocation</center>
      </h1>
      <div className="input-group mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(parseFloat(e.target.value))}
        />
        <input
          type="number"
          className="form-control"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(parseFloat(e.target.value))}
        />
        <input
          type="number"
          className="form-control"
          placeholder="Range in km"
          value={range}
          onChange={(e) => setRange(parseFloat(e.target.value))}
        />
        <button onClick={handleSearch} className="btn btn-dark">
          Search
        </button>
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>VIN</th>
              <th>Manufacturer</th>
              <th>Model</th>
              <th>Description</th>
              <th>Condition</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {cars.length > 0 ? (
              cars.map((car, index) => (
                <tr key={index}>
                  <td>{car.vin}</td>
                  <td>{car.manufacturer}</td>
                  <td>{car.model}</td>
                  <td>{car.description}</td>
                  <td>{car.condition}</td>
                  <td>${car.price}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No cars found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between mt-3">
        <button
          onClick={handlePrevious}
          className="btn btn-dark"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="btn btn-dark"
          disabled={cars.length < pageSize}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default SearchByGeolocation;
