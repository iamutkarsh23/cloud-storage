require("./firebaseInit");
const userAuth = require("./userAuth");

exports.signUp = userAuth.signUp;
exports.logIn = userAuth.logIn;

