const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

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
