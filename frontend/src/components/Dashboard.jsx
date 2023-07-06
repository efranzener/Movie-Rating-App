import React, { useContext } from "react";
// import AuthProvider from "../context/Provider";
import { AuthContext } from "../context/Context";
// import { AllMovies } from "../components/AllMovies";
import Homepage from "./Homepage";







const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  
  console.log ("this is the current user in dashboard", currentUser)
  return (
    <>
      {currentUser ?
      <div>
        <h1> Hello {currentUser.name}</h1>
        {/* <AllMovies/> */}
      </div>
      :
      <div>
        {<Homepage/>}
      </div>
      }
    </>
  );
};

export default Dashboard;
