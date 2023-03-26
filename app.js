const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const config = require('./config/database');

require('./controllers/googleAuth')(passport);

const port = process.env.PORT || 3000;

mongoose.connect(config.database);
let db = mongoose.connection;

db.once('open', () => console.log('Connected to MongoDB.'));  // connect to db
db.on('error', (err) => console.log(err));  // check for db errors

const app = express();  // init app

let Order = require('./models/order');  // bring in order model

app.use(express.static(__dirname + '/views'));  // load views
app.set('view engine', 'ejs');  // set view engine to ejs

// express session
app.use(session({
  secret: 'hehe',
  resave: false,
  saveUninitialized: true,
  cooke: { secure: true }
}));

// passport config
require('./controllers/googleAuth')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// home route
app.get('/', (req, res) => {
  res.render('index');
});

let user = require('./routes/user');

app.use('/user', user);

// start server
app.listen(port, () => console.log(`Server started on port ${port}.`));
