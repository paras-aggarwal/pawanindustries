const mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var upload = require('express-fileupload');

mongoose.connect(process.env.MLAB_DB_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected To MLab Cloud Database...");
});

// Database schema
var ProductSchema = mongoose.Schema({
	category: String,
	type: String,
    productName: String,
    productImage: String,
    description: String,
    descriptionImage: String,
    descriptionImage2: String,
    videoLink: String,
    specifications: String,
    dimensionImage: String,
    segment: String,
    alias: String,
    visibility: String,
    createdAt: String
});

// Models
var Product = mongoose.model('Product', ProductSchema);

module.exports = function (app) {

    app.use(upload());

    app.post('/admin/sendMail', function(req, res){
        var recipient = req.body.recipient;
        var cc = req.body.cc;
        var bcc = req.body.bcc
        var subject = req.body.subject;
        var message = req.body.message;
        // var filename = req.body.attach;
        var file = req.files.attach;
            
        file.mv('./assets/'+filename, function(err) {
            if(err)
                console.error();
        });

        if(subject == "")
            subject = "<No Subject>";

        var transporter = nodemailer.createTransport({
            host: 'us2.smtp.mailhostbox.com',
            port: 587,
            secure: false,
            auth: {
                user: EMAIL_USERNAME,
                pass: EMAIL_PASSWORD
            }
        });

        let mailOptions = {
            from: '"Pawan Industries" sales@pawanindustries.tech',
            to: recipient,
            cc: cc,
            bcc: bcc,
            subject: subject,
            html: message,
            attachments: [
                {  
                    path: './assets/'+filename
                }
            ]
        }; 

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
        res.render('pages/webmail', {response: "Email Sent!"});

    });

    app.get('/admin/webmail', require('connect-ensure-login').ensureLoggedIn(), function(req, res){
        res.render('pages/webmail', {response: ""});
    });

    app.get('/products', function(req, res){
        Product.find({}, null, {}, function (err, data) {
            if (err) 
                console.error(err);
            else {
                res.render('pages/product-menu', {'product': data});
            }
        });
    });

    // app.get('/admin/hide', require('connect-ensure-login').ensureLoggedIn(), function(req, res){
    //     Product.update({}, { $set: { visibility: "HIDDEN"}}, false, true);
    //             res.render('pages/admin-products',{'product': cb});
    //     });

    app.get('/products/:alias', function(req, res){
        Product.findOne({'alias': req.params.alias}, function (err, c_data) {
            if (err)
                console.error(err);
            else {
                res.render('pages/products', {product: c_data});
            }
        });
    });

	app.get('/admin/products', require('connect-ensure-login').ensureLoggedIn(), function(req, res){
		Product.find({}, null, {}, function (err, data) {
            if (err) 
            	console.error(err);
            else {
            	res.render('pages/admin-products', {'product': data});
            }
        });
	});

    app.get('/admin/products/add', require('connect-ensure-login').ensureLoggedIn(), function(req, res){
        res.render('pages/admin-add-products', {response: ""});
    });

	app.post('/admin/products/add', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
		var newProduct = new Product({
			category: req.body.category,
			type: req.body.type,
			productName: req.body.name,
    		productImage: req.body.product_img,
    		description: req.body.description,
    		descriptionImage: req.body.description_img,
            descriptionImage2: req.body.decription_img2,
    		videoLink: req.body.videoLink,
    		specifications: req.body.specifications,
    		dimensionImage: req.body.dimension_img,
    		segment: req.body.segment,
            alias: req.body.alias,
            visibility: req.body.visibility,
    		createdAt: new Date()
        });
        newProduct.save(function (err, data) {
            if (err) 
            	return console.error(err);
            res.render('pages/admin-add-products', {response: "New Product Added"});
        });
	});
}
