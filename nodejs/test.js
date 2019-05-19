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
    var connection = mysql_load();
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