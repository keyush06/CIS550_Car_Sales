import React, { useState, useEffect } from "react";
import axios from "axios";

function SearchByDescription() {
  const [query, setQuery] = useState("");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [carsPerPage] = useState(10);
  const [showMore, setShowMore] = useState(new Array(carsPerPage).fill(false)); // Array to track expanded descriptions

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
      setShowMore(new Array(response.data.length).fill(false)); // Reset showMore state for new data
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

  const toggleDescription = (index) => {
    const newShowMore = [...showMore];
    newShowMore[index] = !newShowMore[index];
    setShowMore(newShowMore);
  };

  const renderDescription = (description, index) => {
    if (description.length > 100 && !showMore[index]) {
      return (
        <>
          {description.substring(0, 100)}...
          <button
            onClick={() => toggleDescription(index)}
            className="btn btn-link"
          >
            See more
          </button>
        </>
      );
    } else {
      return (
        <>
          {description}
          {description.length > 100 && (
            <button
              onClick={() => toggleDescription(index)}
              className="btn btn-link"
            >
              See less
            </button>
          )}
        </>
      );
    }
  };

  return (
    <div>
      <h1>
        <center>Search By Description</center>
      </h1>
      <div className="d-flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-control mr-2"
          placeholder="Enter description..."
        />
        <button onClick={handleSearch} className="btn btn-dark">
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
                <td>{renderDescription(car.description, index)}</td>
                <td>{car.manufacturer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="pagination d-flex justify-content-around">
        <button
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          className="btn btn-dark mr-2"
        >
          Previous
        </button>
        <span className="align-self-center">Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          className="btn btn-dark ml-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default SearchByDescription;
