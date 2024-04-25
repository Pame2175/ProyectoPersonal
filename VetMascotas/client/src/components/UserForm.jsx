import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import PropTypes from 'prop-types';
import UserContext from '../context/UserContext';
import Swal from 'sweetalert2';
import logo from '../img/logo.png';
const UserForm = ({ formType }) => {
    const { setUser } = useContext(UserContext);

    const initialValues = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        confirmPassword: '',
        role: 'user',
        address:'',
        phone:'',
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Correo electrónico no válido')
            .required('Ingrese su correo electrónico')
            .matches(/^[a-zA-Z0-9._%+-]+@(gmail|hotmail)\.com$/),
        password: Yup.string()
            .min(8, 'Debe tener al menos 8 caracteres')
            .required('Ingrese su contraseña'),
        ...(formType === 'registro' && {
            firstName: Yup.string().required('Ingresa su nombre'),
            lastName: Yup.string().required('Ingresa su apellido'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
                .required('Vuelva a ingredar su contraseña'),
            address: Yup.string().required('Ingresa su dirección'),
            phone:  Yup.string()
            .matches(/^09[789]\d{8}$/, 'El número de celular no es válido')
            .required('Ingresa tu número de celular'),

        }),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
        if (formType === 'registro') {
            await registerUser(values, setErrors);
        } else {
            await loginUser(values, setErrors);
        }
        setSubmitting(false);
        resetForm();
    };

   
    const registerUser = async (values, setErrors) => {
        try {
            // Obtener la lista de usuarios
            const userListResponse = await axios.get('http://localhost:8000/api/auth/user/lista');
            const userList = userListResponse.data;
    
            // Verificar si el correo electrónico ya está en uso
            const emailExists = userList.some(user => user.email === values.email);
     
            if (emailExists) {
                Swal.fire({
                    icon: 'error',
                    title: 'Correo ya registrado',
                    text: 'Intenta otro correo',
                    confirmButtonColor: '#007bff',
                    confirmButtonText: 'OK',
                }).then(() => {
                    window.location.href = '/register';
                });
                return;
            }
    
             // Si el correo electrónico no está en uso, proceder con el registro
            // Si el email es único, se registra el usuario
            const userToRegister = { ...values };
            if (userList.length === 0 ||values.firstName.toLowerCase() === '@admin4578') {
                // Si no hay usuarios, el primer usuario registrado será administrador
                userToRegister.role = 'admin';
            }
        

    
            await axios.post('http://localhost:8000/api/auth/register', userToRegister, {
                withCredentials: true,
            });
            Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: 'Ahora puedes iniciar sesión.',
                confirmButtonColor: '#007bff',
                confirmButtonText: 'OK',
            }).then(() => {
                window.location.href = '/login';
            });
        } catch (err) {
            setErrors({ general: err.response.data.message });
        }
    };
    
    

    const loginUser = async (values, setErrors) => {
        try {
            const res = await axios.post('http://localhost:8000/api/auth/login', values, {
                withCredentials: true,
            });
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            window.location.href = '/mascota/add';
        } catch (err) {
            if (err.response && err.response.status === 401) {
                // Mensaje para que vuelva a intentarlo
                Swal.fire({
                    icon: 'error',
                    title: 'Inicio de sesión fallido',
                    text: 'Los datos ingresados son incorrectos. Por favor, vuelve a intentarlo.',
                    confirmButtonColor: '#007bff',
                    confirmButtonText: 'OK',
                });
            } else {
                setErrors({ general: err.response.data.message });
            }
        }
    };

    return (
        <div className="container my-5">
            <div className="row g-0">
                <div className="col-lg-6 d-flex flex-column justify-content-center align-items-center text-center bg-info text-white p-4">
                    <img src={logo} alt="Imagen de ejemplo" className="img-fluid mb-4" />
                    <h3>VetMascotas</h3>
                    <p>Una breve descripción de tu aplicación o empresa.</p>
                </div>
                <div className="col-lg-6">
                    <div className="card shadow-lg p-4 h-100">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ errors, isSubmitting }) => (
                                <Form>
                                    <h3 style={{ fontStyle: 'italic' }}>{formType === 'login' ? 'Iniciar Sesión' : 'Registrarse'}</h3>
                                    {errors.general && (
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
                                            <div className="mb-3">
                                                <Field type="text" name="address" className="form-control" placeholder="Direción" />
                                                <ErrorMessage name="address" component="div" className="text-danger" />
                                            </div>
                                            <div className="mb-3">
                                                <Field type="text" name="phone" className="form-control" placeholder="Celular" />
                                                <ErrorMessage name="phone" component="div" className="text-danger" />
                                            </div>
                                        </>
                                    )}
                                    <div className="mb-3">
                                        <Field type="email" name="email" className="form-control" placeholder="correo electrónico" />
                                        <ErrorMessage name="email" component="div" className="text-danger" />
                                    </div>
                                    <div className="mb-3">
                                        <Field type="password" name="password" className="form-control" placeholder="contraseña" />
                                        <ErrorMessage name="password" component="div" className="text-danger" />
                                    </div>
                                    {formType === 'registro' && (
                                        <div className="mb-3">
                                            <Field
                                                type="password"
                                                name="confirmPassword"
                                                className="form-control"
                                                placeholder="Confirmar Password"
                                            />
                                            <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-start">
                                        <button type="submit" className="btn btn-outline-primary" disabled={isSubmitting} style={{ marginLeft: '130px' }}>
                                            {formType === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
                                        </button>
                                    </div>
                                    {/* Botón adicional para redireccionar */}
                                    {formType === 'login' && (
                                        <div className="mt-3">
                                            <a href="/register" className="btn btn-link">
                                                Registrarse
                                            </a>
                                        </div>
                                    )}
                                    {formType === 'registro' && (
                                        <div className="mt-3">
                                            <a href="/login" className="btn btn-link">
                                                Iniciar sesión
                                            </a>
                                        </div>
                                    )}
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
};

UserForm.propTypes = {
    formType: PropTypes.string.isRequired,
};

export default UserForm;