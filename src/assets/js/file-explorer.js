let $ = require("jquery");
let sftpHelper = require("./assets/js/helpers/sftp-helper");
let parsingHelper = require("./assets/js/helpers/parsing-helper");

var   filemanager = $('.filemanager'),
      breadcrumbs = $('.breadcrumbs'),
      fileList = filemanager.find('.data');

// Hiding and showing the search box
let activateFind = (()=>{
   filemanager.find('.search').click(()=>{

      var search = $(this);

      search.find('span').hide();
      search.find('input[type=search]').show().focus();

   });
});

let renderDirectories = async (dirList)=>{
   let folders = parsingHelper.getFolders(dirList);
   let files = parsingHelper.getFiles(dirList);
   let foldersHTML = await parsingHelper.renderFoldersHTML(folders);
   let filesHTML = await parsingHelper.renderFilesHTML(files);
   fileList.append(foldersHTML);
   fileList.append(filesHTML);

   console.log("Folders on Server: ", folders);
   console.log("Files on Server: ", files);

   activateFind();
   // Show the generated elements
   fileList.animate({'display':'inline-block'});
};

$(async ()=>{
   breadcrumbs.text('').append('<a href="sgdsg"><span class="folderName">ertherth</span></a> <span class="arrow">→</span> ');
   
   let dirList = await sftpHelper.getDirList('./Server');
   await renderDirectories(dirList);

   fileList.on('click', 'li.folders',async(e)=> {
      e.preventDefault(); 
      $(".data").empty();
      $(".data").addClass("animated");
      let newDirList = await sftpHelper.getDirList(e.target.title);
      await renderDirectories(newDirList);
   })

});