const functions = require('firebase-functions');
const firebase = require('firebase');
const sftpManager = require("./sftp-manager-server");
const sftpHelper = require("./sftp-helper-server");
const cors = require('cors')({origin: true});

exports.signUp = functions.https.onRequest((request, response) => {
   return cors(request, response, () => {
      firebase.auth().createUserWithEmailAndPassword(request.body.email, request.body.password)
      .then((reply)=>{
         let user = reply.user;
         let uid = user.uid;
         if(user){
            console.log(request.body.displayName)
            user.updateProfile({
               displayName: request.body.displayName
            })
            .then(async ()=>{
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
            })
         }
      })
      .catch((error)=>{
         // Handle Errors here.
         sftpManager.end();
         response.status(500).send(error.message);
      });
   });
});

exports.logIn = functions.https.onRequest((request, response) => {
   return cors(request, response, () => {
      firebase.auth().signInWithEmailAndPassword(request.body.email, request.body.password)
      .then((reply)=>{
         let json = {
            uid: reply.user.uid,
            displayName: reply.user.displayName
         }
         response.status(200).send(json);
      })
      .catch((error)=>{
         // Handle Errors here.
         response.status(401).send(error.message);
      });
   });
});