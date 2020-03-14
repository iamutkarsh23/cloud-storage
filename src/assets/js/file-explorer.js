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

let activateFind = ()=>{
   // Hiding and showing the search box
   filemanager.find('.search').click((e)=>{
      var search = $(e.currentTarget);
      search.find('span').hide();
      search.find('input[type=search]').show().focus();
   });

   // Listening for keyboard input on the search field.
   // We are using the "input" event which detects cut and paste
   // in addition to keyboard input.
   
   filemanager.find('input').on('input', async(e)=>{
      let indexOfAliasCWD, aliasCWD;
      var phrase = e.currentTarget.value.trim().toLowerCase();
      if(phrase.length) {
         indexOfAliasCWD = sftpHelper.getIndexOfAliasCWD();
         aliasCWD = sftpHelper.getAliasCWD(indexOfAliasCWD);
         let dirList = await sftpHelper.getDirList(aliasCWD);
         let searchResult = await search(dirList, phrase, indexOfAliasCWD);
         fileList.empty();
			if(!searchResult.files.length && !searchResult.folders.length) {
            fileList.hide();
				filemanager.find('.nothingfound').show();
			}
			else {
            fileList.show();
            filemanager.find('.nothingfound').hide();
            renderSearchResult(searchResult);
			}
      } else {
         fileList.removeClass('animated');
         fileList.empty();
         sftpHelper.emptyAliasCWD();
         let cwd = sftpHelper.getCWD();
         let dirList = await sftpHelper.getDirList(cwd);
         await renderDirectories(dirList);
         fileList.addClass('animated');
      }
   }).on('keyup', function(e){
      // Clicking 'ESC' button triggers focusout and cancels the search
      var search = $(this);

      if(e.keyCode == 27) {
         search.trigger('focusout');
      }
   }).focusout(function(e){
      // Cancel the search
      var search = $(this);
      if(!search.val().trim().length) {
         filemanager.find('.nothingfound').hide();
         fileList.show();
         search.hide();
         search.parent().find('span').show();
      }
   });
};

async function asyncForEach(array, callback) {
   for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
   }
}

let searchResultFolders = [];
let searchResultFiles = [];
let search = async (dirList, phrase, indexOfAliasCWD)=>{
   searchResultFolders = [];
   searchResultFiles = [];
   let response = await searchHelper(dirList, phrase, indexOfAliasCWD);
   searchResultFolders = [];
   searchResultFiles = [];
   return response;
};

let searchHelper = async(dirList, phrase, indexOfAliasCWD)=> {
   if(Array.isArray(dirList)) {
      let cwd = sftpHelper.getAliasCWD(indexOfAliasCWD);
      await asyncForEach(dirList, async (item, index) => {
         if (item.type === 'd') {
            sftpHelper.addFolderToAliasCWD(item.name, indexOfAliasCWD);
            let nextCWD = sftpHelper.getAliasCWD(indexOfAliasCWD);
            let nextDirList = await sftpHelper.getDirList(nextCWD);
            await searchHelper(nextDirList, phrase, indexOfAliasCWD);
            if(item.name.toLowerCase().includes(phrase)){
               searchResultFolders.push({
                  path: nextCWD,
                  folder: item
               });
            }
         } else if (item.type === '-') {
            if(item.name.toLowerCase().includes(phrase)){
               searchResultFiles.push({
                  path: cwd+'/'+item.name,
                  file: item
               });
            }
         }
         if(index == dirList.length-1){
            sftpHelper.removeFolderFromAliasCWD(indexOfAliasCWD);
         }
      })
      
      
      let temp = sftpHelper.getCWD();
      return {folders: searchResultFolders, files: searchResultFiles};
   } else {
      console.warn("Given data to getFiles function is not array, therefore it is not supported");
   }
}

let renderBreadCrumbs = async()=>{
   let   cwdArray = [],
         breadCrumbsHTML = '';
   
   
   cwdArray = sftpHelper.getCWDasArray();

   breadCrumbsHTML = breadCrumbsHTML.concat('<a class="breadCrumbsClick" name="'+cwdArray[0]+'"><span class="folderName">'+localStorage.getItem("DISPLAY_NAME")+'</span></a>');
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
   
   // Show the generated elements
   fileList.animate({'display':'inline-block'});
};

let renderSearchResult = async(searchResult)=>{
   await asyncForEach(searchResult.folders, async (item, index) => {
      let foldersHTML = await parsingHelper.getFolderHTML(item.folder, item.path, false);
      fileList.append(foldersHTML);
   })
   await asyncForEach(searchResult.files, async (item, index) => {
      let filesHTML = await parsingHelper.getFileHTML(item.file, item.path, false);
      fileList.append(filesHTML);
   })
};

function getUrlVars() {
   var vars = {};
   var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
       vars[key] = value;
   });
   return vars;
}

$(async ()=>{
   let uid = getUrlVars()["uid"];
   let displayName = getUrlVars()["displayname"];
   //setting env consts
   localStorage.setItem("UID", uid);
   localStorage.setItem("DISPLAY_NAME", displayName);
   //setup page
   let rootDir = "./"+uid;
   let dirList = await sftpHelper.getDirList(rootDir);
   sftpHelper.addFolderToCWD(uid);
   await renderDirectories(dirList);
   await activateFolderClick();
   renderBreadCrumbs();
   activateFind();
   fileList.addClass("animated");
});