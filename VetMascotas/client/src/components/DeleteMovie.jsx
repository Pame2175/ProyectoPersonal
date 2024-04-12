import axios from "axios";
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

const DeleteMovie = ({ movieId, title, successCallback }) => {

    const deleteMovie = (movieId, title) => {

        Swal.fire({
            title: "¿Seguro que quieres eliminar?",
            text: `Estás a punto de eliminar la película "${title}".`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8000/api/movie/${movieId}`, { withCredentials: true })
                    .then(res => {
                        console.log(deelete);
                        successCallback(movieId);
                    })
                    .catch(err => {
                        console.log(err);
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: err.response?.data?.message || "Error al eliminar la película",
                        });
                    });
            }
        });
    };

    return (
        <button onClick={() => deleteMovie(movieId, title)} className="btn btn-outline-danger btn-sm">Eliminar</button>
    );
};

DeleteMovie.propTypes = {
    movieId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    successCallback: PropTypes.func.isRequired
};

export default DeleteMovie;
