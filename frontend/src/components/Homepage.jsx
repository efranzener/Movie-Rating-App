import { useState } from "react";

import SignUp from "./Signup";



function Login(){

    const [loginForm, setLoginForm] = useState({
        usernameLogin:"",
        passwordLogin:""
        })

    function handleLoginChange (e) {

        const value= e.target.value
        setLoginForm({
        ...loginForm, [e.target.name]: value})
    }
    
    

        
    return (
        <>

            <form method="post" >
                <p> LOGIN</p>
                <label>
                    Username
                    <input type="text" name="usernameLogin" value={loginForm.usernameLogin} onChange={handleLoginChange}/>
                </label>
                <label>
                    Password
                    <input type="password" name="passwordLogin" value={loginForm.passwordLogin} onChange={handleLoginChange}/>
                </label>
                <button type="submit">Submit</button>
            </form>
        </>
        )
}

function Homepage() {
    

    return (
        <div >
            <SignUp/>
            <div></div>
            <Login/>
        </div>
        )
}

export default Homepage;