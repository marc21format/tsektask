const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const fs = require('fs');
const os = require('os');
const path = require('path');

// Log file in temp directory so packaged app can write diagnostics
const logFile = path.join(os.tmpdir(), 'tsektask-server.log');
function appendLog(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  try { fs.appendFileSync(logFile, line); } catch (e) { console.error('Failed to write log:', e); }
}

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tsektask')
.then(() => {
  console.log('MongoDB connected');
  appendLog('MongoDB connected');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  appendLog('MongoDB connection error: ' + (err && err.message ? err.message : String(err)));
});

// Import routes
const taskRoutes = require('./routes/tasks');

// Routes
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  appendLog(`Server running on http://localhost:${PORT}`);
});
