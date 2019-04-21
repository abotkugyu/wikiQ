
var log4js = require('log4js');

exports.init = function(){
  var logger = exports = module.exports = {};
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
  return logger;
}