let remote = require("electron").remote;

let getFolders = (data)=>{
   var scannedFolders = [];
   
   if(Array.isArray(data)) {
      data.forEach(function (d) {
         if (d.type === 'd') {
            scannedFolders.push(d);
         }
      });
   } else {
      console.warn("Given data to getFolder function is not array, therefore it is not supported");
   }

   return scannedFolders;
}

let getFiles = (data)=>{
   var scannedFiles = [];
   
   if(Array.isArray(data)) {
      data.forEach(function (d) {
         if (d.type === '-') {
            scannedFiles.push(d);
         }
      });
   } else {
      console.warn("Given data to getFiles function is not array, therefore it is not supported");
   }

   return scannedFiles;
}

module.exports = {
   getFolders: getFolders,
   getFiles: getFiles
};