const axios = require('axios');

const serverURL = 'http://localhost:5000/api/data'; // or your deployed backend

// Function to generate random sensor data
function generateFakeData() {
  return {
    temperature: 25 + Math.random() * 5,
    humidity: 50 + Math.random() * 10,
    soil: Math.floor(350 + Math.random() * 100),
    water: Math.floor(250 + Math.random() * 100),
    rain: Math.random() > 0.5 ? 1 : 0,
    light: Math.floor(600 + Math.random() * 100),
    pesticide: Math.floor(100 + Math.random() * 50),
    pest: Math.random() > 0.5 ? 1 : 0,
    acc_x: (Math.random() * 0.2).toFixed(2),
    acc_y: (Math.random() * 0.2 - 0.1).toFixed(2),
    acc_z: 9.8 + (Math.random() * 0.2 - 0.1)
  };
}

// Send 50 requests
(async () => {
  for (let i = 0; i < 50; i++) {
    const data = generateFakeData();
    try {
      const res = await axios.post(serverURL, data);
      console.log(`✅ Data ${i + 1} sent! Status: ${res.status}`);
    } catch (err) {
      console.error(`❌ Error on ${i + 1}:`, err.message);
    }
  }
})();
