const express = require('express');
const path = require('path');
var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var qs = require('querystring');
var ejs = require('ejs');

var mysqlLoader = require("../database/mysqlLoader.js")

//Register New User
exports.regiUser = function (request, response)
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
      'INSERT INTO `user` (ID, PWD, name, gender, ) VALUES (?, ?, ?, ?, ?)',
    [data.ID, data.PWD, data.name, data.gender, data.birth],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send("Success");
      }
    });
  });

}

//Try to login
exports.loginTry = function (request, response)
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
      'SELECT UDID, ID, name, gender, birth FROM `user` WHERE ID=? AND PWD=?',
    [data.ID, data.PWD],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}

//get User Information
exports.getUserInfo = function (request, response)
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
      'SELECT ID, name, gender, birth FROM `user` WHERE UDID = ?',
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

//중복검사
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
      'SELECT COUNT(*) as isduplicated FROM `user` WHERE ID = ?',
    [data.ID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}


//유저가 가입한 팀 목록 조회
exports.searchUserTeam = function (request, response)
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
      "SELECT team_ID, team_name, team_leader_UDID, team_MMR, team_main_subj, winning_rate, if(team_leader_UDID = ?, '1', '0') as isleader from team natural join team_user_list where UDID = ?",
    [data.UDID, data.UDID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}