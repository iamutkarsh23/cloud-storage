let $ = require("jquery");
let sftpHelper = require("./assets/js/sftp-helper");

var   filemanager = $('.filemanager'),
      breadcrumbs = $('.breadcrumbs'),
      fileList = filemanager.find('.data');
      
$(async function(){
   breadcrumbs.text('').append('<a href="sgdsg"><span class="folderName">ertherth</span></a> <span class="arrow">→</span> ');
   // Show the generated elements
   fileList.animate({'display':'inline-block'});

   var file = $('<li class="files"><a href="ssd" title="1" class="files"><span class="icon file f-docx">.docx</span><span class="name">note</span> <span class="details">23Kb</span></a></li>');
   file.appendTo(fileList);
   var temp = await sftpHelper.getDirList('./');
   console.log(temp[0]);
});