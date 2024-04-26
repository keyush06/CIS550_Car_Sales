import React, { useState, useEffect } from "react";
import axios from "axios";

function SearchByPrice() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState({ low: 0, high: 50000 }); // Default range
  const [sortConfig, setSortConfig] = useState({
    key: "price",
    direction: "ASC",
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  const fetchCars = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:8080/cars_by_price_range",
        {
          params: {
            priceLow: priceRange.low,
            priceHigh: priceRange.high,
            sort: sortConfig.key,
            sortDirection: sortConfig.direction,
            page: pagination.page,
            limit: pagination.limit,
          },
        }
      );
      setCars(response.data);
    } catch (error) {
      setError("Failed to fetch data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [sortConfig, pagination]);

  const handleSortChange = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "ASC"
          ? "DESC"
          : "ASC",
    });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  return (
    <div className="container mt-3">
      <h1>Search By Price</h1>
      <div className="d-flex flex-row align-items-center justify-content-between mb-3">
        <div>
          <label>
            Min Price: $
            <input
              type="number"
              value={priceRange.low}
              onChange={(e) =>
                setPriceRange({
                  ...priceRange,
                  low: parseInt(e.target.value, 10),
                })
              }
              className="form-control"
              style={{ width: "auto", display: "inline", marginRight: "10px" }}
            />
          </label>
          <label>
            Max Price: $
            <input
              type="number"
              value={priceRange.high}
              onChange={(e) =>
                setPriceRange({
                  ...priceRange,
                  high: parseInt(e.target.value, 10),
                })
              }
              className="form-control"
              style={{ width: "auto", display: "inline" }}
            />
          </label>
        </div>
        <div>
          <label className="d-flex align-items-center mb-0">
            Items per page:
            <select
              value={pagination.limit}
              onChange={(e) =>
                setPagination({
                  ...pagination,
                  limit: parseInt(e.target.value, 10),
                })
              }
              className="form-select ml-2"
              style={{ width: "auto" }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </label>
        </div>
        <button onClick={fetchCars} className="btn btn-primary mr-2">
          Search
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Model</th>
            <th>Manufacturer</th>
            <th>VIN</th>
            <th>Condition</th>
            <th onClick={() => handleSortChange("price")}>
              Price{" "}
              {sortConfig.key === "price"
                ? sortConfig.direction === "DESC"
                  ? "↓"
                  : "↑"
                : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5">Loading...</td>
            </tr>
          ) : (
            cars.map((car, index) => (
              <tr key={index}>
                <td>{car.model}</td>
                <td>{car.manufacturer}</td>
                <td>{car.vin}</td>
                <td>{car.condition}</td>
                <td>${car.price}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {error && <p>{error}</p>}
      <div className="pagination d-flex justify-content-around">
        <button
          onClick={() => handlePageChange(Math.max(pagination.page - 1, 1))}
          className="btn btn-secondary mr-2"
        >
          Previous
        </button>
        <span className="align-self-center">Page {pagination.page}</span>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          className="btn btn-secondary ml-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default SearchByPrice;
