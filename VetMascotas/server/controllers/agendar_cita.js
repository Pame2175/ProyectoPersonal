const Cita = require('../models/Cita');
const Mascota = require('../models/mascota.model');
const Veterinario = require('../models/veterinario');
const mongoose = require('mongoose');
const crearCita = async (req, res) => {
    try {
        const { mascotaId, veterinarioId, descripcion, horario, estado } = req.body;

        // Validación de datos de entrada
        if (!mascotaId || !veterinarioId || !descripcion || !horario) {
            return res.status(400).json({ error: 'Los campos mascotaId, veterinarioId, descripcion, y horario son obligatorios.' });
        }

        // Validación del estado
        const estadosPermitidos = ['pendiente', 'en proceso', 'atendido'];
        if (estado && !estadosPermitidos.includes(estado)) {
            return res.status(400).json({ error: `El estado debe ser uno de los siguientes: ${estadosPermitidos.join(', ')}.` });
        }

        // Verificar que la mascota y el veterinario existan
        const mascota = await Mascota.findById(mascotaId);
        const veterinario = await Veterinario.findById(veterinarioId);

        if (!mascota) {
            return res.status(404).json({ error: 'No se encontró la mascota con el ID proporcionado.' });
        }

        if (!veterinario) {
            return res.status(404).json({ error: 'No se encontró el veterinario con el ID proporcionado.' });
        }

        // Verificar si hay una cita existente con el mismo veterinario y horario
        const citaExistente = await Cita.findOne({ veterinarioId, horario });
        if (citaExistente) {
            return res.status(400).json({ error: 'El veterinario ya tiene una cita programada en ese horario. Por favor, selecciona otro horario.' });
        }

        // Crear una nueva cita
        const nuevaCita = new Cita({
            mascotaId,
            veterinarioId,
            descripcion,
            horario,
            estado: estado || 'pendiente', // Establece estado predeterminado si no se proporciona
        });

        // Guardar la nueva cita en la base de datos
        const citaGuardada = await nuevaCita.save();

        // Responder con la cita creada
        res.status(201).json(citaGuardada);
    } catch (error) {
        console.error('Error al crear cita:', error);

        // Manejo de errores
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ error: 'Datos de cita no válidos.' });
        } else {
            res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }
};





const obtenerListaCitas = async (req, res) => {
    try {
        // Realizar una consulta para obtener todas las citas
        const citas = await Cita.find()
            .populate('mascotaId', 'nombre') // Poblamos el campo mascotaId para obtener el nombre de la mascota
            .populate('veterinarioId', 'nombre'); // Poblamos el campo veterinarioId para obtener el nombre del veterinario
        
        // Responder con la lista de citas obtenida
        res.status(200).json(citas);
    } catch (error) {
        console.error('Error al obtener la lista de citas:', error);
        
        // Manejo de errores
        res.status(500).json({ error: 'Error interno del servidor al obtener la lista de citas.' });
    }
};
module.exports = {
    crearCita,
    obtenerListaCitas,
};
