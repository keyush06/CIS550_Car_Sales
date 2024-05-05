import React, { useState, useEffect } from "react";
import axios from "axios";

function SearchByPrice() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState({ low: 0, high: 50000 });
  const [sortConfig, setSortConfig] = useState({
    key: "price",
    direction: "ASC",
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  const [gasPrices, setGasPrices] = useState([]);
  const [gasLoading, setGasLoading] = useState(false);
  const [gasError, setGasError] = useState(null);
  const [gasPriceRange, setGasPriceRange] = useState({ low: 0, high: 10000 });
  const [gasPagination, setGasPagination] = useState({ page: 1, limit: 10 });

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

  // useEffect(() => {
  //   fetchCars();
  // }, [pagination]);

  const fetchGasPrices = async () => {
    setGasLoading(true);
    setGasError(null);
    try {
      const response = await axios.get(
        "http://localhost:8080/gas_pricing_analysis",
        {
          params: {
            lowerPriceLimit: gasPriceRange.low,
            upperPriceLimit: gasPriceRange.high,
          },
        }
      );
      setGasPrices(response.data);
    } catch (error) {
      setGasError("Failed to fetch gas prices");
      console.error(error);
    } finally {
      setGasLoading(false);
    }
  };

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

  const handleGasPageChange = (newPage) => {
    setGasPagination({ ...gasPagination, page: newPage });
  };
  useEffect(() => {
    fetchCars();
  }, [sortConfig, pagination]);

  return (
    <div className="container mt-3">
      <h1>
        <center>Search By Price</center>
      </h1>
      <div className="d-flex flex-row align-items-center justify-content-around">
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
        <button onClick={fetchCars} className="btn btn-dark ml-2">
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
          className="btn btn-dark mr-2"
          disabled={pagination.page === 1}
        >
          Previous
        </button>
        <span className="align-self-center">Page {pagination.page}</span>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          className="btn btn-dark ml-2"
        >
          Next
        </button>
      </div>
      <hr></hr>
      {/* Gas Prices Analysis */}
      <h1>
        <center>Gas Prices Analysis</center>
      </h1>
      <div className="d-flex flex-row align-items-center justify-content-around">
        <label>
          Min Price: $
          <input
            type="number"
            value={gasPriceRange.low}
            onChange={(e) =>
              setGasPriceRange({
                ...gasPriceRange,
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
            value={gasPriceRange.high}
            onChange={(e) =>
              setGasPriceRange({
                ...gasPriceRange,
                high: parseInt(e.target.value, 10),
              })
            }
            className="form-control"
            style={{ width: "auto", display: "inline" }}
          />
        </label>
        <button onClick={fetchGasPrices} className="btn btn-dark ml-2">
          Search
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Manufacturer</th>
            <th>Model</th>
            <th>Avg Price</th>
            <th>Num Listings</th>
          </tr>
        </thead>
        <tbody>
          {gasLoading ? (
            <tr>
              <td colSpan="4">Loading...</td>
            </tr>
          ) : (
            gasPrices
              .slice(
                (gasPagination.page - 1) * gasPagination.limit,
                gasPagination.page * gasPagination.limit
              )
              .map((car, index) => (
                <tr key={index}>
                  <td>{car.manufacturer}</td>
                  <td>{car.model}</td>
                  <td>{car.avg_price}</td>
                  <td>{car.num_listings}</td>
                </tr>
              ))
          )}
        </tbody>
      </table>
      {gasError && <p>{gasError}</p>}
      <div className="pagination d-flex justify-content-around">
        <button
          onClick={() =>
            handleGasPageChange(Math.max(gasPagination.page - 1, 1))
          }
          className="btn btn-dark mr-2"
          disabled={gasPagination.page === 1}
        >
          Previous
        </button>
        <span className="align-self-center">Page {gasPagination.page}</span>
        <button
          onClick={() => handleGasPageChange(gasPagination.page + 1)}
          className="btn btn-dark ml-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default SearchByPrice;
