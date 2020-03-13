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
         alert("Successfully registed. Lets log in now!");
         location.href = "./login.html";
      }
   })
   .fail((err)=>{
      alert("Error: " + err + ". Lets try again.");
      location.reload();
   });
});