import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';
import { useContext } from "react";

const AgendarCita = () => {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [mascota, setMascota] = useState(null);
    const [cita, setCita] = useState({
        mascotaId: id,
        veterinarioId: '',
        descripcion: '',
        horario: '',
        estado: 'pendiente',
        propietarioId: user._id,
    });
    const [veterinarios, setVeterinarios] = useState([]);
    const [horariosDisponibles, setHorariosDisponibles] = useState([]);
    const [citas, setCitas] = useState([]);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [erroresValidacion, setErroresValidacion] = useState({});

    // Cargar datos de la mascota
    const cargarMascota = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/mascota/lista/${id}`);
            setMascota(response.data);
            setCita((prevCita) => ({
                ...prevCita,
                mascotaId: id,
            }));
        } catch (error) {
            console.error('Error al cargar la mascota:', error);
            setError('Hubo un problema al cargar los datos de la mascota.');
        } finally {
            setCargando(false);
        }
    };

    // Cargar los veterinarios
    const cargarVeterinarios = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/mascota/veterinarios');
            setVeterinarios(response.data);
        } catch (error) {
            console.error('Error al obtener los veterinarios:', error);
            setError('Hubo un problema al cargar los datos de los veterinarios.');
        }
    };

    // Cargar horarios disponibles del veterinario seleccionado
    const cargarHorariosDisponibles = async (veterinarioId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/mascota/veterinarios/${veterinarioId}/horarios`);
            setHorariosDisponibles(response.data);
        } catch (error) {
            console.error('Error al cargar horarios del veterinario:', error);
            setError('Hubo un problema al cargar los horarios del veterinario.');
        }
    };

    // Cargar citas existentes para el veterinario seleccionado
    const cargarCitas = async (veterinarioId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/mascota/cita/lista?veterinarioId=${veterinarioId}`);
            setCitas(response.data);
        } catch (error) {
            console.error('Error al obtener las citas existentes:', error);
            setError('Hubo un problema al cargar las citas existentes.');
        }
    };

    // Efecto para cargar datos de la mascota, veterinarios y citas existentes cuando se selecciona un veterinario
    useEffect(() => {
        cargarMascota();
        cargarVeterinarios();
    }, [id]);

    useEffect(() => {
        if (cita.veterinarioId) {
            cargarCitas(cita.veterinarioId);
            cargarHorariosDisponibles(cita.veterinarioId);
        }
    }, [cita.veterinarioId]);

    // Manejar el cambio de los campos del formulario
    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setCita({ ...cita, [name]: value });
    };

    // Validar el formulario
    const validarFormulario = () => {
        const errores = {};

        if (!cita.veterinarioId) {
            errores.veterinarioId = 'El campo veterinario es obligatorio.';
        }

        if (!cita.descripcion) {
            errores.descripcion = 'El campo descripción es obligatorio.';
        }

        if (!cita.horario) {
            errores.horario = 'El campo horario es obligatorio.';
        }

        setErroresValidacion(errores);
        return Object.keys(errores).length === 0;
    };

    // Verificar si el horario propuesto ya está ocupado
    const verificarDisponibilidad = () => {
        const [diaPropuesto, horaInicioPropuesta, horaFinPropuesta] = cita.horario.split(' - ');

        // Verifica si hay alguna cita que coincida con el veterinario, el horario y el día propuestos
        const citaExistente = citas.find((c) =>
            c.veterinarioId === cita.veterinarioId &&
            c.horario === cita.horario
        );

        return !!citaExistente;
    };

    // Enviar el formulario
    const enviarFormulario = async (e) => {
        e.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        // Verifica si el horario propuesto ya está ocupado
        if (verificarDisponibilidad()) {
            Swal.fire({
                title: 'Error',
                text: 'Ya hay una cita programada con este veterinario en el horario seleccionado. Por favor, elige otro horario.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        try {
            await axios.post('http://localhost:8000/api/mascota/cita', cita);
            Swal.fire({
                title: 'Éxito',
                text: 'Cita agendada con éxito.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            }).then(() => {
                navigate(`/`);
            });
        } catch (error) {
            console.error('Error al agendar la cita:', error);
            Swal.fire({
                title: 'Error',
                text: 'El veterinario ya tiene una agenda ese horario, elije otra',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    };

    return (
        <div className="container">
            {cargando && <p>Cargando...</p>}
            {error && <p className="text-danger">{error}</p>}
            {mascota && (
                <>
                    <h1>Agendar Cita para {mascota.nombre}</h1>

                    <form onSubmit={enviarFormulario}>
                        {/* Datos de la mascota */}
                        <div className="mb-3">
                            <label htmlFor="mascotaNombre" className="form-label">Nombre de la Mascota</label>
                            <input
                                type="text"
                                id="mascotaNombre"
                                name="mascotaNombre"
                                value={mascota.nombre}
                                readOnly
                                className="form-control"
                            />
                        </div>

                        {/* Edad de la mascota */}
                        <div className="mb-3">
                            <label htmlFor="mascotaEdad" className="form-label">Edad</label>
                            <input
                                type="number"
                                id="mascotaEdad"
                                name="mascotaEdad"
                                value={mascota.edad}
                                readOnly
                                className="form-control"
                            />
                        </div>

                        {/* Raza de la mascota */}
                        <div className="mb-3">
                            <label htmlFor="mascotaRaza" className="form-label">Raza</label>
                            <input
                                type="text"
                                id="mascotaRaza"
                                name="mascotaRaza"
                                value={mascota.razaId.nombre}
                                readOnly
                                className="form-control"
                            />
                        </div>

                        {/* Veterinario */}
                        <div className="mb-3">
                            <label htmlFor="veterinarioId" className="form-label">Veterinario</label>
                            <select
                                id="veterinarioId"
                                name="veterinarioId"
                                value={cita.veterinarioId}
                                onChange={manejarCambio}
                                className="form-control"
                                required
                            >
                                <option value="" disabled>
                                    Selecciona un veterinario
                                </option>
                                {veterinarios.map((veterinario) => (
                                    <option key={veterinario._id} value={veterinario._id}>
                                        {veterinario.nombre}
                                    </option>
                                ))}
                            </select>
                            {erroresValidacion.veterinarioId && (
                                <p className="text-danger">{erroresValidacion.veterinarioId}</p>
                            )}
                        </div>

                        {/* Descripción */}
                        <div className="mb-3">
                            <label htmlFor="descripcion" className="form-label">Descripción</label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={cita.descripcion}
                                onChange={manejarCambio}
                                className="form-control"
                                rows="3"
                                required
                            />
                            {erroresValidacion.descripcion && (
                                <p className="text-danger">{erroresValidacion.descripcion}</p>
                            )}
                        </div>

                        {/* Horarios disponibles */}
                        {horariosDisponibles.length > 0 && (
                            <div className="mb-3">
                                <label htmlFor="horario" className="form-label">Horarios Disponibles</label>
                                <select
                                    id="horario"
                                    name="horario"
                                    value={cita.horario}
                                    onChange={manejarCambio}
                                    className="form-control"
                                    required
                                >
                                    <option value="" disabled>
                                        Selecciona un horario
                                    </option>
                                    {horariosDisponibles.map((horario, index) => (
                                        <option key={index} value={`${horario.dia} - ${horario.horaInicio} - ${horario.horaFin}`}>
                                            {horario.dia} - {horario.horaInicio} - {horario.horaFin}
                                        </option>
                                    ))}
                                </select>
                                {erroresValidacion.horario && (
                                    <p className="text-danger">{erroresValidacion.horario}</p>
                                )}
                            </div>
                        )}

                        {/* Botón para agendar la cita */}
                        <button type="submit" className="btn btn-outline-primary">
                            Agendar Cita
                        </button>
                    </form>

                    {/* Botón para volver a la vista de la mascota */}
                    <button onClick={() => navigate(`/`)} className="btn btn-outline-dark mt-3">
                        Volver a la vista de la mascota
                    </button>
                </>
            )}
        </div>
    );
};

export default AgendarCita;
