const express = require('express');
const path = require('path');
var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var qs = require('querystring');
var ejs = require('ejs');

const app = express();

app.use(express.static(path.join(__dirname, 'html')));

app.get('/all', (req, res) => {
  default_op_logs(req, res);
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


function mysql_load()
{
  var connection = mysql.createConnection({
    host    :'localhost',
    port : 3306,
    user : 'mysql',
    password : '1111',
    database:'4linux',
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

function search_op_logs(request, response)
{
  var body = '';
  const chunks = [];
  var _data;
  request.on('data', chunk => chunks.push(chunk));
  request.on('end', () =>
  {
    data = qs.parse(Buffer.concat(chunks).toString());
    console.log('Data : ', data);
    var connection = mysql_load();
    connection.query('SELECT * FROM logs where Date > ? or Date < ? order by Date desc',
    [data.starttime, data.endtime],
    function(err, results){
      if(err)
        console.log(err);
      else{
      fs.readFile('html/list.html', 'utf-8', function(error, datas){
        if(error)
          console.log('Readfile error');
        else{
          response.send(ejs.render(datas, {logList:results}));
        }
      });
      }
    });
  });

}

function search_op_wakeuplog(request, response)
{
  var body = '';
  const chunks = [];
  var _data;
  request.on('data', chunk => chunks.push(chunk));
  request.on('end', () =>
  {
    data = qs.parse(Buffer.concat(chunks).toString());
    var connection = mysql_load();
    connection.query('SELECT * FROM wakeuplog where Alarmon > ? or Alarmon < ? order by Alarmon desc',
    [data.starttime, data.endtime],
    function(err, results){
      if(err)
        console.log(err);
      else{
      fs.readFile('html/wakeuplist.html', 'utf-8', function(error, datas){
        if(error)
          console.log('Readfile error');
        else{
          response.send(ejs.render(datas, {wakeuplogList:results}));
        }
      });
      }
    });
  });

}

function search_op_avg(request, response)
{
  var body = '';
  const chunks = [];
  var _data;
  request.on('data', chunk => chunks.push(chunk));
  request.on('end', () =>
  {
    data = qs.parse(Buffer.concat(chunks).toString());
    var connection = mysql_load();
    connection.query('SELECT sec_to_time(Alarmoff - Alarmon) as AVG FROM wakeuplog where (Alarmon > ? or Alarmon < ?) and (Temp > ? or Temp < ?) and (Light > ? or Light < ?) and (Alti > ? or Alti < ?) and (Press > ? or Press < ?)',
    [data.starttime, data.endtime, data.starttemp, data.endtemp, data.startlight, data.endlight, data.startalti, data.endalti, data.startpress, data.endpress],
    function(err, results){
      if(err)
        console.log(err);
      else{
      fs.readFile('html/wakeupavg.html', 'utf-8', function(error, datas){
        if(error)
          console.log('Readfile error');
        else{
          response.send(ejs.render(datas, {wakeuplogList:results}));
        }
      });
      }
    });
  });

}

function default_op_logs(request, response)
{
  var connection = mysql_load();
  connection.query('SELECT * FROM logs', function(err, results)
  {
    if(err)
      console.log(err);
    else{
    fs.readFile('html/list.html', 'utf-8', function(error, datas){
      if(error)
        console.log('Readfile error');
      else{
        response.send(ejs.render(datas, {contactsList:results}));
      }
    });
    }
  });
}

function default_op_wakeuplog(request, response)
{
  var connection = mysql_load();
  connection.query('SELECT * FROM wakeuplog', function(err, results)
  {
    if(err)
      console.log(err);
    else{
    fs.readFile('html/list.html', 'utf-8', function(error, datas){
      if(error)
        console.log('Readfile error');
      else{
        response.send(ejs.render(datas, {contactsList:results}));
      }
    });
    }
  });
}
