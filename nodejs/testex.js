const express = require('express');
const path = require('path');
var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var qs = require('querystring');
var ejs = require('ejs');

var test = require("./test/test.js")

const app = express();

app.use(express.static(path.join(__dirname, 'html')));

//TEST
app.post('/ageCheck', (req, res) => {
  test.test1(req, res);
});

app.post('/enterLog', (req, res) => {
  test.test2(req, res);
});

//OTHER
app.listen(3001, () => {
  console.log('Express App on port 3000!');
});
