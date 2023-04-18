import { Outlet } from "react-router-dom";
import Navbar  from "./Navbar";

const SharedLayout = () => {

    return (
        <main className="App">
            <Navbar/>
            <Outlet />
        </main>
        
        )

}

export default SharedLayout;