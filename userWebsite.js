const fs = require('fs');
const https = require('https');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const config = require('./config/database');

require('./controllers/googleAuth')(passport);

// const port = process.env.PORT || 3000;

mongoose.connect(config.database);
const db = mongoose.connection;

db.once('open', () => console.log('Connected to MongoDB.')); // connect to db
db.on('error', (err) => console.log(err)); // check for db errors

const app = express(); // init app

const options = {
  cert: fs.readFileSync('/etc/letsencrypt/live/uhm-aevs.online/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/uhm-aevs.online/privkey.pem')
};

app.use(express.static(`${__dirname}/views`)); // load views
app.use(express.static(`${__dirname}/views/components`)); // load views
app.use(express.static(`${__dirname}/public`)); // define public folder

app.use('/scripts/bootstrap', express.static(`${__dirname}/node_modules/bootstrap/dist/`));
app.use('/scripts/bootstrap-icons', express.static(`${__dirname}/node_modules/bootstrap-icons/font/`));
app.use('/scripts/date-time', express.static(`${__dirname}/libs/date-time-custom/dist/`));
app.use('/scripts/qrcode', express.static(`${__dirname}/libs/qrcode/`));
app.use('/scripts/jquery', express.static(`${__dirname}/node_modules/jquery/dist/`));

app.set('view engine', 'ejs'); // set view engine to ejs

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// express session
app.use(session({
  secret: 'hehe',
  resave: true,
  saveUninitialized: true,
  cooke: { secure: true },
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

const user = require('./routes/user');
const delivery = require('./routes/delivery');
const robot = require('./routes/robot');

app.use('/user', user);
app.use('/delivery', delivery);
app.use('/robot', robot);

// 404 routes
app.use((req, res) => {
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

// 500 route
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(500);
  res.render('500', {
    title: ' | Internal Server Error',
    errors: err,
  });
});

// start server
// http  app.listen(port, () => console.log(`Server started on port ${port}.`));
https.createServer(options, app).listen(443);

