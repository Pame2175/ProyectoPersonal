const Cita = require('../models/Cita');
const Mascota = require('../models/mascota.model');
const Veterinario = require('../models/veterinario');
const User = require('../models/user.model');
const mongoose = require('mongoose');
const crearCita = async (req, res) => {
    try {
        const { mascotaId, veterinarioId, descripcion, horario, estado, propietarioId } = req.body;

        // Validación de datos de entrada
        if (!mascotaId || !veterinarioId || !descripcion || !horario || !propietarioId) {
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
            propietarioId,
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
            .populate({
                path: 'mascotaId', // Poblamos la mascota asociada a la cita
                select: 'nombre propietarioId', // Seleccionamos el campo `propietarioId` y `nombre` de la mascota
                populate: {
                    path: 'propietarioId', // Poblamos el propietario de la mascota
                    model: 'User', // Modelo del propietario, cambia el nombre si es diferente
                    select: 'firstName lastName'
                }
            })
            .populate('veterinarioId', 'nombre');
        // Responder con la lista de citas obtenida
        res.status(200).json(citas);
    } catch (error) {
        console.error('Error al obtener la lista de citas:', error);

        // Manejo de errores
        res.status(500).json({ error: 'Error interno del servidor al obtener la lista de citas.' });
    }
};

const editarCita = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de la cita desde la URL
        const { estado } = req.body; // Obtener el nuevo estado del cuerpo de la solicitud

        // Validación del estado
        const estadosPermitidos = ['pendiente', 'en proceso', 'atendido'];
        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({ error: `El estado debe ser uno de los siguientes: ${estadosPermitidos.join(', ')}.` });
        }

        // Buscar la cita por su ID
        const cita = await Cita.findById(id);
        if (!cita) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        // Actualizar el estado de la cita
        cita.estado = estado;

        // Guardar los cambios en la base de datos
        await cita.save();

        // Responder con la cita actualizada
        res.status(200).json(cita);
    } catch (error) {
        console.error('Error al editar la cita:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};





// Controlador para obtener una cita por ID
const obtenerCitaPorId = async (req, res) => {
    try {
        const { id } = req.params; // Obtiene el ID de la cita de los parámetros de la solicitud

        // Busca la cita por ID en la base de datos
        const cita = await Cita.findById(id)
            .populate({
                path: 'mascotaId',
                select: 'nombre propietarioId',
                populate: {
                    path: 'propietarioId',
                    model: 'User',
                    select: 'firstName lastName'
                }
            })
            .populate('veterinarioId', 'nombre');

        // Verifica si la cita existe
        if (!cita) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        // Envía la cita encontrada como respuesta
        res.json(cita);
    } catch (error) {
        console.error('Error al obtener la cita por ID:', error);

        // Manejo de errores
        res.status(500).json({ error: 'Error interno del servidor al obtener la cita.' });
    }
};
const eliminarCita = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de la cita desde la URL

        // Buscar la cita por su ID y eliminarla
        const citaEliminada = await Cita.findByIdAndDelete(id);

        // Verificar si la cita fue encontrada y eliminada
        if (!citaEliminada) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        // Responder con la cita eliminada
        res.status(200).json({ message: 'Cita eliminada correctamente', cita: citaEliminada });
    } catch (error) {
        console.error('Error al eliminar la cita:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar la cita.' });
    }
};



module.exports = {
    crearCita,
    obtenerListaCitas,
    editarCita,
    obtenerCitaPorId,
    eliminarCita,
};
