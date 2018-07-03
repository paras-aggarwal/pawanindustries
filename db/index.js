const mongoose = require('mongoose');

mongoose.connect(process.env.MLAB_DB_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected To MLab Cloud Database...");
});

module.exports = function (app) {
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
}
