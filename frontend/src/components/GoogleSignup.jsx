import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/Context";
import { useNavigate } from "react-router-dom";

const GoogleSignup = () => {
  const { setCurrUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleCredentialResponse = (response) => {
    console.log("this is the  jwt google", response)
    fetch("/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${response.credential}`,
      },
      body: JSON.stringify(response),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((userJson) => {
        console.log("current response", userJson)
        setCurrUser(userJson.user);
        console.log("current user", userJson.user)
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Error:", error);
        console.error("Network error:", error.message);
      });
  }

  useEffect(() => {
    // global google 

    const google = window.google;

    google.accounts.id.initialize({
      client_id: "682787900913-7nno6c3kn26hrub4q0c8l585bj5tehks.apps.googleusercontent.com",
      callback: handleCredentialResponse,
      
    });
    google.accounts.id.renderButton(
      document.getElementById("googleSignup"),
      { theme: "filled_blue", size: "large", width: 260 } // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
  }, []);

  return <div id="googleSignup"></div>;
};

export default GoogleSignup;
