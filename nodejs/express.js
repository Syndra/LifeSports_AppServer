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

app.post('/searchlogs', (req, res) => {
  search_op_logs(req, res);
});

app.post('/searchwakeuplog', (req, res) => {
  search_op_wakeuplog(req, res);
});

app.post('/searchavg', (req, res) => {
  search_op_avg(req, res);
});

app.listen(3000, () => {
  console.log('Express App on port 3000!');
});
