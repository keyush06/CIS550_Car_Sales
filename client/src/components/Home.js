// // import React, { useState, useEffect } from "react";
// // import axios from "axios";

// // function Home() {
// //   const [car, setCar] = useState({});

// //   useEffect(() => {
// //     axios.get("/api/car").then((response) => {
// //       setCar(response.data);
// //     });
// //   }, []);

// //   return (
// //     <div>
// //       <h1>Home</h1>
// //       <p>Make: {car.make}</p>
// //       <p>Model: {car.model}</p>
// //       <p>Year: {car.year}</p>
// //     </div>
// //   );
// // }

// // export default Home;

// /* I want to Showcases comprehensive statistics, such as the total number of 
// available used cars and the average price, detailed nationally as well as 
// broken down by city and state.*/

// // Path: client/src/components/Statistics.js
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function Statistics() {
//   const [stats, setStats] = useState({});

//   useEffect(() => {
//     axios.get("/api/stats").then((response) => {
//       setStats(response.data);
//     });
//   }, []);

//   return (
//     <div>
//       <h1>Statistics</h1>
//       <p>Total Cars: {stats.totalCars}</p>
//       <p>Average Price: {stats.avgPrice}</p>
//       <p>By City:</p>
//       <ul>
//         {Object.keys(stats.carsByCity || {}).map((city) => (
//           <li key={city}>
//             {city}: {stats.carsByCity[city]}
//           </li>
//         ))}
//       </ul>
//       <p>By State:</p>
//       <ul>
//         {Object.keys(stats.carsByState || {}).map((state) => (
//           <li key={state}>
//             {state}: {stats.carsByState[state]}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Statistics;

// // Path: client/src/App.js
// // import React from "react";
// import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
// import Home from "./components/Home";
// // import Statistics from "./components/Statistics";

// function App() {
//   return (
//     <Router>
//       <nav className="navbar navbar-expand-lg navbar-light bg-light">
//         <ul className="navbar-nav">
//           <li className="nav-item">
//             <Link to="/" className="nav-link">
//               Home
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link to="/statistics" className="nav-link">
//               Statistics
//             </Link>
//           </li>
//         </ul>
//       </nav>
//       <Switch>
//         <Route path="/statistics">
//           <Statistics />
//         </Route>
//         <Route path="/">
//           <Home />
//         </Route>
//       </Switch>
//     </Router>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [car, setCar] = useState({});
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch the car details
  const fetchCarDetails = async () => {
    setLoading(true);
    try {
      const carResponse = await axios.get("/api/car");
      setCar(carResponse.data);
    } catch (error) {
      console.error("Error fetching car details:", error);
    }
  };

  // Function to fetch statistics
  const fetchStats = async () => {
    try {
      const statsResponse = await axios.get("http://localhost:8080/get_statistics");
      setStats(statsResponse.data);
      console.log(statsResponse.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect to trigger data fetching on component mount
  useEffect(() => {
    fetchCarDetails();
    fetchStats();
  }, []);

  return (
    <div className="container mt-3">
      <h1>Home</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Featured Car</h2>
          <p>Make: {car.make}</p>
          <p>Model: {car.model}</p>
          <p>Year: {car.year}</p>

          <h2>Car Statistics</h2>
          <p>Total Cars: </p>
          <p>Average Price: </p>
          <button
          onClick={() => fetchStats()}
          className="btn btn-secondary mr-2"
        >
          Previous
        </button>
          {/* <div>
            <h3>By City:</h3>
            <ul>
              {Object.keys(stats.carsByCity).map(city => (
                <li key={city}>
                  {city}: Cars: {stats.carsByCity[city].count}, Avg Price: ${stats.carsByCity[city].avgPrice.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>By State:</h3>
            <ul>
              {Object.keys(stats.carsByState).map(state => (
                <li key={state}>
                  {state}: Cars: {stats.carsByState[state].count}, Avg Price: ${stats.carsByState[state].avgPrice.toFixed(2)}
                </li>
              ))}
            </ul>
          </div> */}
        </div>
      )}
    </div>
  );
}

export default Home;

