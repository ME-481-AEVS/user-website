const express = require('express');

// init app
const app = express();

// load views
app.use(express.static(__dirname + '/views'));

// home route
app.get('/', (req, res) => {
  res.sendfile('index.html');
});


// start server
app.listen(3000, (req, res) => {
  console.log('Server started on port 3000.');
});
