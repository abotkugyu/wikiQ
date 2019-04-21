
var crypto = require("crypto");

exports.encrypt = function (text, crypto_key) {
  var crypto_type = 'aes-256-ctr';
  var cipher = crypto.createCipher(crypto_type, crypto_key)
  var crypted = cipher.update(text,'utf8','base64')
  crypted += cipher.final('base64');
  return crypted;
}

exports.decrypt = function (text, crypto_key) {
  var crypto_type = 'aes-256-ctr';
  var decipher = crypto.createDecipher(crypto_type, crypto_key)
  var dec = decipher.update(text,'base64','utf8')
  dec += decipher.final('utf8');
  return dec;
}