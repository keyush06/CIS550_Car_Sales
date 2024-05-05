import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../images/logo.jpeg"; // Ensure path matches your project structure

function Home() {
  const [allStats, setAllStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStates, setSelectedStates] = useState([]);
  const [formData, setFormData] = useState({
    startYear: 1900,
    endYear: 2024,
  });
  const [filteredStats, setFilteredStats] = useState([]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const statsResponse = await axios.get(
        "http://localhost:8080/get_statistics"
      );
      setAllStats(statsResponse.data);
      setFilteredStats(statsResponse.data); // Initially display all data
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAveragePrice = async () => {
    setLoading(true);
    try {
      let filtered = allStats;
      if (selectedStates.length) {
        filtered = filtered.filter((stat) =>
          selectedStates.includes(stat.state)
        );
      }
      if (formData.startYear && formData.endYear) {
        filtered = filtered.filter(
          (stat) =>
            stat.year >= parseInt(formData.startYear) &&
            stat.year <= parseInt(formData.endYear)
        );
      }
      setFilteredStats(filtered);
    } catch (error) {
      console.error("Error processing data:", error);
      setFilteredStats([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStateSelection = (event) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedStates(selectedOptions);
  };

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Inline styles for customization
  const logoStyle = {
    height: "100px",
    borderRadius: "50%", // Make the logo round
    marginTop: "20px",
  };

  return (
    <div className="container mt-3" style={{ textAlign: "center" }}>
      <h1>Wheel Wise</h1>
      <div className="row align-items-end">
        <div className="col-md-4">
          <select
            multiple
            className="form-control"
            value={selectedStates}
            onChange={handleStateSelection}
            style={{ height: "50px" }}
          >
            {Array.from(new Set(allStats.map((stateInfo) => stateInfo.state)))
              .sort()
              .map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
          </select>
        </div>
        <div className="col-md-3">
          <input
            type="number"
            placeholder="Start Year"
            name="startYear"
            className="form-control"
            value={formData.startYear}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            placeholder="End Year"
            name="endYear"
            className="form-control"
            value={formData.endYear}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-2">
          <button
            onClick={fetchAveragePrice}
            className="btn btn-dark btn-block"
          >
            Get Average Price
          </button>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-striped mt-3">
          <thead className="thead-dark">
            <tr>
              <th>State</th>
              <th>Year</th>
              <th>Mean Price</th>
              <th>Mean Odometer</th>
            </tr>
          </thead>
          <tbody>
            {filteredStats.map((stateInfo, index) => (
              <tr key={index}>
                <td>{stateInfo.state}</td>
                <td>{stateInfo.year}</td>
                <td>{parseFloat(stateInfo.avg_price).toFixed(2)}</td>
                <td>{parseFloat(stateInfo.avg_odometer).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Home;
