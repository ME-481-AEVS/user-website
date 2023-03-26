const express = require('express');
const app = express();
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/aevs')
let db = mongoose.connection;

app.use(express.static(__dirname + '/views'));  // load views

app.set('view engine', 'ejs');

// home route
app.get('/', (req, res) => {
  res.send('ayooo');
});

// google oauth
app.get('/login', (req, res) => {
  res.render('login');
})

// start server
app.listen(port, () => console.log(`Server started on port ${port}.`));
