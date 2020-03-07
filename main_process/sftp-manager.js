const { app, BrowserWindow } = require('electron');
let Client = require('ssh2-sftp-client');

let sftp = new Client();

let initSFTP = () => {
   return new Promise(resolve => {
      //Host name for remote: shrey.myvnc.com
      sftp.connect({
         host: '10.0.0.94',
         port: '2500',
         username: 'dev',
         password: 'Qwerty@1'
      }).then(() => {
         console.log('done');
         resolve(sftp);
      }).catch(err => {
         console.log(err, 'catch error');
      });
   });
}

let closeSFTP = () => {
   return sftp.end();
}

module.exports = {
   init: initSFTP,
   end: closeSFTP
};