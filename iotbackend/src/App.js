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
  const MIN_WATER_DISTANCE = 10; // Example threshold for water distance
  const MIN_TEMPERATURE = 28; // Example threshold for temperature

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
      if ((waterResponse.data.distance > MAX_WATER_DISTANCE)) {
        setWaterError(true);
      } else {
        setWaterError(false);
      }
      // Check if temperature exceeds the threshold
      if (temperatureResponse.data.temperature > MAX_TEMPERATURE ||temperatureResponse.data.temperature< MIN_TEMPERATURE) {
        setTemperatureError(true);
      } else {
        setTemperatureError(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const Modal = ({ show, onClose, children }) => {
    if (!show) return null;
  
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <h1 className="title">Water and Temperature Data</h1>
      <Modal show={waterError || temperatureError} onClose={() => {setWaterError(false); setTemperatureError(false);}}>
        <h2 className="modal-title">Danger!</h2>
        {waterError && <p className="modal-message">Water distance exceeds maximum threshold!</p>}
        {temperatureError && <p className="modal-message">Temperature exceeds maximum threshold!</p>}
      </Modal>
      <div className="sensor-data">
        <h2 className="subtitle">Water Data</h2>
        <ul>
          {waterData.map((data, index) => (
            <li key={index} className="data-item">
              <span className="data-label">Distance:</span> {data.distance} meters
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
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;