const express = require('express');
const path = require('path');
var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var qs = require('querystring');
var ejs = require('ejs');

var mysqlLoader = require("../database/mysqlLoader.js")

//팀 정보 조회
exports.teamInfo = function (request, response)
{
  var body = '';
  const chunks = [];
  var _data;
  request.on('data', chunk => chunks.push(chunk));
  request.on('end', () =>
  {
    data = JSON.parse(Buffer.concat(chunks).toString());
    console.log('Data : ', data);
    var connection = mysqlLoader.mysql_load();
    connection.query(
      "SELECT UDID, ID, name, team_ID, team_name, team_main_subj, team_MMR, winning_rate from `user` as a join (SELECT team_ID, team_name, team_leader_UDID, team_main_subj, team_MMR, winning_rate from team where team_ID = ?) as b on (a.UDID = b.team_leader_UDID)",
    [data.team_ID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}

//팀 경기 결과 조회
exports.teamResultSearch = function (request, response)
{
  var body = '';
  const chunks = [];
  var _data;
  request.on('data', chunk => chunks.push(chunk));
  request.on('end', () =>
  {
    data = JSON.parse(Buffer.concat(chunks).toString());
    console.log('Data : ', data);
    var connection = mysqlLoader.mysql_load();
    connection.query(
      "SELECT match_ID, win_team_ID, win_team_name, win_team_MMR, win_winning_rate, lose_team_ID, lose_team_name, lose_team_MMR, lose_winning_rate, temp.gym_ID, gym_name, gym_location, mvp_UDID, mvp_ID, mvp_name from (SELECT match_ID, win_team_ID, lose_team_ID, a.gym_ID, a.fac_ID, score, mvp_UDID, starttime, endtime from match_result as a join fac_schedule as b on (match_ID = b.schedule_ID)) as temp join (select team_ID, team_name as win_team_name, team_MMR as win_team_MMR, winning_rate as win_winning_rate from team) as c on (temp.win_team_ID = c.team_ID) join (select team_ID, team_name as lose_team_name, team_MMR as lose_team_MMR, winning_rate as lose_winning_rate from team) as d on (temp.lose_team_ID = d.team_ID) join (select gym_ID, gym_name, gym_location from gym) as e on (temp.gym_ID = e.gym_ID) join (select UDID, ID as mvp_ID, name as mvp_name from `user`) as f on (temp.mvp_UDID = f.UDID) WHERE win_team_ID = ? OR lose_team_ID = ?",
    [data.team_ID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}

//팀 멤버 목록 조회
exports.teamMemberSearch = function (request, response)
{
  var body = '';
  const chunks = [];
  var _data;
  request.on('data', chunk => chunks.push(chunk));
  request.on('end', () =>
  {
    data = JSON.parse(Buffer.concat(chunks).toString());
    console.log('Data : ', data);
    var connection = mysqlLoader.mysql_load();
    connection.query(
      "SELECT UDID, ID, MMR, name, gender from `user` natural join soccer_record where UDID in (SELECT UDID from team natural join team_user_list where team_ID = ?)",
    [data.team_ID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}

//팀 검색
exports.searchTeam = function (request, response)
{
  var body = '';
  const chunks = [];
  var _data;
  request.on('data', chunk => chunks.push(chunk));
  request.on('end', () =>
  {
    data = JSON.parse(Buffer.concat(chunks).toString());
    console.log('Data : ', data);
    var connection = mysqlLoader.mysql_load();
    connection.query(
      "SELECT team_ID, team_name, team_leader_UDID, team_main_subj, winning_rate, team_MMR from team where team_name like '%" + data.searchword + "%' limit 5",
    [data.searchword],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}

//팀 검색
exports.checkIdDup = function (request, response)
{
  var body = '';
  const chunks = [];
  var _data;
  request.on('data', chunk => chunks.push(chunk));
  request.on('end', () =>
  {
    data = JSON.parse(Buffer.concat(chunks).toString());
    console.log('Data : ', data);
    var connection = mysqlLoader.mysql_load();
    connection.query(
      "SELECT COUNT(*) as isduplicated FROM team WHERE team_name = ?",
    [data.team_name],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}

//팀 생성
exports.createTeam = function (request, response)
{
  var body = '';
  const chunks = [];
  var _data;
  request.on('data', chunk => chunks.push(chunk));
  request.on('end', () =>
  {
    data = JSON.parse(Buffer.concat(chunks).toString());
    console.log('Data : ', data);
    var connection = mysqlLoader.mysql_load();
    connection.query(
      "insert into team (team_name, team_leader_UDID, team_MMR, team_main_subj, winning_rate) values (?, ?, '2000', ?, '0')",
    [data.team_name, data.UDID, data.subj_ID],
    function(err, results){
      if(err)
        console.log(err);
    });
    connection.query(
      "insert into team_user_list (team_ID, UDID) values((select max(team_ID) from team), ?)",
    [data.UDID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}