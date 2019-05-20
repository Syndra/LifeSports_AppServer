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
    connection.query('SELECT gym_ID, gym_name, gym_info, gym_location, avail_starttime, avail_endtime FROM gym WHERE gym_ID = ?',
    [data.gym_ID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}
