
import { AuthContext } from "../context/Context";
import { useContext, useState, useEffect } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";




const AllMovies  = () => {


    const [ allMovies, setAllMovies ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        const getAllMovies = async () => {
            try{
                const url = "/allmovies"
                const response = await fetch(url);
                const responseJson = await response.json();
                
                

                const moviesList = responseJson.map(movie => console.log("movie title text", movie.title)
                    );
                
                
                setAllMovies(responseJson);
                setLoading(false);
                
                // console.log("all", AllMovies);
                // return allMovies
                } catch (error) {
                    console.log("error", error);
                    setLoading(false);
                }
        };
        getAllMovies();
    }, []);


    if (loading) {
        console.log("loading...")
        return <div> loading...</div>
    }
    if (!allMovies) {
        console.log("error")
        return <div>error occured</div>
    }
    
    return (
        <div className="row row-cols-1 row-cols-md-4 g-4">
            {allMovies.map(movie =>  (
                <div className="col">
                        <div className="card h-100">
                            <img className="card-img-top" src={movie.poster_path} alt='movie' />
                            <div className="card-body">
                                <h5 className="card-title">{movie.title}</h5>
                                {/* <p class="card-text">{movie.overview}</p> */}
                            </div>
                            <div className="card-footer">
                                <small className="text-body-secondary">Released on {movie.release_date}</small>
                            </div>
                            <div className='overlay'>
                                <p class="card-text">{movie.overview}</p>
                            </div>
                        </div>
                </div>))
            }
            
            
                
        </div>   
)
}


export default AllMovies;


