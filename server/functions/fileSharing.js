const functions = require('firebase-functions');
const firebase = require('firebase');
const sftpManager = require("./sftp-manager-server");
const sftpHelper = require("./sftp-helper-server");
const sshManager = require('./ssh-manager-server');
const sshHelper = require('./ssh-helper-server');
const env_const = require('./constants');
const cors = require('cors')({origin: true});

// random number generator
let generateRandom = ()=>{
   return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
     s4() + '-' + s4() + s4() + s4();
 }
 
let s4 = ()=>{
   return Math.floor((1 + Math.random()) * 0x10000)
     .toString(16)
     .substring(1);
}

let getDestPathWithNewFileName = (newFileName)=>{
   let sharedFolderPath = '/var/www/html/shared/';
   return (sharedFolderPath.concat(newFileName));
};

let getShareLink = (newFileName)=>{
   return (env_const.DOMAIN.concat('/shared/', newFileName));
};

let getFileExtensionFromSrcPath = (srcPath)=>{
   let temp = srcPath.split('/');
   let fileNameWithExt = temp[temp.length-1].split('.');
   let fileExt = fileNameWithExt[fileNameWithExt.length-1];
   return fileExt;
};

exports.getSharingLinkForFile = functions.https.onRequest((request, response) => {
   return cors(request, response, async () => {
      let srcPath = request.body.srcPath;
      let fileExt = getFileExtensionFromSrcPath(srcPath);
      let newFileName = generateRandom().concat('.'+fileExt);
      let destPath = getDestPathWithNewFileName(newFileName);
      let sharingPath = getShareLink(newFileName);
      let ssh = await sshManager.init();
      sshHelper.getExtraInfoToFile(ssh, srcPath, "shareable_link")
      .then((data)=>{
         ssh.end();
         response.status(200).send({shareable_link: data});
      })
      .catch((e)=>{
         sshHelper.copyFile(ssh, srcPath, destPath)
         .then(()=>{
            sshHelper.insertExtraInfoToFile(ssh, srcPath, "shareable_link", sharingPath)
            .then(()=>{
               ssh.end();
               response.status(200).send({shareable_link: sharingPath});
            })
            .catch((e)=>{
               ssh.end();
               console.log(e);
               response.status(500).send();
            });
         })
         .catch((e)=>{
            ssh.end();
            response.status(500).send({error: e});
         });
      });
   });
});

/*
------------------------------------------------------------------------------------------------------------------
For File Sharing, we need to create a shared folder in /var/www/html/ named 'shared' using below given permission
------------------------------------------------------------------------------------------------------------------
Can we hide change permission of folder in such a way that folder content will not be visible only if user have path
to file, user can see the file.

Yes, this can be done. Note that for files, bits in rwx permission mask mean: r=read, w=write and x=execute.
However, for directories, meaning is different, namely: r=list directory, w=create or delete file in directory, x=descend to directory or access files or directories inside of it.

Knowing this, you can create directory structure which has your desired properties.

mkdir shared
sudo chmod 733 shared

With this, user will see that dir exists, but will not be able to see its contents.
However, he will be able to read existing files in dir. Also, he will be able to cd dir/subdir and have normal access inside of it.

*/