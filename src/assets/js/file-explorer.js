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
      activateRightClicks();
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
      activateRightClicks();
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
   
   filemanager.find('#search-box').on('input', async(e)=>{
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
            await renderSearchResult(searchResult);
            activateRightClicks();
			}
      } else {
         fileList.removeClass('animated');
         fileList.empty();
         sftpHelper.emptyAliasCWD();
         let cwd = sftpHelper.getCWD();
         let dirList = await sftpHelper.getDirList(cwd);
         filemanager.find('.nothingfound').hide();
         fileList.show();
         await renderDirectories(dirList);
         activateRightClicks();
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

function activateRightClicks() {
   $(document).bind("contextmenu",function(e){
      e.preventDefault();
      if(e.target.tagName == "HTML" || e.target.tagName == "BODY" || e.target.tagName == "UL") {
         $("#files-right-click-menu").hide();
         $("#folders-right-click-menu").hide();
         $("#general-right-click-menu").css("left",e.pageX);
         $("#general-right-click-menu").css("top",e.pageY);       
         $("#general-right-click-menu").fadeIn(200,startFocusOut());      
      }
   });

   $("a.files").bind("contextmenu",function(e){
      $("#general-right-click-menu").hide();
      $("#folders-right-click-menu").hide();
      $("#files-right-click-menu").css("left",e.pageX);
      $("#files-right-click-menu").css("top",e.pageY);
      $("#files-right-click-menu").fadeIn(200,startFocusOut()); 
   });
   
   $("a.folders").bind("contextmenu",function(e){
      $("#general-right-click-menu").hide();
      $("#files-right-click-menu").hide();
      $("#folders-right-click-menu").css("left",e.pageX);
      $("#folders-right-click-menu").css("top",e.pageY);
      $("#folders-right-click-menu").fadeIn(200,startFocusOut());
   });
}


 
function startFocusOut(){
   $(document).on("click",function(){
      $("#general-right-click-menu").hide();
      $("#files-right-click-menu").hide();
      $("#folders-right-click-menu").hide();      
      $(document).off("click");
   });
}

let handleFileSelect = async (e)=>{
   let files = e.target.files;
   if (files.length < 1) {
       alert('select a file...');
       return;
   }
   let filesObj = [];
   for(let i=0; i<files.length; i++){
      filesObj.push(files[i]);
   }
   await asyncForEach(filesObj, async (fileObj, index) => {
      await sftpHelper.uploadFile(fileObj.path, sftpHelper.getCWD().concat('/', fileObj.name));
   });
   let path = sftpHelper.getCWD();
   fileList.empty();
   fileList.removeClass('animated');
   let newDirList = await sftpHelper.getDirList(path);
   await renderDirectories(newDirList);
   renderBreadCrumbs();
   activateRightClicks();
}

// not completed 
let handleFolderSelect = async (e) => {
   alert("The folder is not uploaded. This functionality will be supported soon!")
   // console.log("Inside HandleFolderSelect")
   // console.log(e);
   // let remotePath = sftpHelper.getCWD().concat('/',e.target.files[0].webkitRelativePath.substring(0,e.target.files[0].webkitRelativePath.indexOf('/')));
   // console.log(remotePath);
   // let localPath = e.target.files[0].path.split('\\');
   // let localPathStr = '';
   // console.log(localPath);
   // localPath.splice(localPath.length-1);
   // localPath.forEach((folderName)=>{
   //    localPathStr = localPathStr.concat("/", folderName);
   // });
   // console.log(localPathStr.substring(1))
   // await sftpHelper.uploadFolder(localPathStr.substring(1), remotePath);
   // let path = sftpHelper.getCWD();
   // fileList.empty();
   // fileList.removeClass('animated');
   // let newDirList = await sftpHelper.getDirList(path);
   // await renderDirectories(newDirList);
   // renderBreadCrumbs();
   // activateRightClicks();
}

// create new folder
let handleCreateNewFolder = async() => {
   alert("Not quite done! Tune in for more!")
   // const folderName = $('#newFolderInput').val();
   // await sftpHelper.makeDirInCurrentCWD(folderName);
   // let path = sftpHelper.getCWD();
   // console.log("PAth: ", path);
   // fileList.empty();
   // fileList.removeClass('animated');
   // let newDirList = await sftpHelper.getDirList(path);
   // await renderDirectories(newDirList);
   // renderBreadCrumbs();
   // activateRightClicks();
   // $('#newFolderInput').val(' ');
}

$("#general-right-click-menu > .items > li").click(function(){
   switch($(this).attr("id")) {
      case "new-folder":
         const newFolderModal = $("#newFolderModal");
         newFolderModal.modal('toggle');
         newFolderModal.on('click', '#createNewFolderBtn', async(e)=>{
            newFolderModal.modal("hide");
            await handleCreateNewFolder();
         })
         break;
      case "upload-files":
         const uploadFileModalConfirmation = $("#uploadFileModalConfirmation");
         uploadFileModalConfirmation.modal('toggle');
         uploadFileModalConfirmation.on('click', '#uploadFileModalConfirmedBtn', (e)=> {
            uploadFileModalConfirmation.modal("hide");
            uploadFileModalConfirmation.on("hidden.bs.modal", ()=> {
               $('#file-input').click();
            })
         })
         break;
      case "upload-folder":
         // below code should be uncommented when uploading folder functionality is completed 
         const uploadFolderModalConfirmation = $("#uploadFolderModalConfirmation");
         uploadFolderModalConfirmation.modal('toggle');
         uploadFolderModalConfirmation.on('click', '#uploadFolderModalConfirmedBtn', (e)=> {
            uploadFolderModalConfirmation.modal("hide");
            $('#folder-input').click();
            // uploadFolderModalConfirmation.on("hidden.bs.modal", ()=> {
            //    $('#folder-input').click();
            // })
         })
         break;
   }
});

$("#folders-right-click-menu > .items > li").click(function(){
   switch($(this).attr("id")) {
      case "share-file":
         break;
      case "get-shareble-link":
         break;
      case "move-to":
         break;
      case "add-to-starred":
         break;
      case "rename":
         break;
      case "view-details":
         break;
      case "download":
         break;
      case "remove":
         const removeFolderConfirmationModal = $("#removeFolderConfirmationModal");
         removeFolderConfirmationModal.modal('toggle');
         removeFolderConfirmationModal.on('click', '#removeFolderConfirmationModalBtn', (e)=> {
            console.log(e);
         })
         break;
   }
});

$("#files-right-click-menu > .items > li").click(function(){
   switch($(this).attr("id")) {
      case "share-file":
         break;
      case "get-shareble-link":
         break;
      case "show-file-location":
         break;
      case "move-to":
         break;
      case "add-to-starred":
         break;
      case "rename":
         break;
      case "view-details":
         break;
      case "download":
         break;
      case "manage-versions":
         break;
      case "make-a-copy":
         break;
      case "remove":
         break;
   }
});

let dropHandler = async(ev)=>{
   // Prevent default behavior (Prevent file from being opened)
   ev.preventDefault();
   let filesObj = [];
   if (ev.dataTransfer.items) {
     // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
         // If dropped items aren't files, reject them
         if (ev.dataTransfer.items[i].kind === 'file') {
            var file = ev.dataTransfer.items[i].getAsFile();
            filesObj.push(file);
         }
      }
      await asyncForEach(filesObj, async (fileObj, index) => {
         await sftpHelper.uploadFile(fileObj.path, sftpHelper.getCWD().concat('/', fileObj.name));
      });
      let path = sftpHelper.getCWD();
      fileList.empty();
      fileList.removeClass('animated');
      let newDirList = await sftpHelper.getDirList(path);
      await renderDirectories(newDirList);
      renderBreadCrumbs();
      activateRightClicks();
   } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {
         console.log(ev.dataTransfer.files[i].location);
      }
   }
 }

function dragOverHandler(ev) {
   // Prevent default behavior (Prevent file from being opened)
   ev.preventDefault();
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
   activateRightClicks();
   fileList.addClass("animated");

   //Assign right click event helpers
   $('#file-input').change(handleFileSelect);
   // below code should be uncommented when uploading folder functionality is completed 
   $("#folder-input").change(handleFolderSelect);
});