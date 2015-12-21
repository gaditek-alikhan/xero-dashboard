Ali Khan
=============
Dashboard Manager using Xero Accounting System

##Installation
npm install

Replace Xero credentials with your in server.js
var xero = new Xero("CEP9RUSUGTE0UVGTD2RE4KBXBEWGEY", "JKYIGPIGPNNRFPE82FYZQBIGOQZMQQ", privateKey);
if required regenerate public/private key pairs as per your project, for more info visit xero developer site

Run with
node server.js

Routes:
yourwebsite.com:9000/
yourwebsite.com:9000/#login
yourwebsite.com:9000/#dashboard

Fronend Type:
single page application using angular.js & bootstrap
