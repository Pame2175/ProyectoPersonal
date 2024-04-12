import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import UserContext from '../context/UserContext';
import { useContext } from "react";



const AddReview = () => {
    const { movieId } = useParams();
    const navigate = useNavigate();
    // Obtener el contexto del usuario
    const { user } = useContext(UserContext);
  console.log(user)
  
    // Ahora puedes acceder a las propiedades del usuario, como su nombre
    const userName = user ? user.name : 'Invitado';
  
    const initialValues = {
      title: "",
      reviews: [{
        reviewerName: user.firstName,
        rating: "",
        reviewText: "",
      }]
    };
    const [reviewData, setReviewData] = useState({
        reviewerName: user.firstName,
        rating: '',
        reviewText: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReviewData({
            ...reviewData,
            [name]: value
        });
    };

    const validateForm = () => {
        let errors = {};
        
        if (!reviewData.rating) {
            errors.rating = 'El rating es requerido';
        } else if (reviewData.rating < 0 || reviewData.rating > 10) {
            errors.rating = 'El rating debe estar entre 0 y 10';
        }
        if (!reviewData.reviewText) {
            errors.reviewText = 'La reseña es requerida';
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await axios.post(`http://localhost:8000/api/movie/${movieId}/reviews`, reviewData);
                Swal.fire({
                    icon: 'success',
                    title: 'Reseña agregada exitosamente',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    // Redireccionar a la página inicial después de 1.5 segundos
                    window.location.href = '/';
                });
            } catch (error) {
                console.error('Error adding review:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Hubo un error al agregar la reseña. Por favor, inténtalo de nuevo.'
                });
            }
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Agregar Nueva Reseña</h1>
            <form onSubmit={handleSubmit}>
            <div className="mb-3">
                    <label className="form-label">Nombre del revisor:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="reviews[0].reviewerName"
                      value={`${user.firstName}`} // Concatenar el nombre y apellido del usuario
                      
                    ></input>
                </div>
                <div className="mb-3">
                    <label className="form-label">Rating:</label>
                    <input type="number" className={`form-control ${errors.rating ? 'is-invalid' : ''}`} name="rating" value={reviewData.rating} onChange={handleChange} />
                    {errors.rating && <div className="invalid-feedback">{errors.rating}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Reseña:</label>
                    <textarea className={`form-control ${errors.reviewText ? 'is-invalid' : ''}`} name="reviewText" value={reviewData.reviewText} onChange={handleChange} />
                    {errors.reviewText && <div className="invalid-feedback">{errors.reviewText}</div>}
                </div>
                <button type="submit" className="btn btn-primary me-3">Agregar Reseña</button>
                <button className="btn btn-secondary " onClick={() => navigate("/")}>
                  Cancelar
                </button>
            </form>
            
        </div>
    );
};

export default AddReview;
