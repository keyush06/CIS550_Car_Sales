import React, { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    startYear: "",
    endYear: "",
  });
  const [averagePriceData, setAveragePriceData] = useState(0);

  // Function to fetch statistics
  const fetchStats = async () => {
    setLoading(true);
    try {
      const statsResponse = await axios.get(
        "http://localhost:8080/get_statistics"
      );
      setStats(statsResponse.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch average price data
  const fetchAveragePrice = async () => {
    if (formData.startYear && formData.endYear) {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/average_price`,
          {
            params: {
              startYear: formData.startYear,
              endYear: formData.endYear,
            },
          }
        );
        setAveragePriceData(response.data[0].avg_price);
        console.log(response.data[0].avg_price);
      } catch (error) {
        console.error("Error fetching average price:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    } else {
      alert("All fields must be filled out to fetch average price data.");
    }
  };

  // Handle input change
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="container mt-3">
      <h1>Home</h1>
      <div>
        <input
          type="number"
          placeholder="Start Year"
          name="startYear"
          value={formData.startYear}
          onChange={handleChange}
        />
        <input
          type="number"
          placeholder="End Year"
          name="endYear"
          value={formData.endYear}
          onChange={handleChange}
        />
        <button onClick={fetchAveragePrice}>Get Average Price</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {averagePriceData && (
            <div>
              <h2>Average Price Data</h2>
              <p>
                {averagePriceData
                  ? `Average Price: $${averagePriceData}`
                  : "No data found"}
              </p>
            </div>
          )}
          <table className="table mt-3">
            <thead>
              <tr>
                <th>State</th>
                <th>Mean Price</th>
                <th>Mean Odometer</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((stateInfo, index) => (
                <tr key={index}>
                  <td>{stateInfo.state}</td>
                  <td>{stateInfo.avg_price}</td>
                  <td>{stateInfo.avg_odometer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Home;
