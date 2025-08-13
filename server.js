const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 5000;

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing - send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the application`);
});