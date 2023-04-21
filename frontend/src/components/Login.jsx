
import { useState, useRef, useEffect, useContext} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext }  from "../context/Context.js";
import GoogleSignup from "./GoogleSignup.jsx"

import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const Login = () => {

    const { currentUser, setCurrUser } = useContext(UserContext);
    const navigate = useNavigate();
    // const location = useLocation();
    // const from = location.state?.from?.pathname || "/";

    const emailRef = useRef();
    const errRef = useRef();

    const [emailLogin, setEmailLogin] = useState("");
    const [pwdLogin, setPwdLogin] = useState("");
    const [errMsg, setErrMsg] = useState("");
    
    const [showPwd, setShowPwd] = useState(false)

  
    useEffect(() => {
        emailRef.current.focus();
    }, []);

    useEffect (() => {
        setErrMsg("");
    }, [emailLogin, pwdLogin]);


    const handleShowPwd = () => {
        if (pwdLogin.valueOf === ""){
        setShowPwd(false)
        } else {
        setShowPwd(showPwd? false : true)
        }
        console.log("show pwd", showPwd)
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
       
            try {
                const response = await fetch('/login', {
                    method: "POST", 
                    headers: {"Content-Type": "application/json"
                    },
                    body: JSON.stringify({email: emailLogin, password: pwdLogin}),
                    }
                    );
                    
                if (response.status === 200){
                    const userJson = await response.json()
                    // setCurrUser({name: userJson.name, email: userJson.email, password: userJson.password})
                    setCurrUser(userJson)
                    setEmailLogin("");
                    setPwdLogin("");
                    console.log ("this is the setAuth", currentUser);
                    console.log ("this is the userJson", userJson);
                    navigate("/dashboard")
                } else if (response.status === 401) {
                    throw Error("Please verify your email and password and try again")

                } else {

                    throw new Error("Login failed, please try again")
                }

            } catch (err) {
                
                setErrMsg(err.message)
                console.log("err inside catch", err.message)
            }
        

    }
    
    return (
        <>
        
                <section id="loginSec">
                    <p ref={errRef} 
                    className={errMsg ? "errMsg" : "offScreen"} 
                    aria-live="assertive">{errMsg}
                    </p>
                    <form method="post" onSubmit={handleSubmit} id="loginForm">
                        <h3 className="formTitle"> LOGIN</h3>

                        <label htmlFor="emailLogin">
                            Email
                            <input 
                            ref={emailRef} 
                            autoComplete="off"   
                            type="text" 
                            id="emailLogin" 
                            value={emailLogin} 
                            onChange={(e) => setEmailLogin(e.target.value)}
                            name="emailLogin"
                            required
                            />
                        </label>
                        <label htmlFor="pwdLogin">
                        Password
                            <div className="inputWrapper">
                                <input 
                                autoComplete="off"
                                id="pwdLogin"
                                type={!showPwd? "password" : "text"}
                                value={pwdLogin} 
                                onChange={(e) => setPwdLogin(e.target.value)}
                                name="pwdLogin"
                                required
                                />
                                <FontAwesomeIcon className={!showPwd? "showPwd" : "hide" } onClick={handleShowPwd}  icon={faEye}/>   
                                <FontAwesomeIcon  onClick={handleShowPwd} className={showPwd? "showPwd" : "hide" } icon={faEyeSlash} />
                        
                            </div>
                        </label>
                        <button type="submit">Login</button>
                        <p>
                            Don't have an account yet? 
                            <span>
                                <a href="#signupSec">Sign Up</a>
                            </span>
                            <br></br>
                            <br></br>
                            <span>OR</span>
                        </p>
                        <GoogleSignup/>
                    </form>
            
                </section>
            
        
        </>
        )
}


export default Login;