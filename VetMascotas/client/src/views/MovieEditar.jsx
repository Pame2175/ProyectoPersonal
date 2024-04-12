import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const EditPlayer = () => {
    const { piratesId } = useParams();

    const [player, setPlayer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [captainExists, setCaptainExists] = useState(false);

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/player/${piratesId}`, {
                    withCredentials: true
                });
                setPlayer(response.data.pirate);
                setIsLoading(false);
                // Check if the player is a captain
                setCaptainExists(response.data.pirate.position === "Capitán");
            } catch (error) {
                setError(error);
                setIsLoading(false);
            }
        };

        fetchPlayer();
    }, [piratesId]);

    const onSubmit = async (values, { setSubmitting }) => {
        try {
            // Check if trying to add a captain when one already exists
            if (values.position === "Capitán" && captainExists && player.position !== "Capitán") {
                throw new Error("Ya hay un capitán seleccionado. Solo puede haber un capitán a la vez.");
            }

            await axios.put(`http://localhost:8000/api/player/${piratesId}`, values, {
                withCredentials: true
            });
            setIsSaved(true);
        } catch (error) {
            setError(error);
        }
        setSubmitting(false);
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("El nombre del pirata es requerido"),
        image: Yup.string().url("Debe ser una URL válida"),
        quantity: Yup.number()
            .positive("La cantidad debe ser mayor que cero")
            .integer("La cantidad debe ser un número entero")
            .required("La cantidad es requerida"),
        description: Yup.string().required("La descripción es requerida"),
        position: Yup.string().required("La posición del pirata es requerida"),
    });

    if (isLoading) {
        return <div className="spinner-border spinner-border-sm" role="status"><span className="visually-hidden">Loading...</span></div>;
    }

    if (error) {
        return <div className="alert alert-danger">Error: {error.message}</div>;
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card border-primary p-4" style={{ width: "500px" }}>
                <h2 className="mb-4 fs-5 text-center">Edit Player</h2>
                <Formik
                    initialValues={{
                        name: player.name || "",
                        image: player.image || "",
                        quantity: player.quantity || "",
                        description: player.description || "",
                        position: player.position || "",
                        features: {
                            swords: player.features?.swords || false,
                            treasure: player.features?.treasure || false,
                            ship: player.features?.ship || false
                        }
                    }}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="mb-3">
                                <label className="form-label">Nombre Pirata:</label>
                                <Field type="text" className="form-control" name="name" />
                                <ErrorMessage name="name" component="div" className="text-danger" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">URL de la imagen:</label>
                                <Field type="text" className="form-control" name="image" />
                                <ErrorMessage name="image" component="div" className="text-danger" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Cantidad de tesoros:</label>
                                <Field type="number" className="form-control" name="quantity" />
                                <ErrorMessage name="quantity" component="div" className="text-danger" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Descripción:</label>
                                <Field as="textarea" className="form-control" name="description" />
                                <ErrorMessage name="description" component="div" className="text-danger" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Posición de pirata:</label>
                                <Field as="select" className="form-select" name="position">
                                    <option value="">Selecciona una posición</option>
                                    <option value="Capitán" disabled={captainExists && player.position !== "Capitán"}>Capitán</option>
                                    <option value="Novato">Novato</option>
                                    <option value="Pirata Mayor">Pirata Mayor</option>
                                </Field>
                                <ErrorMessage name="position" component="div" className="text-danger" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Características:</label>
                                <div className="form-check">
                                    <Field type="checkbox" className="form-check-input" name="features.swords" />
                                    <label className="form-check-label">Parche en el ojo</label>
                                </div>
                                <div className="form-check">
                                    <Field type="checkbox" className="form-check-input" name="features.treasure" />
                                    <label className="form-check-label">Mano de gancho</label>
                                </div>
                                <div className="form-check">
                                    <Field type="checkbox" className="form-check-input" name="features.ship" />
                                    <label className="form-check-label">Peg pierna</label>
                                </div>
                            </div>
                            <div className="mb-3 d-flex justify-content-between align-items-center">
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Guardar Cambios</button>
                                <Link to="/" className="btn btn-secondary">Volver a la Lista</Link>
                            </div>
                            {isSaved && (
                                <div className="alert alert-success" role="alert">
                                    ¡Jugador guardado exitosamente! <Link to="/" className="btn btn-success">OK</Link>
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default EditPlayer;
