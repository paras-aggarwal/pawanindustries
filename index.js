var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.render('pages/home');
});

app.get('/about', function(req, res){
	res.render('pages/about');
});

app.get('/contact', function(req, res){
	res.render('pages/contact');
});

app.get('/loadCell', function(req, res){
	res.render('pages/load_cell');
});

app.get('/*', function(req, res){
	res.render('pages/error');
});

app.listen(process.env.PORT || 3000, function(){
	console.log('Server is up and running');
});
