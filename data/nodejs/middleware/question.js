var request = require('request');

var question = "";
var question_title = "";
var question_seq = 0;
var now_question = "";
var is_end = false;

exports.get_question = function(){
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

exports.create_question = function(title){
  //logger.log.error(res['query']['random'][0]);
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

exports.init_question = function(){
  is_end = false;
  question_seq = 0;
  now_question = "";
} 

exports.send_question = function(io){
  if(typeof question[question_seq] !== "undefined"){
    now_question = now_question + question[question_seq];
    io.sockets.emit('notice', {value:now_question});
    question_seq++;
  }
}
