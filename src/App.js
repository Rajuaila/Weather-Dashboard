import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const WeatherDisplay = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [receiveNotifications, setReceiveNotifications] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const API_KEY = '8RK9SSM4BNBEJ3S2WUXN9CWNR';
  const API_ENDPOINT = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

  const handleLocationChange = (newLocation) => {
    const sanitizedLocation = newLocation.trim();
    if (isValidLocation(sanitizedLocation)) {
      setLocation(sanitizedLocation);
    } else {
      alert('Invalid location: Please enter a valid location.');
    }
  };

  const isValidLocation = (location) => {
    return true; 
  };

  const fetchWeatherData = async () => {
    if (!location) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`
        ${API_ENDPOINT}/${location}?unitGroup=metric&key=${API_KEY}&contentType=json`
      );
      setWeatherData(response.data);
      setLoading(false);
      setShowNotification(true);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('Location not found. Please enter a valid location.');
      }

      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeatherData();
  };

  const resetForm = () => {
    setName('');
    setLocation('');
    setReceiveNotifications(false);
    setWeatherData(null);
    setShowNotification(false);
  };

  return (
    <div className="weather-container">
      <div className="intro-section">
        <h1> Weather Dashboard!</h1>
        <p>Know your location s weather </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <label htmlFor="name">Your Name:</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-section">
          <label htmlFor="location">Enter Location:</label>
          <input
            type="text"
            id="location"
            placeholder="Enter location"
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
          />
        </div>

        <div className="form-section">
          <label>Receive Notifications:</label>
          <input
            type="checkbox"
            id="notifications"
            checked={receiveNotifications}
            onChange={() => setReceiveNotifications(!receiveNotifications)}
          />
        </div>

        <button type="submit">Get Weather</button>
        <button type="button" onClick={resetForm}>Clear</button>
      </form>

      {loading && <p className="loading">Loading...</p>}

      {showNotification && (
        <div className="notification">
          <p>Weather data loaded successfully! Check the details below.</p>
        </div>
      )}

      {weatherData && (
        <div className="weather-info">
          <h2> Weather in {weatherData.resolvedAddress}</h2>
          <p>Temperature: {weatherData.currentConditions.temp}°C</p>
          <p>Humidity: {weatherData.currentConditions.humidity}%</p>
          <p>Wind Speed: {weatherData.currentConditions.windspeed} m/s</p>
        </div>
      )}

  
    </div>
  );
};

export default WeatherDisplay;