import { useState, useRef, useEffect } from "react";
import { faCheck, faXmark,faCircleInfo, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Login from "./Login";

const nameRegex = /^[a-zA-Z]{3,15}$/;
const emailRegex = /^[a-zA-Z]*[\w-.]+@([\w]+.)+[\w]{3,30}/;
const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,20}$/;

const SignUp = () => {
    const nameRef = useRef();
    const errRef = useRef();

    const [name, setName] = useState("");
    const [validName, setValidName] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState(false);

    const [showPwd, setShowPwd] = useState(false)

    useEffect(() => {
    nameRef.current.focus();
    }, []);

    useEffect(() => {
    const nameInput = nameRegex.test(name);
    setValidName(nameInput);
    }, [name]);

    useEffect(() => {
    const emailInput = emailRegex.test(email);
    setValidEmail(emailInput);
    }, [email]);

    useEffect(() => {
    const pwdInput = pwdRegex.test(pwd);
    setValidPwd(pwdInput);
    }, [pwd]);

    useEffect(() => {
    setErrMsg("");
    }, [name, email, pwd]);


    const handleShowPwd = (e) => {

        if (pwd !== ""){
            setShowPwd(showPwd? false: true)
        }
    }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const checkName = nameRegex.test(name);
    const checkEmail = emailRegex.test(email);
    const checkPwd = pwdRegex.test(pwd);

    if (!checkName || !checkEmail || !checkPwd) {
      setErrMsg("Please make sure all fields are filled");
      return;
    }
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, pwd }),
      });

      if (response.status === 201) {
        setSuccessMsg(true);
        setName("");
        setEmail("");
        setPwd("");
        setShowPwd(false);
      } else if (response.status === 409) {
        setErrMsg(
          "Cannot create an account with that email, please try again with a different email address."
        );
      } else if (response.status === 500) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Registration Failed");
      }
    } catch (err) {
      console.log("err", err);
      errRef.current.focus();
    }
  };
  return (
    <>
        
        {successMsg ? 
        <><p className="successAlert">
                Account successfully created. Please log in
            </p><Login /></>
      : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errMsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
            <form onSubmit={handleSubmit} id="signupForm">
                <h3 className="formTitle"> Sign Up </h3>
                <label htmlFor="name" className="signupLabels">
                Name
                <span className={validName ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validName || !name ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faXmark} />
                </span>
                    <div className="inputWrapper">

                        <input
                        ref={nameRef}
                        type="text"
                        name="name"
                        id="name"
                        onChange={(e) => setName(e.target.value)}
                        aria-invalid={validName ? "false" : "true"}
                        aria-describedby="uidnote"
                        onFocus={() => setNameFocus(true)}
                        onBlur={() => setNameFocus(false)}
                        required
                        ></input>
                    </div>
                </label>

                <p
                id="namenote"
                className={
                    nameFocus && name && !validName ? "instructions" : "offscreen"
                }
                >
                <FontAwesomeIcon icon={faCircleInfo} />
                3 to 15 characters.
                <br />
                Only letters allowed.
                </p>
                <label htmlFor="email" className="signupLabels">
                Email
                <span className={validEmail ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validEmail || !email ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faXmark} />
                </span>
                <input
                autoComplete="off"
                type="email"
                name="email"
                id="email"
                placeholder="user@test.com"
                
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={validEmail ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                required
                >
                
                </input>
                </label>

                <p
                id="emailnote"
                className={
                    emailFocus && email && !validEmail
                    ? "instructions"
                    : "offscreen"
                }
                >
                <FontAwesomeIcon icon={faCircleInfo} size="sm"/>
                Make sure you are using a valid email address format.
                </p>
                <label htmlFor="pwd">
                Password

                    <span className={validPwd ? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} size="sm"/>
                    </span>
                    <span className={validPwd || !pwd ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faXmark} />
                    </span>
                    <div className="inputWrapper">
                        <input
                        autoComplete="off"
                        id="pwd"
                        type={!showPwd? "password": "text"}
                        name="pwd"
                        onChange={(e) => setPwd(e.target.value)}
                        aria-invalid={validPwd ? "false" : "true"}
                        aria-describedby="uidnote"
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                        required
                        ></input>
                        {pwd === ""? 
                        <FontAwesomeIcon className="showPwd"  icon={faEye}/>  
                        : 
                        <FontAwesomeIcon  onClick={handleShowPwd}
                        className="showPwd" icon={!showPwd === true ? faEye : faEyeSlash} />
                        } 
                    </div>
                </label>
                <p
                id="pwdnote"
                className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
                >
                <FontAwesomeIcon icon={faCircleInfo} />
                8-20 characters <br />
                Must include an uppercase and lowercase letter, a number and a
                special character.
                <br />
                Allowed special characters: <br />
                <span aria-label="exclamation">!</span>
                <span aria-label="at sign">@</span>
                <span aria-label="hashtag">#</span>
                <span aria-label="dollar sign">$</span>
                <span aria-label="percent">%</span>
                <span aria-label="ampersand">&</span>
                <span aria-label="caret">^</span>
                <span aria-label="asterisk">*</span>
                </p>
                <button className = "formsbutton" type="submit">Submit</button>
            </form>
           
        </section>
      )}
    </>
  );
};

// window.addEventListener(
//   "message",
//   (event) => {
//     if (event.origin != "https://www.pinterest.com") {
//       return;
//     }
//     try {
//       if (event.data.key == "_epik_localstore") {
//         window.localStorage.setItem(event.data.key, event.data.value);
//       }
//     } catch (error) {}
//   },
//   false
// );
// window.addEventListener(
//   "load",
//   (event) => {
//     try {
//       window.parent.postMessage(
//         {
//           key: "_epik_localstore",
//           value: window.localStorage.getItem("_epik_localstore"),
//         },
//         "*"
//       );
//     } catch (error) {}
//   },
//   false
// );

export default SignUp;
