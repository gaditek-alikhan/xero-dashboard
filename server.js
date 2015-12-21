/* jslint node: true */
//'use strict';
var logger = require("./utilities/logger");
var express = require('express');
var bodyParser = require('body-parser');
var path     = require('path');
var util = require("util");
var fs = require('fs');
var async = require('async');
var Xero = require('xero');

var app  = express();
var portNumber = process.env.PORT || 9000;
var baseURL = '/';

logger.debug("Overriding 'Express' logger");
app.use(require('morgan')({ "stream": logger.stream }));
app.use(express.static(path.join(__dirname, 'app')));
app.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(bodyParser.json());

app.post('/login', function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	if(username == 'admin' && password == 'pass'){
		var data = {"message":"success","user":{"name":"khan","token":"ssds023232","role":"admin"}};
	}else{
	var data = {"message":"failed"};
	}
	
	res.json(data);
});

app.get('/dashboard', function(req, res, next) {
	
	var start_date = req.query.start_date.split('-');
	var end_date = req.query.end_date.split('-');
	var token = req.query.token;
	//console.log(start_date,end_date,token);
	//return false;
	var privateKey = fs.readFileSync("privatekey.pem", "utf8");
	var xero = new Xero("CEP9RUSUGTE0UVGTD2RE4KBXBEWGEY", "JKYIGPIGPNNRFPE82FYZQBIGOQZMQQ", privateKey);
	var escaped_str = "Date >= DateTime("+start_date[0]+", "+start_date[1]+", "+start_date[2]+") && Date <= DateTime("+end_date[0]+", "+end_date[1]+", "+end_date[2]+")";
	//console.log(escaped_str);
	//xero.call('GET', '/payments?where='+encodeURIComponent(escaped_str), null, function(err, json) {
	
	async.series(
    [
        function(callback) {           
			
			xero.call('GET', '/accounts', null, function(err, json) {
				//fs.readFile('accounts.json', 'utf8', function (err, data) {  // avoid unneccessary hits on xero server
				if (err) throw err;
					//obj = JSON.parse(data);
					obj = json;					
					var acc = obj.Response.Accounts.Account;				
					var accounts = [];
					for(var i in acc){
						var tmp = {};
						tmp.name = acc[i].Name;
						tmp.type = acc[i].Type;
						tmp.currency_code = acc[i].CurrencyCode || 'n/a';
						accounts.push(tmp);
					}		   
					callback(null, accounts);			
			}); 
			
        },
        function(callback) {

			//xero.call('GET', '/payments', null, function(err, json) {
			xero.call('GET', '/payments?where='+encodeURIComponent(escaped_str), null, function(err, json) {
				//fs.readFile('payments.json', 'utf8', function (err, data) {	// avoid unneccessary hits on xero server
				if (err) throw err;

					//obj = JSON.parse(data);
					obj = json;
					var acc = obj.Response.Payments.Payment;				
					var payments = [];
					var payment_types = {};
					
					for(var i in acc){
					
						var tmp = {};
						tmp.contact_name = acc[i].Invoice.Contact.Name;
						tmp.payment_type = acc[i].PaymentType;				
						tmp.bank_amount = acc[i].BankAmount;
						tmp.date_time = acc[i].Date;
						tmp.status = acc[i].Status;
						tmp.currency_code = acc[i].Invoice.CurrencyCode;
											
						if (!payment_types.hasOwnProperty(acc[i].PaymentType)) {
							payment_types[acc[i].PaymentType] = 0;
						}
						payment_types[acc[i].PaymentType] += parseFloat(acc[i].BankAmount);					
						payments.push(tmp);

					}
					var data = [payments,payment_types];
					callback(null, data);			
			});
		
        },
    ],
		function(err, response) {			
			res.send({'accounts':response[0],'payments':response[1][0],'payment_types':response[1][1]});
		}
	);
    	
});

app.listen(portNumber);//get the server app running...
console.log('\nNode server listening on port ' + portNumber);

//basic error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, '500 - Internal server error');
});