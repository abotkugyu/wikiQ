var listen_port = 10081;

//server
var express = require("express");
var app = express();
var http = require('http');

//socket
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var connect_count = 0;

//file
var fs = require('fs');

//log
var Logger = require(__dirname + '/middleware/logger.js');
logger = Logger.init();

//post
var request = require('request');

//db
var mysql = require(__dirname + '/middleware/mysql.js');
var connection = mysql.init();

//session
var session = require(__dirname + '/middleware/session.js');
session.init(app);

//config
var Config = require(__dirname + '/middleware/config.js');
config = Config.get_config();

//router
var Router = require(__dirname + '/middleware/router.js');
Router.init(app, connection);

if(config.server == "dev"){
  app.use(express.static(__dirname + "/dist"));
  app.use(express.static(__dirname + "/src"));
} else if(config.server == "prod"){
  app.use(express.static(__dirname + "/dist"));
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
    if( typeof body !== 'undefined') {
      res = JSON.parse(body);
      //rnnamespaceが0ならないとは思うが念のため
      if(!res['query']['random'][0]['title'].match(/:/gi)){
        question_title = res['query']['random'][0]['title'];
        create_question(res['query']['random'][0]['title']);
        return;
      }else{
        return get_question();
      }
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
        send['notice'] = "あたりです！(すでに正解者が出ているので、ポイントは追加されません)";
      }else{
        is_end = 1;
        send['notice'] = "あたり！！";
        connection.query('update user set answer = answer+1 where name = ? ', [data.nickname], function (error, rows, fields) {
          console.log("cant add answer count. name : " + data.nickname)
        });
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

