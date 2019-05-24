const express = require('express');
const path = require('path');
var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var qs = require('querystring');
var ejs = require('ejs');

var mysqlLoader = require("../database/mysqlLoader.js")

//Get Test
exports.getAllGym = function (request, response)
{
  var body = '';
  const chunks = [];
  var _data;
  request.on('data', chunk => chunks.push(chunk));
  request.on('end', () =>
  {
    data = qs.parse(Buffer.concat(chunks).toString());
    console.log('Data : ', data);
    var connection = mysqlLoader.mysql_load();
    connection.query('SELECT gym_ID, gym_latitude, gym_longitude FROM gym',
    '',
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}

//Get Test
exports.getGymInfo = function (request, response)
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
    connection.query('SELECT gym_ID, gym_name, gym_info, gym_location, avail_starttime, avail_endtime, isfavorite FROM gym natural join (SELECT ? as gym_ID, count(*) as isfavorite from pref_gym_per_user where gym_ID = ? and UDID = ?) as temp  WHERE gym_ID = ?',
    [data.gym_ID, data.gym_ID, data.UDID, data.gym_ID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}

/**
 * 
 * SPORTS TYPE
 * 1. 축구
 * 2. 야구
 * 3. 농구
 * 4. 배구
 * 
 */

//Get Test
exports.getGymInfoBySports = function (request, response)
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
    connection.query('SELECT distinct gym_ID, gym_name, gym_info, gym_location, avail_starttime, avail_endtime, gym_latitude, gym_longitude from gym natural join fac_info where subj_ID = ?',
    [data.subj_ID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}

//즐겨찾기 체육관 조회
exports.searchPrefGym = function (request, response)
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
    connection.query('SELECT gym_ID, gym_name, gym_location from pref_gym_per_user natural join gym natural join fac_info WHERE UDID = ? AND subj_ID = ?',
    [data.UDID, data.subj_ID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}

//즐겨찾기 등록
exports.insertPrefGym = function (request, response)
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
    connection.query('INSERT INTO pref_gym_per_user (UDID, gym_ID) VALUES (?, ?)',
    [data.UDID, data.gym_ID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send("success");
      }
    });
  });

}

//즐겨찾기 삭제
exports.deletePrefGym = function (request, response)
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
    connection.query('DELETE FROM pref_gym_per_user WHERE UDID = ? AND gym_ID = ?',
    [data.UDID, data.gym_ID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send("success");
      }
    });
  });

}