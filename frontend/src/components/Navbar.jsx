import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/Context";


  
const Navbar = () => {

  const { currentUser, setCurrUser } = useContext(UserContext);
  const navigate = useNavigate();
  console.log("user", currentUser)
  const LogoutButton = async (e) => {

    
    const response = await fetch ("/logout", {
        method: "POST", 
        headers: {"Content-Type": "application/json"
        },
        body: JSON.stringify({currentUser}),
        })
        ;
       
    console.log("response",response)
    if (response.ok) {
        console.log("response ok", response.data)
        setCurrUser(null)
        navigate("/")
      
    }
      else {
      
      console.log("current response", response)
      }

  }
        
  return (
    <section>

      <nav className="navbar">
        <NavLink
          to="/"
          className={({ isActive, notActive }) =>
            isActive ? "isActive" : notActive ? "notActive" : ""
          }
        end >
          Home
        </NavLink>
        <NavLink
          to="/AllMovies"
          className={({ isActive, notActive }) =>
            isActive ? "isActive" : notActive ? "notActive" : "" 
          }
        >
          All Movies|Shows
        </NavLink>
          {currentUser?
          (<NavLink onClick={LogoutButton}
          >
            Logout
          </NavLink>
          ):(
            ""
          )}
      </nav>
    </section>
  );
}


export default Navbar;
