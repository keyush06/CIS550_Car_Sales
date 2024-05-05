import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import SearchByPrice from "./components/SearchByPrice";
import SearchByLocation from "./components/SearchByLocation";
import SearchByDescription from "./components/SearchByDescription";
import AdvancedSearch from "./components/AdvancedSearch";
import CompareCars from "./components/CompareCars";
import GeolocationPage from "./components/GeolocationPage";
import logo from "./images/logo.jpeg"; // Import the logo image

import "bootstrap/dist/css/bootstrap.min.css"; // Importing Bootstrap CSS

function App() {
  // Inline style for the rounded logo in the navbar
  const navbarLogoStyle = {
    height: "50px",
    borderRadius: "50%", // Makes the logo round
  };

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="WheelWise Logo" style={navbarLogoStyle} />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/search-by-price">
                  Search By Price
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/search-by-location">
                  Search By Location
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/search-by-desc">
                  Search By Description
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/advanced-search">
                  Advanced Search
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/compare-cars">
                  Compare Cars
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/geolocation">
                  Geolocation
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search-by-price" element={<SearchByPrice />} />
          <Route path="/search-by-location" element={<SearchByLocation />} />
          <Route path="/search-by-desc" element={<SearchByDescription />} />
          <Route path="/advanced-search" element={<AdvancedSearch />} />
          <Route path="/compare-cars" element={<CompareCars />} />
          <Route path="/geolocation" element={<GeolocationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
