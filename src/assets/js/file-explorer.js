let $ = require("jquery");
let sftpHelper = require("./assets/js/helpers/sftp-helper");
let parsingHelper = require("./assets/js/helpers/parsing-helper");

var   filemanager = $('.filemanager'),
      breadcrumbs = $('.breadcrumbs'),
      fileList = filemanager.find('.data');

let activateFolderClick = async () => {
   fileList.on('click', 'a.folders', async(e)=> {
      // e.preventDefault(); 
      fileList.empty();
      fileList.removeClass('animated');
      sftpHelper.addFolderToCWD($(e.currentTarget).attr("name"));
      let newDirList = await sftpHelper.getDirList($(e.currentTarget).attr("title"));
      await renderDirectories(newDirList);
      renderBreadCrumbs();
      fileList.addClass("animated");
   });
}

let activateBreadCrumbsClick = ()=>{
   $(".breadCrumbsClick").on("click", async(e)=>{
      let cwd = sftpHelper.getCWDasArray()
      let numberOfPopsRequired = cwd.length - (cwd.indexOf(e.currentTarget.name)+1);
      while (numberOfPopsRequired != 0) {
         sftpHelper.removeFolderFromCWD();
         numberOfPopsRequired--;
      }
      let path = sftpHelper.getCWD();
      fileList.empty();
      fileList.removeClass('animated');
      let newDirList = await sftpHelper.getDirList(path);
      await renderDirectories(newDirList);
      renderBreadCrumbs();
      fileList.addClass("animated");
   });
};

// Hiding and showing the search box
// let activateFind = (()=>{
//    filemanager.find('.search').click(()=>{

//       var search = $(this);

//       search.find('span').hide();
//       search.find('input[type=search]').show().focus();

//    });
// });

let renderBreadCrumbs = async()=>{
   let   cwdArray = [],
         breadCrumbsHTML = '';
   
   
   cwdArray = sftpHelper.getCWDasArray();

   breadCrumbsHTML = breadCrumbsHTML.concat('<a class="breadCrumbsClick" name="'+cwdArray[0]+'"><span class="folderName">'+cwdArray[0]+'</span></a>');
   if(cwdArray.length > 1) {
      cwdArray.forEach((folderName, i) =>{
         if(i != 0){
            breadCrumbsHTML = breadCrumbsHTML.concat('<span class="arrow">→</span>');
            breadCrumbsHTML = breadCrumbsHTML.concat('<a class="breadCrumbsClick" name="'+folderName+'"><span class="folderName">'+folderName+'</span></a>');
         }
      });
   }
   breadcrumbs.empty();
   breadcrumbs.append(breadCrumbsHTML);
   activateBreadCrumbsClick();
};

let renderDirectories = async (dirList)=>{
   let folders = parsingHelper.getFolders(dirList);
   let files = parsingHelper.getFiles(dirList);
   let foldersHTML = await parsingHelper.renderFoldersHTML(folders);
   let filesHTML = await parsingHelper.renderFilesHTML(files);
   fileList.append(foldersHTML);
   fileList.append(filesHTML);

   // activateFind();
   // Show the generated elements
   fileList.animate({'display':'inline-block'});
};

$(async ()=>{
   let rootDir = 'Server';
   let dirList = await sftpHelper.getDirList('./'+rootDir);
   sftpHelper.addFolderToCWD(rootDir);
   await renderDirectories(dirList);
   await activateFolderClick();
   renderBreadCrumbs();
   fileList.addClass("animated");
});