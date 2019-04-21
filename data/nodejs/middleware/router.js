//crypto
var crypto = require(__dirname + '/crypto.js');

//form paser
var multer = require('multer');
var form = multer({ dest: '/tmp' })

exports.init = function(app, connection){
  app.post(['/login'], form.any(), function ( req, res ) {
    var body = req.body; 
    if (body.nickname == "" || body.password == "") {
      console.log("not input");
      body.nickname = 'nanashi';
    } else {
      pass = crypto.encrypt(body.password, body.nickname);
      connection.query('select id, answer from user where name = ? and pass = ? ', [body.nickname, pass], function (error, rows, fields) {
        if (rows.length < 1) {
          connection.query('insert into user (name, pass) value (?,?) ', [body.nickname, pass], function (error, rows, fields) {
            console.log("create user")
            req.session.user = body.nickname
          });
        }else{
          console.log("already user")
          req.session.id = rows[0].id
          req.session.user = body.nickname
        }
      });
    }

    if (body.login_type == "create") {

    } else if (body.login_type == "join") {
      if (body.room_id === 'undefined' || body.room_id == "") {
        return res.status(200).json({status: 5});
      }
    } else if (body.login_type == "random") {
      
    }

    return res.status(200).json({ status: 4, nickname: body.nickname, });
  });
}
