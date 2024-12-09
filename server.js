const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const DataModel = require('./models/dataModel');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/express-server', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(bodyParser.json());

// POST endpoint
app.post('/', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content field is required' });
  }

  // Respond with the content
  res.json({ content });

  // Write the content to a file
  fs.writeFileSync('output.txt', content);

  // Save the entire JSON body to the database
  const data = new DataModel(req.body);
  await data.save();
});

module.exports = app;

// Start the server
if (require.main === module) {
  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
}
