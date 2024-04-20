import React, { useState, useEffect } from "react";
import axios from "axios";

function SearchByPrice() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [price, setPrice] = useState(50000); // Default mid-point value
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
            priceLow: 0,
            priceHigh: price,
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
  }, [price, sortConfig, pagination]);

  const handleSortChange = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "ASC"
          ? "DESC"
          : "ASC",
    });
  };

  return (
    <div className="container mt-3">
      <h1>Search By Price</h1>
      <div className="d-flex flex-row align-items-center justify-content-between mb-3">
        <input
          type="range"
          min="0"
          max="100000"
          step="100"
          value={price}
          onChange={(e) => setPrice(parseInt(e.target.value, 10))}
          className="form-range w-25"
        />
        <p className="mb-0 mx-2">Max Price: ${price}</p>
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
            <th onClick={() => handleSortChange("model")}>Model</th>
            <th onClick={() => handleSortChange("manufacturer")}>
              Manufacturer
            </th>
            <th onClick={() => handleSortChange("vin")}>VIN</th>
            <th onClick={() => handleSortChange("odometer")}>Odometer</th>
            <th onClick={() => handleSortChange("price")}>Price</th>
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
                <td>{car.odometer}</td>
                <td>${car.price}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {error && <p>{error}</p>}
    </div>
  );
}

export default SearchByPrice;
