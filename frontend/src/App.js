import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import SharedLayout from "./components/SharedLayout";
import Homepage from "./components/Homepage";
import AllMovies from "./components/AllMovies";
import Login from "./components/Login";

function App() {
  // const [user, setUser] = useState(null);
  return (
    <BrowserRouter>
      <Routes className="App">
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<Homepage />} />
            {/* <Login /> */}
            <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/AllMovies" element={<AllMovies/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
