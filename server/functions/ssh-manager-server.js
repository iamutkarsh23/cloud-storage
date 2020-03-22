var Client = require('ssh2').Client;
var env_const = require('./constants');

var conn = new Client();

let initSSH = ()=>{
   return new Promise(resolve => {
      conn.on('ready', function() {
         resolve(conn);
      }).connect({
         host: env_const.DOMAIN,
         port: env_const.DOMAIN_PORT,
         username: env_const.DOMAIN_USER,
         password: env_const.DOMAIN_PASSWORD
      });
   });
};

let closeSSH = ()=>{
   return conn.end();
}

module.exports = {
   init: initSSH,
   end: closeSSH
};