
import { useState } from "react";
import  { AuthContext }  from "./Context";

const AuthProvider = ({ children }) =>  {

    const GetCurrUser = () => {

        const currUser = localStorage.getItem("currentUser");
        console.log("currUser", currUser)
        console.log("currUser type", typeof(currUser))
        return currUser ? currUser : null
    }

   
    const [currentUser, setCurrUser] = useState(GetCurrUser);

    return(
        <AuthContext.Provider value={{currentUser, setCurrUser}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;