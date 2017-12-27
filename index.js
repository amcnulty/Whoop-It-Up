/**
 * Whoop It Up
 * -----------
 * 
 * Whoop it up is an event organization service where users can create events
 * and invite other users to their events. Events that users are invited to are
 * listed on the user profile page allowing users to easily manage their events.
 * Non-users are able to search our database for public events and filter their
 * search results by category.
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var session = require('express-session');
// The database models
var db = require('./models');
// Router
var pageRoutes = require('./routes/pageRoutes');
// Controllers
var profile = require('./routes/profile.controller');
var event = require('./routes/event.controller');
// PORT to run application on.
var PORT = process.env.PORT || 8080;
// Start express app.
var app = express();
// Favicon
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.png')))
// Handlebars view engine setup.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');
// Middleware registrations
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));
// Application level middleware
app.use('/', pageRoutes);
app.use('/profile', profile);
app.use('/event', event);
// Create database connection and start server on predefined port.
db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});