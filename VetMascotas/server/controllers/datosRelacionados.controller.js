// controllers/datosRelacionados.controller.js
const TipoAnimal = require('../models/tipo.model');
const Raza = require('../models/raza.model');
const Vacuna = require('../models/vacuna.model');

const obtenerTiposDeAnimales = async (req, res) => {
    try {
        const tiposDeAnimales = await TipoAnimal.find();
        res.json(tiposDeAnimales);
    } catch (error) {
        res.status(400).json({ message: 'Error al obtener tipos de animales', error });
    }
};

const obtenerRazas = async (req, res) => {
    try {
        const razas = await Raza.find();
        res.json(razas);
    } catch (error) {
        res.status(400).json({ message: 'Error al obtener razas', error });
    }
};

const obtenerVacunas = async (req, res) => {
    try {
        const vacunas = await Vacuna.find();
        res.json(vacunas);
    } catch (error) {
        res.status(400).json({ message: 'Error al obtener vacunas', error });
    }
};

module.exports = {
    obtenerTiposDeAnimales,
    obtenerRazas,
    obtenerVacunas,
};
