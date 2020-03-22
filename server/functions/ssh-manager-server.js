var Client = require('ssh2').Client;

var conn = new Client();

let initSSH = ()=>{
   return new Promise(resolve => {
      conn.on('ready', function() {
         resolve(conn);
      }).connect({
         host: '10.0.0.94',
         port: 2500,
         username: 'dev',
         password: 'Qwerty@1'
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