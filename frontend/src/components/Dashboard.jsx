import React,  { useContext } from "react";
// import AuthProvider from "../context/Provider";
import { UserContext } from "../context/Context";


const Dashboard = () => {

    const { currentUser } = useContext(UserContext)

    return (
        
        <>
            <h1> Hello {currentUser.name}</h1>


        </>
        
        
        );
};


export default Dashboard;