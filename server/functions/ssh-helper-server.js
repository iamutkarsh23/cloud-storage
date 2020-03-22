let copyFile = (ssh, srcPath, destPath)=>{
   return new Promise((resolve, reject) => {
      var cmd = "echo Qwerty@1 | sudo -S cp -f " + srcPath + " " + destPath;
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

module.exports = {
   copyFile: copyFile
};