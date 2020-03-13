let Client = require('ssh2-sftp-client');
const sftpHelper = require("./sftp-helper-server");

let sftp = new Client();

let initSFTP = ()=>{
   return new Promise(resolve => {
      //Host name for remote: shrey.myvnc.com
      sftp.connect({
         host: '10.0.0.94',
         port: '2500',
         username: 'dev',
         password: 'Qwerty@1'
      }).then(() => {
         let rootDir = 'Server';
         sftpHelper.addFolderToCWD(rootDir);
         resolve(sftp);
      }).catch(err => {
         console.log(err, 'catch error');
      });
   });
}

let getSFTP = ()=>{
   return sftp;
}

let closeSFTP = ()=>{
   return sftp.end();
}

module.exports = {
   init: initSFTP,
   getSFTP: getSFTP,
   end: closeSFTP,
   sftp: sftp
};