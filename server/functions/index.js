require("./firebaseInit");
const userAuth = require("./userAuth");
const fileSharing = require('./fileSharing');

exports.signUp = userAuth.signUp;
exports.logIn = userAuth.logIn;
exports.getShareableLinkForFile = fileSharing.getShareableLinkForFile;
exports.makeShareableLinkForFile = fileSharing.makeShareableLinkForFile;