const firebase = require('firebase');
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

firebase.initializeApp({
  apiKey: "AIzaSyDZqkFmrATL0_VivsGhSe6Q7OLZnlBUde4",
  authDomain: "cloud-storage-app-dev-tech.firebaseapp.com",
  databaseURL: "https://cloud-storage-app-dev-tech.firebaseio.com",
  projectId: "cloud-storage-app-dev-tech",
  storageBucket: "cloud-storage-app-dev-tech.appspot.com",
  messagingSenderId: "55468172281",
  appId: "1:55468172281:web:20f49e3df89f23eded9328",
  measurementId: "G-GC9GYHS5HJ"
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cloud-storage-app-dev-tech.firebaseio.com"
});