const express = require('express');
const MascotaController = require('../controllers/mascota.controller');
const DatosRelacionadosController = require('../controllers/datosRelacionados.controller');
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

module.exports = MascotaRouter;
