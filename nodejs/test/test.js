const express = require('express');
const path = require('path');
var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var qs = require('querystring');
var ejs = require('ejs');

var mysqlLoader = require("../database/mysqlLoader_TEST.js")

//Query 1
exports.test1 = function (request, response)
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
    connection.query("SELECT date_format(NOW(), '%Y') - date_format(birthDate, '%Y') + 1 AS age FROM member WHERE memberID = ?",
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

//Query2
exports.test2 = function (request, response)
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
    connection.query("INSERT INTO enterLog VALUES(sysdate(), ?, ?, NOW(), NULL)",
    [data.member_ID, data.store_ID],
    function(err, results){
      if(err)
        console.log(err);
      else{
        response.send(results);
      }
    });
  });

}