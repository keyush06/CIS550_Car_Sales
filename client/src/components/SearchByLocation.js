import React, { useState, useEffect } from "react";
import axios from "axios";

function SearchByLocation() {
  const [state, setState] = useState("");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null); // Track expanded description index
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchCars = async () => {
    setLoading(true);
    const offset = (currentPage - 1) * pageSize; // Calculate the offset based on current page
    try {
      const response = await axios.get(`http://localhost:8080/cars_by_region`, {
        params: {
          state: state || undefined,
          pageSize: pageSize,
          offset: offset,
        },
      });
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
    fetchCars();
  };

  const handlePrevious = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const toggleDescription = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div
      className="container mt-3 d-flex flex-column"
      style={{ height: "100vh" }}
    >
      <div className="flex-grow-1">
        <h1>
          <center>Search By Location</center>
        </h1>
        <div className="search-container mb-3 d-flex">
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="form-control me-2"
            placeholder="Enter state..."
          />
          <button onClick={handleSearch} className="btn btn-dark">
            Search
          </button>
        </div>
        <div className="table-responsive">
          <table className="table mt-3">
            <thead>
              <tr>
                <th>VIN</th>
                <th>State</th>
                <th>Description</th>
                <th>Condition</th>
                <th>Manufacturer</th>
                <th>Model</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {cars.length > 0 ? (
                cars.map((car, index) => (
                  <tr key={index}>
                    <td>{car.vin}</td>
                    <td>{car.state}</td>
                    <td>
                      <div style={{ maxWidth: "300px" }}>
                        {expanded === index
                          ? car.description
                          : `${car.description.substring(0, 100)}...`}
                        <button
                          onClick={() => toggleDescription(index)}
                          className="btn btn-sm btn-link"
                        >
                          {expanded === index ? "Less" : "More"}
                        </button>
                      </div>
                    </td>
                    <td>{car.condition}</td>
                    <td>{car.manufacturer}</td>
                    <td>{car.model}</td>
                    <td>${car.price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No cars found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-3 d-flex justify-content-between">
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

export default SearchByLocation;
