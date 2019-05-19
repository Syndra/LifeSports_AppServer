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
exports.test1 = function (request, response)
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
    connection.query('SELECT * FROM team',
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

//Post Test
exports.test2 = function (request, response)
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
    connection.query('SELECT * FROM team where team_ID < ?',
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