import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [waterData, setWaterData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [waterError, setWaterError] = useState(false);
  const [temperatureError, setTemperatureError] = useState(false);
  const MAX_WATER_DISTANCE = 1000; // Example threshold for water distance
  const MAX_TEMPERATURE = 30; // Example threshold for temperature


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const waterResponse = await axios.get('http://localhost:5000/api/water'); // Assuming your API endpoint for water data
      const temperatureResponse = await axios.get('http://localhost:5000/api/temperature'); // Assuming your API endpoint for temperature data
      setWaterData(waterResponse.data);
      setTemperatureData(temperatureResponse.data);
      // Check if water distance exceeds the threshold
      if (waterResponse.data.distance > MAX_WATER_DISTANCE) {
        setWaterError(true);
      } else {
        setWaterError(false);
      }
      // Check if temperature exceeds the threshold
      if (temperatureResponse.data.temperature > MAX_TEMPERATURE) {
        setTemperatureError(true);
      } else {
        setTemperatureError(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Water and Temperature Data</h1>
      <div className="sensor-data">
        <h2 className="subtitle">Water Data</h2>
        <ul>
          {waterData.map((data, index) => (
            <li key={index} className="data-item">
              <span className="data-label">Distance:</span> {data.distance} meters
              {waterError && <span className="error-message">Warning: Distance exceeds maximum threshold!</span>}
            </li>
          ))}
        </ul>
      </div>
      <div className="sensor-data">
        <h2 className="subtitle">Temperature Data</h2>
        <ul>
          {temperatureData.map((data, index) => (
            <li key={index} className="data-item">
              <span className="data-label">Temperature:</span> {data.temperature}°C
              {temperatureError && <span className="error-message">Warning: Temperature exceeds maximum threshold!</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;