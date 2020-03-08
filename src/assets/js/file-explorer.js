let $ = require("jquery");
let sftpHelper = require("./assets/js/sftp-helper");

var   filemanager = $('.filemanager'),
      breadcrumbs = $('.breadcrumbs'),
      fileList = filemanager.find('.data');

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

$(async ()=>{
   breadcrumbs.text('').append('<a href="sgdsg"><span class="folderName">ertherth</span></a> <span class="arrow">→</span> ');
   // Show the generated elements
   fileList.animate({'display':'inline-block'});

   var file = $('<li class="files"><a href="ssd" title="1" class="files"><span class="icon file f-docx">.docx</span><span class="name">note</span> <span class="details">23Kb</span></a></li>');
   file.appendTo(fileList);
   var temp = await sftpHelper.getDirList('./');
   console.log("Folders on Server: ", getFolders(temp));
   console.log("Files on Server: ", getFiles(temp));
});