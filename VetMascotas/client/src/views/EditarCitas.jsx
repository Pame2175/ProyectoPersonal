import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditarCita = () => {
    const { citaId } = useParams(); // ID de la cita desde la URL
    const navigate = useNavigate();
    const [estado, setEstado] = useState('');
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Cargar los detalles de la cita al montar el componente
    useEffect(() => {
        const cargarCita = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/mascota/cita/lista/${citaId}`);
                setEstado(response.data.estado);
            } catch (error) {
                setError('Error al cargar los detalles de la cita.');
            } finally {
                setCargando(false);
            }
        };
        cargarCita();
    }, [citaId]);

    // Manejar cambios en el campo de estado
    const manejarCambio = (e) => {
        setEstado(e.target.value);
    };

    // Manejar el envío del formulario
    const manejarEnvio = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8000/api/mascota/cita/editar/${citaId}`, { estado });
            navigate('/mascota/citas'); // Redirigir a la lista de citas
        } catch (error) {
            setError('Error al guardar los cambios.');
        }
    };

    if (cargando) {
        return <p className="text-center">Cargando...</p>;
    }

    if (error) {
        return <p className="text-danger text-center">{error}</p>;
    }

    return (
        <div className="container">
            <h1 className="text-center">Editar Cita</h1>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={manejarEnvio}>
                                <div className="mb-3">
                                    <label htmlFor="estado" className="form-label">Estado:</label>
                                    <select
                                        id="estado"
                                        value={estado}
                                        onChange={manejarCambio}
                                        className="form-select"
                                        required
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="en proceso">En proceso</option>
                                        <option value="atendido">Atendido</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary btn-sm">Guardar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarCita;
