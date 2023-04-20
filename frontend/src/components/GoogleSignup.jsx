import { useEffect } from "react";


const GoogleSignup =  () => {


    function handleCredentialResponse(response) {
        console.log("Encoded JWT ID token: " + response.credential);
      }


      useEffect(() => {
        /*global google */
        google.accounts.id.initialize({
          client_id:"682787900913-7nno6c3kn26hrub4q0c8l585bj5tehks.apps.googleusercontent.com" ,
          callback: handleCredentialResponse
        });
        google.accounts.id.renderButton(
          document.getElementById("buttonDiv"),
          { theme: "outline", size: "large" }  // customization attributes
        );
        google.accounts.id.prompt(); // also display the One Tap dialog
      }, []);
      return (
            <div id="buttonDiv"></div>
        )

}


export default GoogleSignup;