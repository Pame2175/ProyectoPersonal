import React, { useContext } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from "axios";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import Swal from 'sweetalert2';

const UserForm = ({ formType }) => {
    const { setUser, user } = useContext(UserContext); 
    const navigate = useNavigate();

    const initialValues = {
        email: '',
        password: '',
        firstName: user?.firstName || '', 
        lastName: user?.lastName || '', 
        confirmPassword: '',
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Este correo no es válido')
            .required('Esto es requerido'),
        password: Yup.string()
            .min(8, 'Campo debe tener 8 caracteres')
            .required('NO OLVIDAR!!!'),
        ...(formType === 'registro' && {
            firstName: Yup.string().required('Nombre es requerido'),
            lastName: Yup.string().required('Apellido es requerido'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
                .required('Confirmar contraseña es requerido'),
        }),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
        if (formType === "registro") {
            await registerUser(values, setErrors);
        } else {
            await loginUser(values, setErrors);
        }
        setSubmitting(false);
        resetForm();
    };

    const registerUser = async (values, setErrors) => {
        try {
            await axios.post(
                "http://localhost:8000/api/auth/register",
                values,
                { withCredentials: true }
            );
            Swal.fire({
                icon: 'success',
                title: 'Registrado exitosamente!',
                text: '¡Ya puedes iniciar sesión!',
                confirmButtonColor: '#007bff',
                confirmButtonText: 'OK',
            }).then(() => {
                resetForm();
            });
        } catch (err) {
            console.log("Error: ", err.response.data);
            setErrors({ general: err.response.data.msg });
        }
    };

    const loginUser = async (values, setErrors) => {
        try {
            let res = await axios.post(
                "http://localhost:8000/api/auth/login",
                values,
                { withCredentials: true }
            );
            setUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/movies/add"); 
        } catch (err) {
            console.log("Error: ", err.response);
            setErrors({ general: err.response.data.msg });
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, isSubmitting }) => (
                            <Form>
                                <h2>{formType === 'login' ? 'Iniciar Sesión' : 'Registrarse'}</h2>
                                {errors?.general && (
                                    <div className="alert alert-danger" role="alert">
                                        {errors.general}
                                    </div>
                                )}
                                {formType === 'registro' && (
                                    <>
                                        <div className="mb-3">
                                            <Field type="text" name="firstName" className="form-control" placeholder="Nombre" />
                                            <ErrorMessage name="firstName" component="div" className="text-danger" />
                                        </div>
                                        <div className="mb-3">
                                            <Field type="text" name="lastName" className="form-control" placeholder="Apellido" />
                                            <ErrorMessage name="lastName" component="div" className="text-danger" />
                                        </div>
                                    </>
                                )}
                                <div className="mb-3">
                                    <Field type="email" name="email" className="form-control" placeholder="Email" />
                                    <ErrorMessage name="email" component="div" className="text-danger" />
                                </div>
                                <div className="mb-3">
                                    <Field type="password" name="password" className="form-control" placeholder="Password" />
                                    <ErrorMessage name="password" component="div" className="text-danger" />
                                </div>
                                {formType === 'registro' && (
                                    <div className="mb-3">
                                        <Field type="password" name="confirmPassword" className="form-control" placeholder="Confirmar password" />
                                        <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                                    </div>
                                )}
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {formType === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}

UserForm.propTypes = {
    formType: PropTypes.string.isRequired
}

export default UserForm;
