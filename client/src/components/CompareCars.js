import React, { useState, useEffect } from "react";
import axios from "axios";

function CompareCars() {
  const [price, setPrice] = useState(100000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // const dummyData = Array.from({ length: 50 }, (_, index) => ({
  //   model: `Model ${index + 1}`,
  //   manufacturer: ["Honda", "Toyota", "Tesla", "Ford", "Chevrolet"][index % 5],
  //   vin: Math.random().toString(36).substr(2, 9).toUpperCase(),
  //   odometer: Math.floor(Math.random() * 100000),
  //   price: Math.floor(Math.random() * 100000),
  // }));

  const fetchCars = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:8080/compare_cars",
      );
      console.log(response);
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
  }, [price]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to page 1 for new search
    fetchCars();
  };
  
  return (
    <div>
      <div class="container mt-3">
        <h1>Compare Cars</h1>
        <div class="d-flex flex-row align-items-center justify-content-between">
          {/* <input
            type="checkbox"
            min="0"
            max="100000"
            step="100"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="form-range w-25"
          /> */}
          <form action="/search">
            <input type="text" name="query" placeholder="Search..."></input>
            {/* <input type="submit" value="Search"></input> */}
          </form>
          {/* <p className="mb-0 px-2">Maximum Price: ${price}</p> */}
          <div>
            {/* <label className="d-flex align-items-center">
              Items per page:
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="form-select ms-2"
                style={{ width: "auto" }}
              >
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </label> */}
          </div>
          <button onClick={handleSearch} className="btn btn-primary me-2">
            Search
          </button>
        </div>
      </div>

      <table className = "table" border="1">
        <tr>
            <th scope="col"> </th> 
            <th scope="col">Car 1</th> 
            <th scope="col">Car 2</th>
        </tr>
        <tr>
            <th scope="row">Manufacturer</th>
            <td>car 1</td>
            <td>car 2</td>
        </tr>
        <tr>
            <th scope="row">Model</th> 
            <td>car 1</td>
            <td>car 2</td>
        </tr>
      </table>`

      {/* <nav>
        <ul className="pagination">
          {paginationNumbers.map((number) => (
            <li key={number} className="page-item">
              <a
                onClick={() => paginate(number)}
                href="#!"
                className="page-link"
              >
                {number}
              </a>
            </li>
          ))}
        </ul>
      </nav> */}
    </div>
  );
}

export default CompareCars;
