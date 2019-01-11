var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var api = require('./routes/api');
var passport = require('passport');
var config = require('./config/database');
var PORT = process.env.PORT || 4242;
var app = express();

var db_url = config.database;
mongoose.connect(db_url, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(passport.initialize());

app.use('/api/1.0', api);
app.use('/', express.static(__dirname + '/www'));

app.get('/', function(req,res){
    res.render('index', {messages: ''});
});

app.listen(PORT, function(){
    console.log('Server up and running');
});