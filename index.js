const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');

require('./models/User');
require('./models/Survey');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());
app.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000,
  keys: [keys.cookieKey] //key to encrypt cookie
}));

//let passport know that it has to use cookies
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  //express will serve up production assets like our main.js file or main.css
  app.use(express.static('client/build')); //if any route gets in and doesnt match any authRoutes nor billingRoutes see if it maches any route we have in /client/build

  //express will serve un the index.html file it doesnt recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
//Listen to port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('server started...')
});