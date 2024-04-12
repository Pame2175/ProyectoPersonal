import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddMascota = () => {
    const navigate = useNavigate();
    const [tiposDeAnimales, setTiposDeAnimales] = useState([]);
    const [razas, setRazas] = useState([]);
    const [vacunas, setVacunas] = useState([]);
    const [vacunasFiltradas, setVacunasFiltradas] = useState([]);
    const [razasFiltradas, setRazasFiltradas] = useState([]);

    // Cargar datos de la base de datos
    useEffect(() => {
        const cargarDatosDeLaBaseDeDatos = async () => {
            try {
                const responseTiposAnimales = await axios.get("http://localhost:8000/api/mascota/tipos-de-animales");
                setTiposDeAnimales(responseTiposAnimales.data);

                const responseRazas = await axios.get("http://localhost:8000/api/mascota/razas");
                setRazas(responseRazas.data);

                const responseVacunas = await axios.get("http://localhost:8000/api/mascota/vacunas");
                setVacunas(responseVacunas.data);
            } catch (error) {
                console.error("Error al cargar los datos de la base de datos:", error);
            }
        };
        cargarDatosDeLaBaseDeDatos();
    }, []);

    // Función para manejar cambios en el tipo de animal
    const manejarCambioTipoAnimal = (tipoAnimalId, setFieldValue) => {
        const razasFiltradas = razas.filter(raza => raza.tipoAnimalId === tipoAnimalId);
        setRazasFiltradas(razasFiltradas);

        const vacunasFiltradas = vacunas.filter(vacuna => vacuna.tipoAnimalId === tipoAnimalId);
        setVacunasFiltradas(vacunasFiltradas);

        setFieldValue("razaId", razasFiltradas.length > 0 ? razasFiltradas[0]._id : "");
        setFieldValue("vacunaciones", []);
    };

    const initialValues = {
        nombre: "",
        tipoAnimalId: "",
        razaId: "",
        edad: "",
        fechaNacimiento: "",
        genero: "",
        color: "",
        tamaño: "",
        microchip: "",
        vacunaciones: [],
        condicionesMedicas: "",
        propietario: "",
    };

    const validationSchema = Yup.object().shape({
        nombre: Yup.string().required("El nombre de la mascota es obligatorio"),
        tipoAnimalId: Yup.string().required("El tipo de animal es obligatorio"),
        razaId: Yup.string().required("La raza es obligatoria"),
        edad: Yup.number().required("La edad es obligatoria").min(0, "La edad no puede ser negativa"),
        fechaNacimiento: Yup.date().required("La fecha de nacimiento es obligatoria"),
        genero: Yup.string(),
        color: Yup.string(),
        tamaño: Yup.string(),
        microchip: Yup.string(),
        vacunaciones: Yup.array().of(
            Yup.object().shape({
                vacunaId: Yup.string().required("Debe seleccionar una vacuna"),
                fechaAdministracion: Yup.date().required("Debe seleccionar una fecha de administración"),
            })
        ),
        condicionesMedicas: Yup.string(),
        propietario: Yup.string().required("El nombre del propietario es obligatorio"),
    });

    const onSubmit = async (values, { setSubmitting }) => {
        try {
            await axios.post("http://localhost:8000/api/mascota/registrar-mascota", values);
            navigate("/");
            Swal.fire({
                icon: "success",
                title: "¡Éxito!",
                text: "¡Mascota agregada exitosamente!",
            });
        } catch (error) {
            console.error("Error al agregar la mascota:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Error al agregar la mascota",
            });
        }
        setSubmitting(false);
    };

    return (
        <div className="container">
            <h1>Agregar Mascota</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting, values, setFieldValue }) => (
                    <Form className="form-group">
                        {/* Campos del formulario */}
                        <div className="mb-3">
                            <label htmlFor="nombre">Nombre:</label>
                            <Field
                                type="text"
                                name="nombre"
                                className="form-control"
                                id="nombre"
                            />
                            <ErrorMessage
                                name="nombre"
                                component="div"
                                className="text-danger"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="tipoAnimalId">Tipo de animal:</label>
                            <Field
                                as="select"
                                name="tipoAnimalId"
                                className="form-control"
                                id="tipoAnimalId"
                                onChange={(e) => {
                                    const tipoAnimalId = e.target.value;
                                    setFieldValue("tipoAnimalId", tipoAnimalId);
                                    manejarCambioTipoAnimal(tipoAnimalId, setFieldValue);
                                }}
                            >
                                <option value="">Seleccione un tipo de animal</option>
                                {tiposDeAnimales.map((tipo) => (
                                    <option key={tipo._id} value={tipo._id}>
                                        {tipo.nombre}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage
                                name="tipoAnimalId"
                                component="div"
                                className="text-danger"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="razaId">Raza:</label>
                            <Field
                                as="select"
                                name="razaId"
                                className="form-control"
                                id="razaId"
                            >
                                <option value="">Seleccione una raza</option>
                                {razasFiltradas.map((raza) => (
                                    <option key={raza._id} value={raza._id}>
                                        {raza.nombre}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage
                                name="razaId"
                                component="div"
                                className="text-danger"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="edad">Edad:</label>
                            <Field
                                type="number"
                                name="edad"
                                className="form-control"
                                id="edad"
                            />
                            <ErrorMessage
                                name="edad"
                                component="div"
                                className="text-danger"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="fechaNacimiento">Fecha de nacimiento:</label>
                            <Field
                                type="date"
                                name="fechaNacimiento"
                                className="form-control"
                                id="fechaNacimiento"
                            />
                            <ErrorMessage
                                name="fechaNacimiento"
                                component="div"
                                className="text-danger"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="genero">Género:</label>
                            <Field
                                as="select"
                                name="genero"
                                className="form-control"
                                id="genero"
                            >
                                <option value="">Seleccione un género</option>
                                <option value="Macho">Macho</option>
                                <option value="Hembra">Hembra</option>
                            </Field>
                            <ErrorMessage
                                name="genero"
                                component="div"
                                className="text-danger"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="color">Color:</label>
                            <Field
                                type="text"
                                name="color"
                                className="form-control"
                                id="color"
                            />
                            <ErrorMessage
                                name="color"
                                component="div"
                                className="text-danger"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="tamaño">Tamaño:</label>
                            <Field
                                type="text"
                                name="tamaño"
                                className="form-control"
                                id="tamaño"
                            />
                            <ErrorMessage
                                name="tamaño"
                                component="div"
                                className="text-danger"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="microchip">Microchip:</label>
                            <Field
                                type="text"
                                name="microchip"
                                className="form-control"
                                id="microchip"
                            />
                            <ErrorMessage
                                name="microchip"
                                component="div"
                                className="text-danger"
                            />
                        </div>

                        {/* Vacunaciones */}
                        <div className="mb-3">
                            <label>Vacunaciones:</label>
                            {values.vacunaciones.map((vacunacion, index) => (
                                <div key={index} className="mb-3">
                                    <div className="input-group">
                                        <Field
                                            as="select"
                                            name={`vacunaciones[${index}].vacunaId`}
                                            className="form-select"
                                        >
                                            <option value="">Seleccione una vacuna</option>
                                            {vacunasFiltradas.map((vacuna) => (
                                                <option key={vacuna._id} value={vacuna._id}>
                                                    {vacuna.nombre}
                                                </option>
                                            ))}
                                        </Field>
                                        <Field
                                            type="date"
                                            name={`vacunaciones[${index}].fechaAdministracion`}
                                            className="form-control"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => setFieldValue('vacunaciones', values.vacunaciones.filter((_, i) => i !== index))}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                    <ErrorMessage
                                        name={`vacunaciones[${index}].vacunaId`}
                                        component="div"
                                        className="text-danger"
                                    />
                                    <ErrorMessage
                                        name={`vacunaciones[${index}].fechaAdministracion`}
                                        component="div"
                                        className="text-danger"
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setFieldValue('vacunaciones', [...values.vacunaciones, { vacunaId: '', fechaAdministracion: '' }])}
                            >
                                Agregar Vacunación
                            </button>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="condicionesMedicas">Condiciones Médicas:</label>
                            <Field
                                as="textarea"
                                name="condicionesMedicas"
                                className="form-control"
                                id="condicionesMedicas"
                            />
                            <ErrorMessage
                                name="condicionesMedicas"
                                component="div"
                                className="text-danger"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="propietario">Propietario:</label>
                            <Field
                                type="text"
                                name="propietario"
                                className="form-control"
                                id="propietario"
                            />
                            <ErrorMessage
                                name="propietario"
                                component="div"
                                className="text-danger"
                            />
                        </div>

                        {/* Botones de enviar y cancelar */}
                        <div className="d-flex justify-content-between">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                Enviar
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/")}
                            >
                                Cancelar
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddMascota;
