var listen_port = 10081;

var http = require('http');
var fs = require('fs');
var url = require('url');
var server = http.createServer();　
var log4js = require('log4js');
var logger = exports = module.exports = {};
var request = require('request');
var mysql = require('mysql');
var qs = require('querystring');

var connection = mysql.createConnection({
  host     : 'mysql',
  user     : 'root',
  password : 'root',
  port     : 3306,
});

var db = "CREATE DATABASE IF NOT EXISTS wikiq;";

var table = "CREATE TABLE IF NOT EXISTS wikiq.user ("+
"id int(11) not null AUTO_INCREMENT, "+
"name text not null, "+
"pass text not null, "+
"answer int(11) default 0, "+
"PRIMARY KEY (id) "+
") ENGINE=InnoDB DEFAULT CHARSET=utf8;";

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  connection.query(db, function (error, results, fields) {
    console.error(error);
  });
  connection.query(table, function (error, results, fields) {
    console.error(error);
  });
});


log4js.configure({
     appenders: {
         log: {
             type: "file",
             filename: "./log/log",
         }
    },
    categories: { default: { appenders: ['log'], level: 'info' } }
});
logger.log = log4js.getLogger('log');
logger.log.error('start'); 

function get_question(){
  var dt = new Date();
  var seconds = dt.getSeconds();
//  if(seconds == 0){
  get_question();
//}
}

var question = "";
var question_title = "";
var question_seq = 0;
var now_question = "";
var is_end = false;

function get_question(){
  var options = {
    uri: "https://ja.wikipedia.org/w/api.php",
    qs: {
      action: "query",
      list: "random",
      rnnamespace: 0,
      rnlimit: 1,
      format: "json",
    }
  };
  request.get(options, function(error, response, body){
    res = JSON.parse(body);
    //rnnamespaceが0ならないとは思うが念のため
    if(!res['query']['random'][0]['title'].match(/:/gi)){
      question_title = res['query']['random'][0]['title'];
      create_question(res['query']['random'][0]['title']);
      return;
    }else{
      return get_question();
    }
  });
}

function create_question(title){
  logger.log.error(res['query']['random'][0]);
  var options = {
    uri: "https://ja.wikipedia.org/w/api.php",
    qs: {
      action: "query",
      prop: "revisions",
      rvprop: "content",
      format: "json",
      titles: title,
    }
  };
  request.get(options, function(error, response, body){
    res = JSON.parse(body);
    for(key in res['query']['pages']){
      question = res['query']['pages'][key]['revisions'][0]['*'];
      logger.log.error(res['query']['pages'][key]['revisions'][0]['*']);
      init_question();
    }
  });  
}

function init_question(){
  is_end = false;
  question_seq = 0;
  now_question = "";
} 

function vp(path){
  return "view/build/"+path;
}

function get_content_type(path){
  if (path.match(/.json$/)){
    return "application/json";
  } else if (path.match(/.js$/)) {
    return "application/javascript";
  }
  return "text/html"; 
}

function send_question(){
  if(typeof question[question_seq] !== "undefined"){
    now_question = now_question + question[question_seq];
    io.sockets.emit('notice', {value:now_question});
    question_seq++;
  }
}

function set_ranking($id){
  connection.query('update user set answer = answer+1 where id = ?',[''], function (error, rows, fields) {
    
  });
}

function send_ranking(){
  connection.query('SELECT name,answer FROM `user` order by desc', function (error, rows, fields) {
    
  });
  io.sockets.emit("send_ranking", {value:send});
}

server.on('request', function(req, res) {
  var path = url.parse(req.url).pathname;
  console.log(path);
  if(path == '/index.html' || path == '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var output = fs.readFileSync(vp("index.html"), "utf-8");
    res.write(output);
  }else if(path === '/login'){
    var body='';
    req.on('data', function (data) {
        body +=data;
    });
    req.on('end',function(){
        var POST =  qs.parse(body);
        console.log(POST);
    });
  }else if(path === '/favicon.ico'){
    if (fs.existsSync(vp("favicon.ico"))) {
      res.writeHead(200, {'Content-Type': 'image/x-icon'});
      var output = fs.readFileSync(vp(path), "utf-8");
      res.write(output);
    }else{
      res.writeHead(403, {'Content-Type': 'text/html'});
    }
  }else if(path.match(/.json$/)){
    if (fs.existsSync(vp(path))) {  
      res.writeHead(200, {'Content-Type': 'application/json'});
      var output = fs.readFileSync(vp(path), "utf-8");
      res.write(output);
    }else{
      res.writeHead(403, {'Content-Type': 'text/html'});
    }
  }else{
    content_type = get_content_type(path);
    if (fs.existsSync(vp(path))) {  
      res.writeHead(200, {'Content-Type': content_type});
      var output = fs.readFileSync(vp(path),"utf-8");
      res.write(output);
    }else{
      res.writeHead(403, {'Content-Type': content_type});
    }
  }
  res.end();
});



var io = require('socket.io').listen(server);
var connect_count = 0;

get_question();
setInterval(send_question,50);
setInterval(get_question,60000);

io.sockets.on('connection', function(socket) {
  
  connect_count += 1;
  logger.log.error('open socket: now connect '+connect_count+' '+JSON.stringify(socket.handshake));

  socket.on("send_answer", function (data) {
    var send = {};
    send['answer'] = data.value;
    if(data.value == question_title){
      if(is_end){
        send['notice'] = "あたりです！<br>(すでに正解者が出ているので、ポイントは追加されません)";
      }else{
        is_end = 1;
        send['notice'] = "あたり！！";
        //set_ranking();
        //send_ranking();
      }
    }else{
      send['notice'] = "はずれ";
    }
    io.sockets.to(socket.id).emit("send_answer_hit", {value:send});
    socket.broadcast.emit("send_answer_hit", {value:"他の人が正解しました"});
  });
  
  socket.on("get_ranking", function (data) {
    //socket.broadcast.emit("write", {value:data.value});
  });

  socket.on("disconnect", function () {
    connect_count -= 1;
    logger.log.info('close socket: now connect '+connect_count); 
  });

});

server.listen(listen_port);

