import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import UserContext from '../context/UserContext';
import { useContext } from "react";

const SeeReviews = () => {
  const navigate = useNavigate();
    // Obtener el contexto del usuario
    const { user } = useContext(UserContext);
  const { movieId } = useParams();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/movie/${movieId}`);
        setReviews(response.data.movie.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, [movieId]);

  const handleDeleteReview = async (reviewId, reviewerName) => {
    const confirmed = await confirmDelete('esta reseña');
    if (confirmed) {
      try {
        // Compara el nombre del revisor de la reseña con el nombre del usuario logeado
        if (reviewerName === user.firstName) {
          // Si los nombres coinciden, procede con la eliminación de la reseña
          await axios.delete(`http://localhost:8000/api/movie/${movieId}/reviews/${reviewId}`, { withCredentials: true });
          setReviews(reviews.filter(review => review._id !== reviewId));
          Swal.fire(
            '¡Eliminada!',
            'La reseña ha sido eliminada correctamente.',
            'success'
          );
        } else {
          // Si los nombres no coinciden, muestra un mensaje de error
          Swal.fire(
            'Error',
            'No tienes permiso para eliminar esta reseña.',
            'error'
          );
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        Swal.fire(
          'Error',
          'Ocurrió un error al eliminar la reseña.',
          'error'
        );
      }
    }
  };

  const handleDeleteMovie = async () => {
    const confirmed = await confirmDelete('esta película');
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/movie/${movieId}`, { withCredentials: true });
        Swal.fire(
          '¡Eliminada!',
          'La película ha sido eliminada correctamente.',
          'success'
        ).then(() => {
          // Redireccionar a la página de películas después de eliminar la película
          window.location.href = '/movies/list';
        });
      } catch (error) {
        console.error('Error deleting movie:', error);
        Swal.fire(
          'Error',
          'Ocurrió un error al eliminar la película.',
          'error'
        );
      }
    }
  };

  const confirmDelete = async (itemName) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `No podrás revertir la acción de eliminar ${itemName}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Sí, eliminar ${itemName}`
    });
    return result.isConfirmed;
  };

  return (
    <div>
      <h1>Reseñas de la Película</h1>
      {reviews.length > 0 ? (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Revisor</th>
                <th>Rating</th>
                <th>Reseña</th>
                <th>Acciones</th> {/* Agregamos una nueva columna para acciones */}
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id}>
                  <td>{review.reviewerName}</td>
                  <td>{review.rating}</td>
                  <td>{review.reviewText}</td>
                  <td>
                    {/* Agregamos el botón de eliminar reseña */}
                    <button onClick={() => handleDeleteReview(review._id, review.reviewerName)} className="btn btn-danger">Eliminar Reseña</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleDeleteMovie} className="btn btn-danger me-2">Eliminar Película</button>
          <Link to="/movies/list" className="btn btn-secondary">Volver a la lista de películas</Link>
        </>
      ) : (
        <p>No hay reseñas disponibles</p>
      )}
    </div>
  );
};

export default SeeReviews;
