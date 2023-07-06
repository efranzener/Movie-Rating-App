import SignUp from "./Signup";
import Login from "./Login";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import GoogleSignup from "./GoogleSignup.jsx";
import { AuthContext } from "../context/Context";


function Homepage() {
  const [showActive, setShowActive] = useState("login");
  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();
  
  return (
      <>
    {currentUser ?
      navigate("/dashboard") :
        <div id="homepage">
          {showActive === "login" ? (
            <section id="loginSec">
              <Login />

              <div id="signup">
                <p>Don't have an account?</p>
                <button
                  className="formsbutton"
                  onClick={() => setShowActive("signup")}
                >
                  Sign Up{" "}
                </button>
                <p>OR</p>
              </div>
              <GoogleSignup />
            </section>
          ) : (
            <section id="signupSec">
              <SignUp />
              <div id="login">
                <p>Have an account? </p>
                <button
                  className="formsbutton"
                  onClick={() => setShowActive("login")}
                >
                  Sign In
                </button>
              </div>
            </section>
          )}
        </div> 
         
        } </>

  );
}

export default Homepage;
