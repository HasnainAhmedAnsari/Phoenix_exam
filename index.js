const fs = require('fs');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// SABOTAGE 1: Expects a very specific environment variable name!
const dbUri =
  process.env.MONGODB_URI ||
  process.env.DATABASE_URI ||
  'mongodb://localhost:27017/phoenix';

mongoose.connect(dbUri)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Failed to connect:', err));

const logDir = path.join(__dirname, 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, 'server.log');

function writeLog(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}



// SABOTAGE 2: Express is looking for a 'public' folder, but Vite builds to 'dist'!
const uiPath = path.join(__dirname, 'dist');
app.use(express.static(uiPath));

app.get('/api/health', (req, res) => {
  writeLog(`Health endpoint accessed from ${req.ip}`);
  res.json({ status: 'API is alive' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(uiPath, 'index.html'));
});


app.listen(5000, () => console.log('Server running on port 5000'));