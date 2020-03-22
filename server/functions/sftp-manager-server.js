let Client = require('ssh2-sftp-client');
const sftpHelper = require("./sftp-helper-server");
const env_const = require("./constants");
let sftp = new Client();

let initSFTP = ()=>{
   return new Promise(resolve => {
      //Host name for remote: shrey.myvnc.com
      sftp.connect({
         host: env_const.DOMAIN,
         port: env_const.DOMAIN_PORT,
         username: env_const.DOMAIN_USER,
         password: env_const.DOMAIN_PASSWORD
      }).then(() => {
         let rootDir = 'Server';
         sftpHelper.addFolderToCWD(rootDir);
         resolve(sftp);
      }).catch(err => {
         console.log(err, 'catch error');
      });
   });
}

let closeSFTP = ()=>{
   return sftp.end();
}

module.exports = {
   init: initSFTP,
   end: closeSFTP
};