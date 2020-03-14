let $ = require("jquery");

$("#signUpForm").submit(function( event ) {
   event.preventDefault();

   let displayName = $("#displayName");
   let email = $("#email");
   let password = $("#password");
   let submitBtn = $("#submitBtn");

   displayName.prop("disabled", true);
   email.prop("disabled", true);
   password.prop("disabled", true);
   submitBtn.prop("disabled", true);

   let json = {
      displayName: displayName.val(),
      email: email.val(),
      password: password.val()
   };

   $.post("https://us-central1-cloud-storage-app-dev-tech.cloudfunctions.net/signUp", json, (data, status)=>{
      if(status == "success"){
         displayName.val("");
         email.val("");
         password.val("");
         alert("Successfully registed. Lets log in now!");
         location.href = "./login.html";
      }
   })
   .fail((err)=>{
      alert("Error: " + err + ". Lets try again.");
      location.reload();
   });
});

$("#logInForm").submit(function( event ) {
   event.preventDefault();

   let email = $("#email");
   let password = $("#password");
   let submitBtn = $("#submitBtn");

   email.prop("disabled", true);
   password.prop("disabled", true);
   submitBtn.prop("disabled", true);

   let json = {
      email: email.val(),
      password: password.val()
   };

   $.post("https://us-central1-cloud-storage-app-dev-tech.cloudfunctions.net/logIn", json, (data, status)=>{
      if(status == "success"){
         email.val("");
         password.val("");
         location.href = "./file-explorer.html?uid="+data.uid+"&displayname="+data.displayName;
      }
   })
   .fail((err)=>{
      alert("Error: " + err + ". Lets try again.");
      location.reload();
   });
});