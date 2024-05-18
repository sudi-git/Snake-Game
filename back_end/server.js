const express = require('express');
const path = require('path');

const app = express();
const PORT = 3010;

// Serve static files from the 'front-end' directory
app.use(express.static(path.join(__dirname, '..', 'front_end')));

// Serve index.html explicitly when accessing the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front_end', 'index.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'front_end', 'information.html'));
  });
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
