const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const app = express();
require('./controllers/googleAuth')(passport);
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/aevs')
let db = mongoose.connection;

db.once('open', () => console.log('Connected to MongoDB.'));  // connect to db
db.on('error', (err) => console.log(err));  // check for db errors

// bring in order model
let Order = require('./models/order');

app.use(express.static(__dirname + '/views'));  // load views
app.set('view engine', 'ejs');  // set view engine to ejs

// home route
app.get('/', (req, res) => {
  res.send('ayooo');
});

// login route
app.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

// login route
app.get('/login/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/');
});


// start server
app.listen(port, () => console.log(`Server started on port ${port}.`));
