import React, { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [allStats, setAllStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStates, setSelectedStates] = useState([]);
  const [formData, setFormData] = useState({
    startYear: "",
    endYear: ""
  });
  const [filteredStats, setFilteredStats] = useState([]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const statsResponse = await axios.get("http://localhost:8080/get_statistics");
      setAllStats(statsResponse.data);
      setFilteredStats(statsResponse.data);  // Initially display all data
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
        filtered = filtered.filter(stat => selectedStates.includes(stat.state));
      }
      if (formData.startYear && formData.endYear) {
        filtered = filtered.filter(stat => 
          stat.year >= parseInt(formData.startYear) && stat.year <= parseInt(formData.endYear)
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
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedStates(selectedOptions);
  };

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="container mt-3" style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f4f4f9',
      padding: '20px',
      borderRadius: '8px',
      backgroundImage: 'url(https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D)',
      backgroundSize: 'cover',
      color: '#fff'
    }}>
      <h1 style={{ color: '#333', textAlign: 'center', color: 'white' }}>Home</h1>
      <div style={{ marginBottom: '20px' }}>
        <select multiple
          value={selectedStates}
          onChange={handleStateSelection}
          style={{ padding: '10px', marginRight: '10px', borderRadius: '5px', height: '100px' }}
        >
          {allStats.map(stateInfo => (
            <option key={stateInfo.state} value={stateInfo.state}>{stateInfo.state}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Start Year"
          name="startYear"
          value={formData.startYear}
          onChange={handleInputChange}
          style={{ padding: '10px', marginRight: '10px', borderRadius: '5px' }}
        />
        <input
          type="number"
          placeholder="End Year"
          name="endYear"
          value={formData.endYear}
          onChange={handleInputChange}
          style={{ padding: '10px', marginRight: '10px', borderRadius: '5px' }}
        />
        <button onClick={fetchAveragePrice} style={{ padding: '10px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '5px' }}>
          Get Average Price
        </button>
      </div>
      {loading ? <p>Loading...</p> : (
        <div>
          <table className="table mt-3" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#007BFF', color: 'white' }}>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>State</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Year</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Mean Price</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Mean Odometer</th>
              </tr>
            </thead>
            <tbody>
              {filteredStats.map((stateInfo, index) => (
                <tr key={index}>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6', background: '#f8f9fa' }}>{stateInfo.state}</td>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6', background: '#f8f9fa' }}>{stateInfo.year}</td>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{stateInfo.avg_price}</td>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{stateInfo.avg_odometer}</td>
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
