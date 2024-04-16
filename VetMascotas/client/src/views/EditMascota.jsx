import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { useContext } from "react";
import Swal from 'sweetalert2';

const EditarMascota = () => {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [mascota, setMascota] = useState(null);
    const [vacunas, setVacunas] = useState([]);
    const [vacunasFiltradas, setVacunasFiltradas] = useState([]);

    // Cargar datos de la mascota por ID
    useEffect(() => {
        const fetchMascota = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/mascota/lista/${id}`);
                setMascota(response.data);

                // Filtrar las vacunas según el tipo de animal de la mascota
                const tipoAnimalId = response.data.tipoAnimalId._id;
                filtrarVacunasPorTipoAnimal(tipoAnimalId);
            } catch (error) {
                console.error('Error al cargar la mascota:', error);
            }
        };

        fetchMascota();
    }, [id]);

    // Cargar todas las vacunas desde la API
    useEffect(() => {
        const fetchVacunas = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/mascota/vacunas');
                setVacunas(response.data);
                if (mascota) {
                    // Filtrar vacunas según el tipo de animal de la mascota
                    filtrarVacunasPorTipoAnimal(mascota.tipoAnimalId._id);
                }
            } catch (error) {
                console.error('Error al cargar las vacunas:', error);
            }
        };

        fetchVacunas();
    }, [mascota]);

    // Filtrar vacunas por tipo de animal
    const filtrarVacunasPorTipoAnimal = (tipoAnimalId) => {
        const vacunasFiltradas = vacunas.filter(vacuna => vacuna.tipoAnimalId === tipoAnimalId);
        setVacunasFiltradas(vacunasFiltradas);
    };

    // Valores iniciales para Formik
    const getInitialValues = () => {
        if (!mascota) {
            return {
                nombre: '',
                edad: '',
                fechaNacimiento: '',
                genero: '',
                color: '',
                tamaño: '',
                microchip: '',
                vacunaciones: [],
                condicionesMedicas: '',
            };
        }

        // Convertimos la fecha de administración a formato YYYY-MM-DD
        const vacunacionesIniciales = mascota.vacunaciones.map(vacunacion => ({
            vacunaId: vacunacion.vacunaId._id,
            fechaAdministracion: vacunacion.fechaAdministracion.split('T')[0],
        }));

        return {
            nombre: mascota.nombre,
            edad: mascota.edad,
            fechaNacimiento: mascota.fechaNacimiento.split('T')[0],
            genero: mascota.genero,
            color: mascota.color,
            tamaño: mascota.tamaño,
            microchip: mascota.microchip,
            vacunaciones: vacunacionesIniciales,
            condicionesMedicas: mascota.condicionesMedicas,
            propietario: mascota.propietario,
        };
    };

    // Esquema de validación con Yup
    const validationSchema = Yup.object().shape({
        nombre: Yup.string().required('El nombre es obligatorio'),
        edad: Yup.number().required('La edad es obligatoria'),
        fechaNacimiento: Yup.date().required('La fecha de nacimiento es obligatoria'),
        genero: Yup.string(),
        color: Yup.string(),
        tamaño: Yup.string(),
        microchip: Yup.string(),
        vacunaciones: Yup.array().of(
            Yup.object().shape({
                vacunaId: Yup.string().required('Seleccione una vacuna'),
                fechaAdministracion: Yup.date().required('Seleccione una fecha de administración'),
            })
        ),
        condicionesMedicas: Yup.string(),
      
    });

    // Manejar la sumisión del formulario
    const handleSubmit = async (values) => {
        try {
            // Enviar los valores actualizados al servidor
            await axios.put(`http://localhost:8000/api/mascota/editar/${id}`, values);

            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'La mascota ha sido actualizada con éxito.',
                allowOutsideClick: true, // Permitir que se cierre al hacer clic fuera
                willClose: () => {
                    // Redirigir a la lista de mascotas después de cerrar la alerta
                    navigate('/');
                }
            });
            
        } catch (error) {
            console.error('Error al actualizar la mascota:', error);
            alert('Error al actualizar la mascota');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">Editar Mascota</h1>
            {mascota ? (
                <Formik
                    initialValues={getInitialValues()}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue }) => (
                        <Form>
                            {/* Campos para la información básica de la mascota */}
                            <div className="row mb-3">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="nombre">Nombre:</label>
                                    <Field
                                        type="text"
                                        name="nombre"
                                        id="nombre"
                                        className="form-control"
                                    />
                                    <ErrorMessage name="nombre" component="div" className="text-danger" />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="edad">Edad:</label>
                                    <Field
                                        type="number"
                                        name="edad"
                                        id="edad"
                                        className="form-control"
                                    />
                                    <ErrorMessage name="edad" component="div" className="text-danger" />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="fechaNacimiento">Fecha de nacimiento:</label>
                                    <Field
                                        type="date"
                                        name="fechaNacimiento"
                                        id="fechaNacimiento"
                                        className="form-control"
                                    />
                                    <ErrorMessage name="fechaNacimiento" component="div" className="text-danger" />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="genero">Género:</label>
                                    <Field
                                        as="select"
                                        name="genero"
                                        id="genero"
                                        className="form-select"
                                    >
                                        <option value="">Seleccione un género</option>
                                        <option value="Macho">Macho</option>
                                        <option value="Hembra">Hembra</option>
                                    </Field>
                                    <ErrorMessage name="genero" component="div" className="text-danger" />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="color">Color:</label>
                                    <Field
                                        type="text"
                                        name="color"
                                        id="color"
                                        className="form-control"
                                    />
                                    <ErrorMessage name="color" component="div" className="text-danger" />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="tamaño">Tamaño:</label>
                                    <Field
                                        type="text"
                                        name="tamaño"
                                        id="tamaño"
                                        className="form-control"
                                    />
                                    <ErrorMessage name="tamaño" component="div" className="text-danger" />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="microchip">Microchip:</label>
                                    <Field
                                        type="text"
                                        name="microchip"
                                        id="microchip"
                                        className="form-control"
                                    />
                                    <ErrorMessage name="microchip" component="div" className="text-danger" />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="condicionesMedicas">Condiciones médicas:</label>
                                    <Field
                                        type="text"
                                        name="condicionesMedicas"
                                        id="condicionesMedicas"
                                        className="form-control"
                                    />
                                    <ErrorMessage name="condicionesMedicas" component="div" className="text-danger" />
                                </div>
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="propietario">Propietario:</label>
                                <Field
                                    value={user.firstName}
                                    type="text"
                                    name="propietario"
                                    id="propietario"
                                    className="form-control"
                                />
                            </div>

                            {/* Vacunaciones */}
                            <div className="mb-3">
                                <h5>Vacunaciones</h5>
                                <div className="row">
                                    {values.vacunaciones.map((vacunacion, index) => (
                                        <div key={index} className="col-md-6 mb-3">
                                            <div className="card p-2">
                                                {/* Campo de selección de vacuna */}
                                                <label htmlFor={`vacunaciones[${index}].vacunaId`}>Vacuna:</label>
                                                <Field
                                                    as="select"
                                                    name={`vacunaciones[${index}].vacunaId`}
                                                    id={`vacunaciones[${index}].vacunaId`}
                                                    className="form-select mb-2"
                                                >
                                                    {vacunasFiltradas.map(vacuna => (
                                                        <option
                                                            key={vacuna._id}
                                                            value={vacuna._id}
                                                            selected={vacunacion.vacunaId === vacuna._id}
                                                        >
                                                            {vacuna.nombre}
                                                        </option>
                                                    ))}
                                                </Field>
                                                <ErrorMessage name={`vacunaciones[${index}].vacunaId`} component="div" className="text-danger" />

                                                {/* Campo de fecha de administración */}
                                                <label htmlFor={`vacunaciones[${index}].fechaAdministracion`}>Fecha de administración:</label>
                                                <Field
                                                    type="date"
                                                    name={`vacunaciones[${index}].fechaAdministracion`}
                                                    id={`vacunaciones[${index}].fechaAdministracion`}
                                                    className="form-control mb-2"
                                                />
                                                <ErrorMessage name={`vacunaciones[${index}].fechaAdministracion`} component="div" className="text-danger" />

                                                {/* Botón para eliminar la vacunación */}
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => {
                                                        const nuevasVacunaciones = [...values.vacunaciones];
                                                        nuevasVacunaciones.splice(index, 1);
                                                        setFieldValue('vacunaciones', nuevasVacunaciones);
                                                    }}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Botón para agregar nueva vacunación */}
                                <button
                                    type="button"
                                    className="btn btn-success mt-3"
                                    onClick={() => {
                                        setFieldValue('vacunaciones', [
                                            ...values.vacunaciones,
                                            { vacunaId: '', fechaAdministracion: '' },
                                        ]);
                                    }}
                                >
                                    Agregar nueva vacunación
                                </button>
                            </div>

                            <div className="form-group mt-3">
                                <button type="submit" className="btn btn-primary me-2">
                                    Guardar cambios
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary ml-2"
                                    onClick={() => navigate('/')}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            ) : (
                <p>Cargando datos de la mascota...</p>
            )}
        </div>
    );
};

export default EditarMascota;
