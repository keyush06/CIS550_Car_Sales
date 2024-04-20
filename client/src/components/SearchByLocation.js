import React, { useState, useEffect } from "react";
import axios from "axios";

function SearchByLocation() {
  const [state, setState] = useState("");
  const [region, setRegion] = useState("");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [carsPerPage, setCarsPerPage] = useState(10);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/cars_by_region`, {
        params: {
          state: state,
          region: region,
          pageSize: carsPerPage,
          offset: (currentPage - 1) * carsPerPage,
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
  }, [state, region, currentPage, carsPerPage]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to page 1 for new searches
    fetchCars();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mt-3">
      <h1>Search By Location</h1>
      <div className="search-container mb-3 d-flex">
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="form-control me-2" // 'me-2' adds a margin to the right
          placeholder="Enter state..."
        />
        <input
          type="text"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="form-control me-2" // 'me-2' adds a margin to the right
          placeholder="Enter region..."
        />
        <button onClick={handleSearch} className="btn btn-primary">
          Search
        </button>
      </div>

      <div className="table-responsive">
        <table className="table mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>VIN</th>
              <th>Price</th>
              <th>State</th>
              <th>Region</th>
              <th>Description</th>
              <th>Condition</th>
              <th>Manufacturer</th>
              <th>Model</th>
              <th>
                <select
                  value={pagination.limit}
                  onChange={(e) =>
                    setPagination({
                      ...pagination,
                      limit: parseInt(e.target.value, 10),
                    })
                  }
                  className="form-select"
                  style={{ width: "auto" }}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody>{/* ... (map function for cars) */}</tbody>
        </table>
      </div>
      <div className="d-flex justify-content-center">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="btn btn-secondary me-3" // 'me-3' adds a margin to the right of the button
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          className="btn btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default SearchByLocation;
