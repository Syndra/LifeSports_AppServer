const express = require('express');
const path = require('path');
var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var qs = require('querystring');
var ejs = require('ejs');

var test = require("./test/test.js")
var gym = require("./gym/gym.js")
var schedule = require("./schedule/schedule.js")
var user = require("./user/user.js")

const app = express();

app.use(express.static(path.join(__dirname, 'html')));

//TEST
app.get('/all', (req, res) => {
  test.test1(req, res);
});

app.post('/testPost', (req, res) => {
  test.test2(req, res);
});

//GYM
app.get('/gym', (req, res) => {
  gym.getAllGym(req, res);
});

app.post('/gym/gyminfo', (req, res) => {
  gym.getGymInfo(req, res);
});

//SCHEDULE
app.post('/schedule/schedulebyfac', (req, res) => {
  schedule.getScheduleByFac(req, res);
});

//USER
app.post('/user/regiuser', (req, res) => {
  user.regiUser(req, res);
});

app.post('/user/login', (req, res) => {
  user.loginTry(req, res);
});

app.post('/user/userinfo', (req, res) => {
  user.getUserInfo(req, res);
});

app.post('/user/checkdup', (req, res) => {
  user.checkIdDup(req, res);
});

//OTHER
app.listen(3000, () => {
  console.log('Express App on port 3000!');
});
