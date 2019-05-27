const express = require('express');
const path = require('path');
var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var qs = require('querystring');
var ejs = require('ejs');

exports.mysql_load = function()
{
  var connection = mysql.createConnection({
    host    :'3.16.229.70',
    port : 3306,
    user : 'root',
    password : '1111',
    database:'convenience_store',
    insecureAuth : true
  });
  connection.connect(function(err)
  {
    if(err)
    {
      console.error('mysql connection failed.');
      console.error(err);
      throw err;
    }
  });
  return connection;
}