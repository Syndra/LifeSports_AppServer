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
var team = require("./team/team.js")

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

app.post('/gym/gymbysport', (req, res) => {
  gym.getGymInfoBySports(req, res);
});

app.post('/gym/favorite', (req, res) => {
  gym.searchPrefGym(req, res);
});

app.post('/gym/favoriteins', (req, res) => {
  gym.insertPrefGym(req, res);
});

app.post('/gym/favoritedel', (req, res) => {
  gym.deletePrefGym(req, res);
});

//SCHEDULE
app.post('/schedule/schedulebyfac', (req, res) => {
  schedule.getScheduleByFac(req, res);
});

app.post('/schedule/scheduletypereserv', (req, res) => {
  schedule.reservationTypeSearch(req, res);
});

app.post('/schedule/scheduletypematch', (req, res) => {
  schedule.matchingTypeSearch(req, res);
});

app.post('/schedule/schedulereservupdate', (req, res) => {
  schedule.insertReservation(req, res);
});

app.post('/schedule/schedulereservjoin', (req, res) => {
  schedule.joinReservation(req, res);
});

app.post('/schedule/schedulematchupdate', (req, res) => {
  schedule.joinMatching(req, res);
});

app.post('/schedule/joinmember', (req, res) => {
  schedule.matchingUserList(req, res);
});

app.post('/schedule/reservationstatus', (req, res) => {
  schedule.reservationStatus(req, res);
});

//TEST
app.post('/schedule/reservationstatustest', (req, res) => {
  schedule.reservationStatusTEST(req, res);
});

app.post('/schedule/matchingstatus', (req, res) => {
  schedule.matchingStatus(req, res);
});

app.post('/schedule/detail', (req, res) => {
  schedule.reservationDetail(req, res);
});

app.post('/schedule/regimatchresult', (req, res) => {
  schedule.matchResult(req, res);
});

app.post('/schedule/toevaluate', (req, res) => {
  schedule.toEvaluateList(req, res);
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

app.post('/user/hasteam', (req, res) => {
  user.searchUserTeam(req, res);
});

//TEAM
app.post('/team/teaminfo', (req, res) => {
  team.teamInfo(req, res);
});

app.post('/team/teamresult', (req, res) => {
  team.teamResultSearch(req, res);
});

app.post('/team/teammember', (req, res) => {
  team.teamMemberSearch(req, res);
});

app.post('/team/teamsearch', (req, res) => {
  team.searchTeam(req, res);
});

app.post('/team/checkdup', (req, res) => {
  team.checkIdDup(req, res);
});

app.post('/team/create', (req, res) => {
  team.createTeam(req, res);
});

app.post('/team/recommended', (req, res) => {
  team.recommendedTeam(req, res);
});


//OTHER
app.listen(3000, () => {
  console.log('Express App on port 3000!');
});
