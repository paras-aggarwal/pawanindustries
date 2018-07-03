var express = require('express');
var dotenv = require('dotenv').config();
var bodyParser = require('body-parser');

var app = express();

var routes = require('./routes')(app);
var db = require('./db')(app);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/public'));

app.get('/*', function(req, res){
	res.render('pages/error');
});

app.listen(process.env.PORT || 3000, function(){
	console.log('Server is up and running');
});
