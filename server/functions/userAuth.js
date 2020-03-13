const functions = require('firebase-functions');
const firebase = require('firebase');
const sftpManager = require("./sftp-manager-server");
const sftpHelper = require("./sftp-helper-server");
const cors = require('cors')({origin: true});

exports.signUp = functions.https.onRequest((request, response) => {
   return cors(request, response, () => {
      firebase.auth().createUserWithEmailAndPassword(request.body.email, request.body.password)
      .then(async (reply)=>{
         let uid = reply.user.uid
         let sftp = await sftpManager.init();
         await sftpHelper.makerDirInCurrentCWD(sftp, uid);
         sftpManager.end();
         sftpHelper.removeFolderFromCWD();
         response.status(200).send({uid: uid});
      })
      .catch((error)=>{
         // Handle Errors here.
         sftpManager.end();
         response.status(500).send(error.message);
      });
   });
});