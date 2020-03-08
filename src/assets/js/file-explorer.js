let $ = require("jquery");
let sftpHelper = require("./assets/js/helpers/sftp-helper");
let parsingHelper = require("./assets/js/helpers/parsing-helper");

var   filemanager = $('.filemanager'),
      breadcrumbs = $('.breadcrumbs'),
      fileList = filemanager.find('.data');

$(async ()=>{
   breadcrumbs.text('').append('<a href="sgdsg"><span class="folderName">ertherth</span></a> <span class="arrow">→</span> ');
   // Show the generated elements
   fileList.animate({'display':'inline-block'});

   var file = $('<li class="files"><a href="ssd" title="1" class="files"><span class="icon file f-docx">.docx</span><span class="name">note</span> <span class="details">23Kb</span></a></li>');
   file.appendTo(fileList);
   var temp = await sftpHelper.getDirList('./');
   console.log("Folders on Server: ", parsingHelper.getFolders(temp));
   console.log("Files on Server: ", parsingHelper.getFiles(temp));
});