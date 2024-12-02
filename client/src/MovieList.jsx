import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MoviesList = () => {
    const [movies, setMovies] = useState([]); // All movies
    const [searchTerm, setSearchTerm] = useState(''); // User's search input
    const [filteredMovies, setFilteredMovies] = useState([]); // Filtered movie list
    const [newMovieTitle, setNewMovieTitle] = useState(''); //new movie


    // Fetch movies from the server
    useEffect(() => {
        axios.get('http://localhost:5000/movies')
            .then(response => {
                setMovies(response.data);
                setFilteredMovies(response.data); // Initialize with all movies
            })
            .catch(error => console.error('Error fetching movies:', error));
    }, []);

    // Handle search input changes
    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase(); // Case-insensitive search
        setSearchTerm(term);

        axios.get(`http://localhost:5000/movies/search?q=${term}`)
        .then(response => setFilteredMovies(response.data))
        .catch(error => console.error('Error searching movies:', error));

        // Filter movies based on the search term
        const filtered = movies.filter(movie =>
            movie.title.toLowerCase().includes(term)
        );
        setFilteredMovies(filtered);
    };

    const handleAddMovie = () => {
        if (!newMovieTitle.trim()) {
            alert('Please enter a movie title');
            return;
        }
    
        axios.post('http://localhost:5000/movies', { title: newMovieTitle })
            .then(response => {
                setMovies([...movies, response.data]); // Update movie list
                setFilteredMovies([...filteredMovies, response.data]); // Update filtered list
                setNewMovieTitle(''); // Clear input
            })
            .catch(error => console.error('Error adding movie:', error));
    };
    
    const handleDeleteMovie = (id) => {
        axios.delete(`http://localhost:5000/movies/${id}`)
            .then(() => {
                // Update both movie and filtered lists
                const updatedMovies = movies.filter(movie => movie.id !== id);
                setMovies(updatedMovies);
                setFilteredMovies(updatedMovies);
            })
            .catch(error => console.error('Error deleting movie:', error));
    };
    
    
    return (
        <div>
            <h1>Movie List</h1>
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search for a movie..."
                value={searchTerm}
                onChange={handleSearch}
            />
            <ul>
                {filteredMovies.map(movie => (
                    <li key={movie.id}>{movie.title}</li>
                ))}
            </ul>
            <input
        type="text"
        placeholder="Add a new movie..."
        value={newMovieTitle}
        onChange={(e) => setNewMovieTitle(e.target.value)}
    />
    <button onClick={handleAddMovie}>Add Movie</button>
    <ul>
    {filteredMovies.map(movie => (
        <li key={movie.id}>
            {movie.title}
            <button onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
        </li>
    ))}
</ul>

        </div>
    );
};


export default MoviesList;
