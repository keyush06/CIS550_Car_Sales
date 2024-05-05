import React, { useState, useEffect } from "react";
import axios from "axios";

function AdvancedSearch() {
  const [inputs, setInputs] = useState({
    manufacturer: "",
    model: "",
    start_year: 2000,
    end_year: 2023,
    condition: "",
  });
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  };

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/cars_by_criteria",
        {
          params: {
            manufacturer: inputs.manufacturer,
            model: inputs.model,
            start_year: inputs.start_year,
            end_year: inputs.end_year,
            condition: inputs.condition,
            pageSize: pagination.limit,
            offset: (pagination.page - 1) * pagination.limit,
          },
        }
      );
      setCars(response.data);
    } catch (error) {
      console.error("Failed to fetch cars", error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [pagination]);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchCars();
  };

  return (
    <div className="container mt-3">
      <h1>
        <center>Advanced Search</center>
      </h1>
      <form onSubmit={handleSubmit} className="d-flex align-items-center">
        <input
          type="text"
          name="manufacturer"
          value={inputs.manufacturer}
          onChange={handleInputChange}
          placeholder="Manufacturer"
          className="form-control m-2"
        />
        <input
          type="text"
          name="model"
          value={inputs.model}
          onChange={handleInputChange}
          placeholder="Model"
          className="form-control m-2"
        />
        <input
          type="number"
          name="start_year"
          value={inputs.start_year}
          onChange={handleInputChange}
          placeholder="Start Year"
          className="form-control m-2"
        />
        <input
          type="number"
          name="end_year"
          value={inputs.end_year}
          onChange={handleInputChange}
          placeholder="End Year"
          className="form-control m-2"
        />
        <input
          type="text"
          name="condition"
          value={inputs.condition}
          onChange={handleInputChange}
          placeholder="Condition"
          className="form-control m-2"
        />
        <button type="submit" className="btn btn-dark m-2">
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <table className="table">
          <thead>
            <tr>
              <th>VIN</th>
              <th>Price</th>
              <th>Model</th>
              <th>Manufacturer</th>

              <th>Condition</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr key={index}>
                <td>{car.vin}</td>
                <td>${car.price}</td>
                <td>{car.model}</td>
                <td>{car.manufacturer}</td>

                <td>{car.condition}</td>
                <td>{car.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="pagination d-flex justify-content-around">
        <button
          onClick={() =>
            setPagination({
              ...pagination,
              page: Math.max(pagination.page - 1, 1),
            })
          }
          className="btn btn-dark mr-2"
        >
          Previous
        </button>
        <span className="align-self-center">Page {pagination.page}</span>
        <button
          onClick={() =>
            setPagination({ ...pagination, page: pagination.page + 1 })
          }
          className="btn btn-dark ml-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdvancedSearch;
