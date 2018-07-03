var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('../db/users.js');

passport.use(new Strategy(
    function (username, password, cb) {
        db.findByUsername(username, function (err, user) {
            if (err) {
                return cb(err);
            }
            if (!user) {
                return cb(null, false);
            }
            if (user.password != password) {
                return cb(null, false);
            }
            return cb(null, user);
        });
    }));

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    db.findById(id, function (err, user) {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});

module.exports = function (app) {

	// app.use(require('morgan')('combined'));		// To show access details
    app.use(require('cookie-parser')());
    app.use(require('body-parser').urlencoded({extended: true}));
    app.use(require('express-session')({secret: 'keyboard cat', resave: false, saveUninitialized: false}));

    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/admin', require('connect-ensure-login').ensureLoggedIn(), function(req, res){
		res.render('pages/dashboard');
	});

    app.get('/admin/products', function(req, res){
		res.render('pages/add-products');
	});

	app.get('/login', function(req, res){
		res.render('pages/login');
	});

	app.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), function (req, res) {
		res.redirect('/admin');
	});

	app.get('/logout', function (req, res) {
		req.logout();
        res.redirect('/');
    });
}