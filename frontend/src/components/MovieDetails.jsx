import { useState } from "react";

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const AllMovies  = () => {



    const { allMovies, setAllMovies } = useState([{}])
    const [loading, setLoading] = useState(true)
    

    const getAllMovies = async () => {
        const url = "/allmovies"
        const response = await fetch(url);
        const responseJson = await response.json();

        console.log(responseJson)
    
    }
    
return (
        <>  
        <div className = "searchWrapper">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <input placeholder="Search for a movie or show"></input>

            <button onClick={getAllMovies}>All Movies</button>
        </div>


        </>

)
}


export default AllMovies;