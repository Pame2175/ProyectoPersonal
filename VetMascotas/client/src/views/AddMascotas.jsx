import React, { useState, useEffect, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import UserContext from "../context/UserContext";

const AddMascota = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [tiposDeAnimales, setTiposDeAnimales] = useState([]);
    const [razas, setRazas] = useState([]);
    const [vacunas, setVacunas] = useState([]);
    const [vacunasFiltradas, setVacunasFiltradas] = useState([]);
    const [razasFiltradas, setRazasFiltradas] = useState([]);
    const [selectedColor, setSelectedColor] = useState("#000000");

    // Cargar datos de la base de datos
    useEffect(() => {
        const cargarDatosDeLaBaseDeDatos = async () => {
            try {
                const responseTiposAnimales = await axios.get(
                    "http://localhost:8000/api/mascota/tipos-de-animales"
                );
                setTiposDeAnimales(responseTiposAnimales.data);

                const responseRazas = await axios.get(
                    "http://localhost:8000/api/mascota/razas"
                );
                setRazas(responseRazas.data);

                const responseVacunas = await axios.get(
                    "http://localhost:8000/api/mascota/vacunas"
                );
                setVacunas(responseVacunas.data);
            } catch (error) {
                console.error("Error al cargar los datos de la base de datos:", error);
            }
        };
        cargarDatosDeLaBaseDeDatos();
    }, []);

    // Función para manejar cambios en el tipo de animal
    const manejarCambioTipoAnimal = (tipoAnimalId, setFieldValue) => {
        const razasFiltradas = razas.filter((raza) => raza.tipoAnimalId === tipoAnimalId);
        setRazasFiltradas(razasFiltradas);

        const vacunasFiltradas = vacunas.filter((vacuna) => vacuna.tipoAnimalId === tipoAnimalId);
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
        propietarioId: user._id,
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

    // Función para obtener la lista de vacunas seleccionadas
    const obtenerVacunasSeleccionadas = (vacunaciones) => {
        return vacunaciones.map((vacunacion) => vacunacion.vacunaId);
    };

    const agregarVacunacion = (values, setFieldValue) => {
        const vacunaciones = values.vacunaciones;

        // Agrega una nueva vacunación a la lista
        const nuevaVacunacion = { vacunaId: "", fechaAdministracion: "" };
        setFieldValue("vacunaciones", [...vacunaciones, nuevaVacunacion]);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{
            height: "100vh",
           
        }}>
            <div className="card p-4" style={{ width: "80%", maxWidth: "600px" }}>
                <h1 className="card-title text-center mb-4">Agregar Ficha Mascota</h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting, values, setFieldValue }) => (
                        <Form>
                            {/* Campos del formulario */}
                            <div className="mb-3">
                                <label htmlFor="nombre" className="form-label">Nombre: *</label>
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

                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="mb-3">
                                        <label htmlFor="tipoAnimalId" className="form-label">Tipo de animal: *</label>
                                        <Field
                                            as="select"
                                            name="tipoAnimalId"
                                            className="form-select"
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
                                </div>

                                <div className="col-sm-4">
                                    <div className="mb-3">
                                        <label htmlFor="razaId" className="form-label">Raza: *</label>
                                        <Field
                                            as="select"
                                            name="razaId"
                                            className="form-select"
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
                                </div>

                                <div className="col-sm-4">
                                    <div className="mb-3">
                                        <label htmlFor="edad" className="form-label">Edad: </label>
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
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="mb-3">
                                        <label htmlFor="fechaNacimiento" className="form-label">Fecha de nacimiento: </label>
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
                                </div>

                                <div className="col-sm-4">
                                    <div className="mb-3">
                                        <label htmlFor="genero" className="form-label">Género:</label>
                                        <Field
                                            as="select"
                                            name="genero"
                                            className="form-select"
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
                                </div>

                                <div className="col-sm-4">
                                    <div className="mb-3">
                                        <label htmlFor="color" className="form-label">Color:</label>
                                        <Field
                                            type="color"
                                            id="color"
                                            name="color"
                                            value={values.color}
                                            onChange={(e) => setFieldValue("color", e.target.value)}
                                            className="form-control form-control-color"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="mb-3">
                                        <label htmlFor="tamaño" className="form-label">Tamaño:</label>
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
                                </div>

                                <div className="col-sm-4">
                                    <div className="mb-3">
                                        <label htmlFor="microchip" className="form-label">Microchip:</label>
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
                                </div>

                                <div className="col-sm-4">
                                    <div className="mb-3">
                                        <label htmlFor="condicionesMedicas" className="form-label">Condiciones médicas:</label>
                                        <Field
                                            type="text"
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
                                </div>
                            </div>

                            {/* Vacunaciones */}
                            <div className="mb-3">
                                <label className="form-label">Vacunaciones:</label>
                                {values.vacunaciones.map((vacunacion, index) => (
                                    <div key={index} className="mb-3">
                                        <div className="input-group">
                                            <Field
                                                as="select"
                                                name={`vacunaciones[${index}].vacunaId`}
                                                className="form-select"
                                            >
                                                <option value="">Seleccione una vacuna</option>
                                                {vacunasFiltradas.map((vacuna) => {
                                                    // Obtiene una lista de vacunas seleccionadas
                                                    const vacunasSeleccionadas = obtenerVacunasSeleccionadas(values.vacunaciones);

                                                    // Verifica si la vacuna está en la lista de seleccionadas
                                                    const isDisabled = vacunasSeleccionadas.includes(vacuna._id);

                                                    return (
                                                        <option
                                                            key={vacuna._id}
                                                            value={vacuna._id}
                                                            disabled={isDisabled}
                                                        >
                                                            {vacuna.nombre}
                                                        </option>
                                                    );
                                                })}
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

                                {/* Botón para agregar nueva vacunación */}
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => agregarVacunacion(values, setFieldValue)}
                                >
                                    Agregar vacunación
                                </button>
                            </div>

                            {/* Campos adicionales del formulario */}
                            <div className="mb-3">
                                <label htmlFor="condicionesMedicas" className="form-label">Propietario:</label>
                                <Field
                                    value={user.firstName}
                                    type="text"
                                    name="nombre_propietario"
                                    className="form-control"
                                />
                            </div>

                            {/* Botón de envío */}
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Agregando..." : "Agregar Mascota"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default AddMascota;
