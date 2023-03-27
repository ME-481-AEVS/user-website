const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const config = require('./config/database');

require('./controllers/googleAuth')(passport);

const port = process.env.PORT || 3000;

mongoose.connect(config.database);
let db = mongoose.connection;

db.once('open', () => console.log('Connected to MongoDB.'));  // connect to db
db.on('error', (err) => console.log(err));  // check for db errors

let Order = require('./models/order');  // bring in order model

const app = express();  // init app
app.use(express.static(__dirname + '/views'));  // load views
app.use(express.static(__dirname + '/public'));  // define public folder
app.use('/js', express.static(__dirname + '/js/'));
app.use('/css', express.static(__dirname + '/css/'));
app.set('view engine', 'ejs');  // set view engine to ejs

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// express session
app.use(session({
  secret: 'hehe',
  resave: true,
  saveUninitialized: true,
  cooke: { secure: true }
}));

// passport config
require('./controllers/googleAuth')(passport);
app.use(passport.initialize());
app.use(passport.session());

// express messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// home route
app.get('/', (req, res) => {
  res.render('index', { title: null, message: req.flash('message') });
});

let user = require('./routes/user');
let delivery = require('./routes/delivery');

app.use('/user', user);
app.use('/delivery', delivery);

// 404 routes
app.use(function(req, res, next) {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { title: ' | Page Not Found' });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.json({ error: 'Not found' });
    return;
  }

  // default to plain-text
  res.type('txt').send('Not found');
});

// start server
app.listen(port, () => console.log(`Server started on port ${port}.`));
