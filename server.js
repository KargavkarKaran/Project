const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const SensorData = require("./models/SensorData");

const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));  // ✅ Serve frontend files

// ✅ MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/agriculture", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ Mongo Error:", err));

// ✅ POST Sensor Data
app.post("/api/data", async (req, res) => {
  try {
        const payload = req.body;
    if (payload.timestamp) delete payload.timestamp;

    const data = new SensorData(req.body);
    await data.save();
    console.log("🌱 Data saved:", req.body);
    res.status(201).json({ message: "Data saved!" });
  } catch (err) {
    console.error("❌ Save failed:", err);
    res.status(500).json({ error: "Save failed" });
  }
});

// ✅ GET All Sensor Data (no limit)
app.get("/api/data", async (req, res) => {
  try {
    let data = await SensorData.find().sort({ _id: -1 }).limit(50);
    // Validate timestamps and set to current date if invalid or missing
    data = data.map(item => {
      if (!item.timestamp || isNaN(new Date(item.timestamp).getTime())) {
        item.timestamp = new Date();
      }
      return item;
    });
    console.log("Timestamps sent to frontend:", data.map(d => d.timestamp));
    res.json(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// ✅ POST Toggle Relay State
let relayState = false;
app.post("/api/relay", (req, res) => {
  relayState = !relayState;
  console.log("Relay State Changed:", relayState ? "ON" : "OFF");
  res.send(relayState ? "ON" : "OFF");
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
