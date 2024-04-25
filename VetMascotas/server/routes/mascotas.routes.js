const express = require('express');
const MascotaController = require('../controllers/mascota.controller');
const DatosRelacionadosController = require('../controllers/datosRelacionados.controller');
const CitasController = require('../controllers/agendar_cita');
const VeterinarioController = require('../controllers/veterinarios');
const horariosController = require('../controllers/horarios.veterinarios');
const { authenticate } = require('../config/jwt.config');

const MascotaRouter = express.Router();

// Ruta para registrar una nueva mascota (requiere autenticación)
MascotaRouter.post('/registrar-mascota', MascotaController.crearMascota);

// Ruta para obtener los tipos de animales
MascotaRouter.get('/tipos-de-animales', DatosRelacionadosController.obtenerTiposDeAnimales);

// Ruta para obtener las razas (opcional: filtrar por tipo de animal)
MascotaRouter.get('/razas', DatosRelacionadosController.obtenerRazas);

// Ruta para obtener las vacunas (opcional: filtrar por tipo de animal)
MascotaRouter.get('/vacunas', DatosRelacionadosController.obtenerVacunas);

// Ruta para obtener los datos de una mascota específica por su ID (requiere autenticación)
MascotaRouter.get('/lista/', MascotaController.obtenerMascota);
// Ruta para editar una mascota específica
MascotaRouter.put('/editar/:id',MascotaController.editarMascota);
MascotaRouter.get('/lista/:id',MascotaController.obtenerMascotaPorId);
MascotaRouter.post('/cita',CitasController.crearCita);
MascotaRouter.delete('/cita/delete/:id',CitasController.eliminarCita);
MascotaRouter.get('/cita/lista',CitasController.obtenerListaCitas);
MascotaRouter.put('/cita/editar/:id',CitasController.editarCita);
MascotaRouter.get('/cita/lista/:id',CitasController.obtenerCitaPorId);
MascotaRouter.get('/veterinarios',VeterinarioController.obtenerVeterinarios);

// Utiliza las funciones del controlador en las rutas
MascotaRouter.post('/horario', horariosController.agregarHorario);
MascotaRouter.put('/horario/:id', horariosController.actualizarHorario);
MascotaRouter.delete('/horario/:id', horariosController.eliminarHorario);
MascotaRouter.get('/veterinarios/:veterinarioId/horarios', horariosController.obtenerHorarios);




module.exports = MascotaRouter;

