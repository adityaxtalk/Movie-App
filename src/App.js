import React,{useState, useEffect, useCallback} from 'react';
import './App.css';
import MovieList from './components/MovieList';
import AddMovie from './components/AddMovie';

function App() {

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading]= useState(false);
  const [error, setError] = useState(false);
   const fetchMoviesHandler = useCallback(async ()=>{
      setIsLoading(true);
      setError(null);
      try {
        const response= await fetch('https://my-data-api-8a0f5-default-rtdb.firebaseio.com/movies.json');
        if (!response.ok) {
          throw new Error('Something went wrong!');
        }

        const data=await response.json();
        const loadedMovies=[];
        for (const key in data) {
          loadedMovies.push({
            id: key,
            title: data[key].title,
            openingText: data[key].openingText,
            releaseDate: data[key].releaseDate
          });
        }
        const transformedMovies= loadedMovies.map((movieData)=>{
          return {
            id: movieData.id,
            title: movieData.title,
            openingText: movieData.openingText,
            releaseDate: movieData.releaseDate
          }
        });
        setMovies(transformedMovies);
      } catch(error) {
        setError(error.message);
      }
      setIsLoading(false);
   }, []);

   useEffect(()=>{
    fetchMoviesHandler();
   }, [fetchMoviesHandler]);
   
   async function addMovieHandler(movie) {
    const response= await fetch('https://my-data-api-8a0f5-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data=await response.json();
    console.log(data);
   }

   let content=<p>Found no movies.</p>
   if (movies.length>0) {
    content=<MovieList movies={movies} />
   }

   if (error) {
    content=<p>{error}</p>
   }

   if (isLoading) {
    content='...loading'
   }
  return (
    <>
    <section>
      <AddMovie onAddMovie={addMovieHandler} />
    </section>
    <section>
      <button onClick={fetchMoviesHandler}>Fetch Movies</button>
    </section>
    <section>{content}</section>
    </>
  );
}

export default App;
