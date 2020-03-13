const functions = require('firebase-functions');
const firebase = require('firebase');
const admin = require("firebase-admin");
const cors = require('cors')({origin: true});

exports.signUp = functions.https.onRequest((request, response) => {
   return cors(request, response, () => {
      firebase.auth().createUserWithEmailAndPassword(request.body.email, request.body.password)
      .then((reply)=>{
         response.status(200).send({uid: reply.user.uid});
      })
      .catch((error)=>{
         // Handle Errors here.
         var errorCode = error.code;
         response.status(500).send(error.message);
      });
   });
});