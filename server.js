// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var request = require('request');

var configDB = require('./config/database.js');

//var crypto = require('crypto');

// var sqlite3 = require('sqlite3');
// var db = new sqlite3.Database('./database.sqlite3');

var sqlite3 = require('sqlite3').verbose();
var TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;

var db = new TransactionDatabase(
    new sqlite3.Database("translatorDB.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
);

var create_descriptions = "CREATE TABLE IF NOT EXISTS DESCRIPTIONS (TRANSLATION_ID TEXT NOT NULL, LANG TEXT NOT NULL, AUTHOR TEXT NOT NULL, LAST_MODIFIED TEXT NOT NULL, ACCESS_UNTIL TEXT NOT NULL);"

var create_translations = "CREATE TABLE IF NOT EXISTS TRANSLATIONS (ORD INTEGER);"

var create_users = "CREATE TABLE IF NOT EXISTS USERS (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, USERNAME TEXT NOT NULL, PASSWORD TEXT NOT NULL, SALT TEXT NOT NULL);"

var create_links = "CREATE TABLE IF NOT EXISTS LINKS (LINK TEXT PRIMARY KEY NOT NULL, NAME TEXT NOT NULL, OPTIONS TEXT NOT NULL);"

var insert_users = "INSERT INTO USERS (USERNAME,PASSWORD,SALT) VALUES ('admin','319fc74fcde346d5c82f4734229952ea4a175af2fab281225f7ea5450351989c','surik43214321');"

var create_revision = "CREATE TABLE IF NOT EXISTS REVISION (REV INTEGER, LINK TEXT);"

var insert_revision = "INSERT INTO REVISION(REV) SELECT 0 WHERE NOT EXISTS(SELECT REV FROM REVISION);"

db.serialize(function() {

    db.run(create_users);
    db.run(insert_users);
 
    db.run(create_descriptions);
    db.run(create_translations);
    db.run(create_links);
    db.run(create_revision);
    db.run(insert_revision);
});

//db.close();
//var db = new sqlite3.Database('translatorDB.db');

console.log(db);
//var router = express.Router();
// configuration ===============================================================
//var db = mongoose.connect(configDB.url); // connect to our database

//var Post = require('./routes/posts')(db);

// Make our db accessible to our router
//var routes = require('./app/routes');

// app.use(function(req,res,next){
//     req.db = db;
//     next();
// });

// app.use(function(req, res, next) {
//   req.db = {};
//   req.db.translations = db.get('translations');
//   next();
// })


//app.use('/', routes);
require('./config/passport')(passport, db); // pass passport for configuration

// set up our express application


// require for use file in public directory
app.use(express.static(process.cwd() + '/public'));

//app.use('/public', express.static(process.cwd() + '/public'));

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

module.exports = mongoose;
//var Post = require('./app/routes.js')(db);
// routes ======================================================================
require('./app/routes.js')(app, passport, db);
//require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport


module.exports = app;
module.exports = db;
//module.exports = crypto;
// launch ======================================================================

app.listen(port);
console.log('The magic happens on port ' + port);
