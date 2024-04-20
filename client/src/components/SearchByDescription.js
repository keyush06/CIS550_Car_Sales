import React, { useState, useEffect } from "react";
import axios from "axios";

function SearchByDescription() {
  const [query, setQuery] = useState("");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [carsPerPage] = useState(10);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/cars_with_safety_features`,
        {
          params: {
            description: query,
            pageSize: carsPerPage,
            offset: (currentPage - 1) * carsPerPage,
          },
        }
      );
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
    setCurrentPage(1); // Reset to page 1 for new search
    fetchCars();
  };

  return (
    <div>
      <h1>Search By Description</h1>
      <div className="d-flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-control mr-2"
          placeholder="Enter description..."
        />
        <button onClick={handleSearch} className="btn btn-primary">
          Search
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table mt-3">
          <thead>
            <tr>
              <th>Model</th>
              <th>Price</th>
              <th>Description</th>
              <th>Manufacturer</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr key={index}>
                <td>{car.model}</td>
                <td>${car.price}</td>
                <td>{car.description}</td>
                <td>{car.manufacturer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(cars.length / carsPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`page-item ${i + 1 === currentPage ? "active" : ""}`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default SearchByDescription;
