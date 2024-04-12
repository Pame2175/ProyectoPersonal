import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MoviesList = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/movie', {
          withCredentials: true
        });
        setMovies(response.data.movies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, []);

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return '0'; // Retorna '0' si no hay reseñas
    const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = totalRating / reviews.length;
    return Number(averageRating.toFixed(2)).toString(); 
  };

  return (
    <div>
      <h1>Listado de Películas</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre de la película</th>
            <th>Rating Promedio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie._id}>
              <td>{movie.title}</td>
              <td>{calculateAverageRating(movie.reviews)}</td>
              <td>
              <Link to={`/movies/seereview/${movie._id}`} className='btn btn-outline-primary me-2'>Ver reseñas</Link>
              <Link to={`/movies/addreview/${movie._id}`} className='btn btn-outline-success '>Agregar reseña</Link>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MoviesList;
