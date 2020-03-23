let env_const = require("./constants");

let copyFile = (ssh, srcPath, destPath)=>{
   return new Promise((resolve, reject) => {
      var cmd = "echo " + env_const.DOMAIN_PASSWORD + " | sudo -S cp -f " + srcPath + " " + destPath;
      ssh.exec(cmd, function(err, stream) {
         if (err){reject();}
         stream.on('close', function(code, signal) {
            if(code == 0 || typeof code === 'undefined')
               resolve();
            else if(code == 1)
               reject(signal);
            else if(code == 2)
               reject("Remote host connection failure");
         }).on('data', function(data) {
            //Nothing goes wrong
         }).stderr.on('data', function(data) {
            //nothing goes wrong
         });
      });
   });
};

let insertExtraInfoToFile = (ssh, filePath, attrName, attrValue)=>{
   return new Promise((resolve, reject) => {
      if(attrName.indexOf(" ") > 0) {reject("attrName cannot have space")}
      var cmd = "echo " + env_const.DOMAIN_PASSWORD + " | sudo -S xattr -w user." + attrName + " '" + attrValue + "' '" + filePath + "'";
      ssh.exec(cmd, function(err, stream) {
         if (err){reject();}
         stream.on('close', function(code, signal) {
            if(code == 0 || typeof code === 'undefined')
               resolve();
            else if(code == 1)
               reject(signal);
            else if(code == 2)
               reject("Remote host connection failure");
         }).on('data', function(data) {
            //Nothing goes wrong
         }).stderr.on('data', function(data) {
            //nothing goes wrong
         });
      });
   });
};

let getExtraInfoToFile = (ssh, filePath, attrName)=>{
   return new Promise((resolve, reject) => {
      if(attrName.indexOf(" ") > 0) {reject("attrName cannot have space")}
      var cmd = "xattr -p user." + attrName + " '" + filePath + "'";
      ssh.exec(cmd, function(err, stream) {
         if (err){reject();}
         stream.on('close', function(code, signal) {
            if(code == 0 || typeof code === 'undefined')
               resolve();
            else if(code == 1)
               reject(signal);
            else if(code == 2)
               reject("Remote host connection failure");
         }).on('data', function(data) {
            resolve(data.toString());
         }).stderr.on('data', function(data) {
            reject(data);
         });
      });
   });
};

module.exports = {
   copyFile: copyFile,
   insertExtraInfoToFile: insertExtraInfoToFile,
   getExtraInfoToFile: getExtraInfoToFile
};