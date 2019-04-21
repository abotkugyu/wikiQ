
var mysql = require('mysql');
var Config = require(__dirname + '/config.js');
config = Config.get_config();

function get_mysql_config(type) {
  if(type == "dev"){
    return {
      host     : '127.0.0.1',
      user     : 'root',
      password : 'root',
      port     : 3306,
    };
  } else if(type == "prod"){
    return {
      host     : 'mysql',
      user     : 'root',
      password : 'root',
      port     : 3306,
    };
  }
}

exports.init = function(connection){
  var connection = mysql.createConnection(get_mysql_config(config.server));
  connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    connection.query("CREATE DATABASE IF NOT EXISTS wikiq;", function (error, results, fields) {
      if(error != null){
        console.error(error);
      }
    });
    connection.query("CREATE TABLE IF NOT EXISTS wikiq.user ("+
    "id int(11) not null AUTO_INCREMENT, "+
    "name text not null, "+
    "pass text not null, "+
    "answer int(11) default 0, "+
    "PRIMARY KEY (id) "+
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8;", function (error, results, fields) {
      if(error != null){
        console.error(error);
      }
    });
    connection.query('use wikiq', function (error, results, fields) {
      if(error != null){
        console.error(error);
      }
    });
  });
  return connection;
}