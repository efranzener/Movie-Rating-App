
import SignUp from "./Signup";
import Login from "./Login";
import { useState } from "react";
import GoogleSignup from "./GoogleSignup.jsx"


function Homepage() {

    const [ showActive, setShowActive ] = useState("login")

    return (
        <div id="homepage">
          {showActive === "login"?
            (<section id="loginSec" >

                <Login/>
                
                <div id="signup">
                    <p>Don't have an account yet?</p>
                    <button className = "formsbutton" onClick={(() => setShowActive("signup"))}>Sign Up </button>
                    <p>OR</p>
                </div>
                <GoogleSignup/>
            </section>) :
        
          
           <section id="signupSec">
                <SignUp/>
                <div id="login">
                    <p>Already have an account? </p>
                    <button className = "formsbutton" onClick={(() => setShowActive("login"))}>Sign In</button>
                </div>
            </section>
           }
        
        </div>
        )
}

export default Homepage;