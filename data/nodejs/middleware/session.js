var cookieParser = require('cookie-parser'); 
var session = require('express-session');

exports.init = function(app){
  app.use(cookieParser());

  app.use(session({
    secret: 'abot',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60 * 1000
    }
  }));
}
