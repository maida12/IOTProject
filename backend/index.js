const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();


app.use(cors());
mongoose.connect('mongodb+srv://orthoimplantsgu:pakistan@cluster0.eegqz25.mongodb.net/IOT?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// Once connected, log a success message
db.once('open', () => {
    console.log('Connected to MongoDB database successfully');
  });

// Define the collection name
const iotCollection = db.collection('Project');
// API endpoints
app.get('/api/water', async (req, res) => {
    try {
      // Query the 'Project' collection for the most recent water data
      const waterData = await iotCollection.find({}).sort({ _id: -1 }).limit(1).project({ _id: 0, distance: 1 }).toArray();
      res.json(waterData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/api/temperature', async (req, res) => {
    try {
      // Query the 'Project' collection for the most recent temperature data
      const temperatureData = await iotCollection.find({}).sort({ _id: -1 }).limit(1).project({ _id: 0, temperature: 1 }).toArray();
      res.json(temperatureData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
