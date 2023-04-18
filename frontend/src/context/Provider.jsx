
import { useState } from "react";
import  { UserContext }  from "./Context";

function AuthProvider ({ children }) {

    const [currentUser, setCurrUser] = useState(null);

    return(
        <UserContext.Provider value={{currentUser, setCurrUser}}>
            {children}
        </UserContext.Provider>
    )
}

export default AuthProvider;