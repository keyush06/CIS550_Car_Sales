import React, { useState } from "react";

function SearchByPrice() {
  const [price, setPrice] = useState(100000);
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const dummyData = Array.from({ length: 50 }, (_, index) => ({
    model: `Model ${index + 1}`,
    manufacturer: ["Honda", "Toyota", "Tesla", "Ford", "Chevrolet"][index % 5],
    vin: Math.random().toString(36).substr(2, 9).toUpperCase(),
    odometer: Math.floor(Math.random() * 100000),
    price: Math.floor(Math.random() * 100000),
  }));

  const handleSearch = () => {
    const filteredCars = dummyData.filter((car) => car.price <= price);
    setCars(filteredCars);
    setCurrentPage(1); // Reset to first page after search
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    const sortedCars = sortArray(cars, key, direction);
    setCars(sortedCars);
  };

  const sortArray = (arr, key, order = "ascending") => {
    return arr.sort((a, b) => {
      if (a[key] < b[key]) {
        return order === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return order === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = cars.slice(firstItemIndex, lastItemIndex);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(cars.length / itemsPerPage);

  const paginationNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationNumbers.push(i);
  }

  return (
    <div>
      <div class="container mt-3">
        <h1>Search By Price</h1>
        <div class="d-flex flex-row align-items-center justify-content-between">
          <input
            type="range"
            min="0"
            max="100000"
            step="100"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="form-range w-25"
          />
          <p className="mb-0 px-2">Maximum Price: ${price}</p>
          <div>
            <label className="d-flex align-items-center">
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
            </label>
          </div>
          <button onClick={handleSearch} className="btn btn-primary me-2">
            Search
          </button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th onClick={() => handleSort("model")}>Model</th>
            <th onClick={() => handleSort("manufacturer")}>Manufacturer</th>
            <th onClick={() => handleSort("vin")}>VIN</th>
            <th onClick={() => handleSort("odometer")}>Odometer</th>
            <th onClick={() => handleSort("price")}>Price</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((car, index) => (
            <tr key={index}>
              <td>{car.model}</td>
              <td>{car.manufacturer}</td>
              <td>{car.vin}</td>
              <td>{car.odometer}</td>
              <td>${car.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav>
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
      </nav>
    </div>
  );
}

export default SearchByPrice;
