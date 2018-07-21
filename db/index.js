var express = require('express');
const mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var upload = require('express-fileupload');
var app = express();
app.use(upload());

mongoose.connect(process.env.MLAB_DB_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log("Connected To MLab Cloud Database...");
});

// Database schema
var ProductSchema = mongoose.Schema({
	category: String,
	type: String,
    parent: String,
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
var MailSchema = mongoose.Schema({
    recipient: String,
    cc: String,
    bcc: String,
    subject: String,
    message: String,
    alias: String,
    sentOn: String
});

// Models
var Product = mongoose.model('Product', ProductSchema);
var Mail = mongoose.model('Mail', MailSchema);

module.exports = function (app) {

    app.post('/admin/sent/sendmail', require('connect-ensure-login').ensureLoggedIn(), function(req, res){
        let alias = req.body.subject.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text

        var newMail = new Mail({
            recipient: req.body.recipient,
            cc: req.body.cc,
            bcc: req.body.bcc,
            subject: req.body.subject,
            message: req.body.message,
            alias: alias,
            sentOn: new Date()
        });
        newMail.save(function (err, data) {
            if (err) 
                return console.error(err);
            res.render('pages/webmail', {response: "Email Sent!"});
        });

        var recipient = req.body.recipient;
        var cc = req.body.cc;
        var bcc = req.body.bcc;
        var subject = req.body.subject;

        var message = req.body.message;
        var structure = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><title></title><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge"></head><body style="border:2px solid #f3f3f3;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#eee;height:100%!important;margin:0!important;padding:0!important;width:100%!important" bgcolor="#eeeeee"><style type="text/css">@media screen and (max-width:480px){.mobile-hide{display:none!important}.mobile-center{text-align:center!important}}</style><table border="0" cellpadding="0" cellspacing="0" width="100%" style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;border-collapse:collapse!important;mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td align="center" style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#eee;mso-table-lspace:0;mso-table-rspace:0" bgcolor="#eeeeee"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;border-collapse:collapse!important;max-width:600px;mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td align="center" valign="top" style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;font-family:Open Sans,Helvetica,Arial,sans-serif;font-size:36px;font-weight:800;line-height:48px;mso-table-lspace:0;mso-table-rspace:0;padding:35px" bgcolor="#323754"><h1 style="font-size:25px;font-weight:750;margin:0;color:#fff">PAWAN INDUSTRIES</h1></td></tr><tr><td align="center" style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#fff;mso-table-lspace:0;mso-table-rspace:0;padding:35px" bgcolor="#ffffff"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;border-collapse:collapse!important;max-width:600px;mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td align="left" style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;font-family:Open Sans,Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:24px;mso-table-lspace:0;mso-table-rspace:0"><p style="font-size:16px;font-weight:400;line-height:24px;color:#777">'+message+'</p></td></tr></tbody></table></td></tr><tr></tr><tr><td align="center" style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#1b9ba3;border-bottom:20px solid #48afb5;mso-table-lspace:0;mso-table-rspace:0;padding:35px" bgcolor="#1b9ba3"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;border-collapse:collapse!important;max-width:600px;mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td align="center" style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0;mso-table-rspace:0"><table style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;border-collapse:collapse!important;mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0;mso-table-rspace:0;padding:0 10px"><a href="https://www.facebook.com/pawanindustries/" target="_blank" style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%"><img src="https://pawanindustries.herokuapp.com/assets/social/facebook-icon.png" style="-ms-interpolation-mode:bicubic;border:0;height:auto;line-height:100%;outline:0;text-decoration:none"></a></td><td style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0;mso-table-rspace:0;padding:0 10px"><a href="https://www.facebook.com/pawanindustries/" target="_blank" style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%"><img src="https://pawanindustries.herokuapp.com/assets/social/instagram-icon.png" style="-ms-interpolation-mode:bicubic;border:0;height:auto;line-height:100%;outline:0;text-decoration:none"></a></td><td style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0;mso-table-rspace:0;padding:0 10px"><a href="https://www.facebook.com/pawanindustries/" target="_blank" style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%"><img src="https://pawanindustries.herokuapp.com/assets/social/google-plus-icon.png" style="-ms-interpolation-mode:bicubic;border:0;height:auto;line-height:100%;outline:0;text-decoration:none"></a></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td align="center" style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#fff;mso-table-lspace:0;mso-table-rspace:0;padding:35px" bgcolor="#ffffff"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;border-collapse:collapse!important;max-width:600px;mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td align="center" style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0;mso-table-rspace:0"><img src="https://pawanindustries.herokuapp.com/assets/logo-pawan.png" width="55" height="55" style="-ms-interpolation-mode:bicubic;border:0;display:block;height:auto;line-height:100%;outline:0;text-decoration:none"></td></tr><tr><td align="center" style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;font-family:Open Sans,Helvetica,Arial,sans-serif;font-size:14px;font-weight:400;line-height:24px;mso-table-lspace:0;mso-table-rspace:0;padding:5px 0 10px 0"><p style="font-size:14px;font-weight:800;line-height:18px;color:#333">PAWAN INDUSTRIES<br>Opp. Housing Board Colony, Naraingarh Road,<br>Ambala City - 134007</p></td></tr><tr><td align="left" style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;font-family:Open Sans,Helvetica,Arial,sans-serif;font-size:14px;font-weight:400;line-height:24px;mso-table-lspace:0;mso-table-rspace:0"><hr><p style="font-size:14px;font-weight:400;line-height:20px;color:#777"><b>Contact Info: </b>+91 9416026344, +91 9992079494<br><b>Email: </b>sales@pawanindustries.tech</p></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></body></html>';

        if(subject == "")
            subject = "<no subject>";

        let transporter = nodemailer.createTransport({
            host: 'us2.smtp.mailhostbox.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        let mailOptions = {
            from: '"Pawan Industries" sales@pawanindustries.tech',
            to: recipient,
            cc: cc,
            bcc: bcc,
            subject: subject,
            html: structure
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });

    });

    app.get('/admin/sent', require('connect-ensure-login').ensureLoggedIn(), function(req, res){
        Mail.find({}, function (err, data) {
            if (err) 
                console.error(err);
            else {
                res.render('pages/sent', {mail: data});
            }
        });
    });

    app.get('/admin/sent/:alias', require('connect-ensure-login').ensureLoggedIn(), function(req, res){
        Mail.findOne({'alias': req.params.alias}, function (err, m_data) {
            if (err)
                console.error(err);
            else {
                res.render('pages/email', {mail: m_data});
            }
        });
    });

    app.get('/admin/sent/delete/:alias', function(req, res) {
        Mail.findOneAndDelete({'alias': req.params.alias}, function(err, m_data) {
            if(err)
                console.error(err);
            else {
                res.redirect('/admin/sent');
            }
        });
    });

    app.get('/admin/sent/forward/:alias', function(req, res) {
        Mail.findOne({'alias': req.params.alias}, function(err, m_data) {
            if(err)
                console.error(err);
            else {
                res.render('pages/admin-forward-mail', {mail: m_data});
            }
        });
    });

    app.get('/products', function(req, res){
        Product.find({}, function (err, data) {
            if (err) 
                console.error(err);
            else {
                res.render('pages/product-menu', {product: data});
            }
        });
    });

    app.get('/products/:alias', function(req, res){
        Product.findOne({'alias': req.params.alias}, function (err, p_data) {
            if (err)
                console.error(err);
            else {
                res.render('pages/products', {product: p_data});
            }
        });
    });

    app.get('/products/sub/:alias', function(req, res){
        Product.findOne({'alias': req.params.alias}, function (err, p_data) {
            if (err)
                console.error(err);
            else {
                Product.find({'parent': req.params.alias}, function (err, sub_data) {
                    if (err)
                        console.error(err);
                    else {
                        res.render('pages/sub-product', {product: sub_data, parent: p_data});
                    }
                });
            }
        });
    });

	app.get('/admin/products', require('connect-ensure-login').ensureLoggedIn(), function(req, res){
		Product.find({}, function (err, data) {
            if (err) 
            	console.error(err);
            else {
            	res.render('pages/admin-products', {product: data, response: ""});
            }
        });
	});

	app.post('/admin/products/add', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {

		var newProduct = new Product({
			category: req.body.category,
			type: req.body.type,
            parent: req.body.parent,
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

    app.get('/admin/products/hide/:alias', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
        Product.findOneAndUpdate({'alias': req.params.alias}, {$set:{'visibility': 'HIDDEN'}}, function(err, u_data) {
            if(err)
                console.error(err);
            else {
                res.redirect('/admin/products');
            }
        })
    });

    app.get('/admin/products/show/:alias', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
        Product.findOneAndUpdate({'alias': req.params.alias}, {$set:{'visibility': 'VISIBLE'}}, function(err, u_data) {
            if(err)
                console.error(err);
            else {
                res.redirect('/admin/products');
            }
        })
    });

    app.get('/admin/products/delete/:alias', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
        Product.findOneAndDelete({'alias': req.params.alias}, function(err, d_data) {
            if(err)
                console.error(err);
            else {
                res.redirect('/admin/products');
            }
        })
    });

    app.get('/admin/products/edit/:alias', require('connect-ensure-login').ensureLoggedIn(), function(req, res) {
        Product.findOne({'alias': req.params.alias}, function (err, e_data) {
            if (err)
                console.error(err);
            else {
                res.render('pages/admin-edit-products', {product: e_data});
            }
        });
    });

    app.post('/admin/products/edit/:alias', require('connect-ensure-login').ensureLoggedIn(), function(req, res) {
        Product.findOneAndUpdate({'alias': req.params.alias}, {$set: {
            'category': req.body.category,
            'type': req.body.type,
            'parent': req.body.parent,
            'productName': req.body.name,
            'productImage': req.body.product_img,
            'description': req.body.description,
            'descriptionImage': req.body.description_img,
            'descriptionImage2': req.body.decription_img2,
            'videoLink': req.body.videoLink,
            'specifications': req.body.specifications,
            'dimensionImage': req.body.dimension_img,
            'segment': req.body.segment,
            'alias': req.body.alias,
            'visibility': req.body.visibility }
        }, function(err, u_data) {
            if(err)
                console.error(err);
            else
                res.redirect('/admin/products');
        });
    });

}