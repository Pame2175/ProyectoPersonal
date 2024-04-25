const Horario = require('../models/horario_veterinario');

// Controlador para agregar un nuevo horario disponible para un veterinario
const agregarHorario = async (req, res) => {
    try {
        const { veterinarioId, dia, horaInicio, horaFin } = req.body;
        const nuevoHorario = new Horario({
            veterinarioId,
            dia,
            horaInicio,
            horaFin,
        });
        await nuevoHorario.save();
        res.status(201).json(nuevoHorario);
    } catch (error) {
        console.error('Error al crear horario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// Controlador para actualizar un horario existente
const actualizarHorario = async (req, res) => {
    try {
        const { id } = req.params;
        const { dia, horaInicio, horaFin } = req.body;
        const horarioActualizado = await Horario.findByIdAndUpdate(
            id,
            { dia, horaInicio, horaFin },
            { new: true }
        );
        res.status(200).json(horarioActualizado);
    } catch (error) {
        console.error('Error al actualizar horario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// Controlador para eliminar un horario existente
const eliminarHorario = async (req, res) => {
    try {
        const { id } = req.params;
        await Horario.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar horario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};


const obtenerHorarios = async (req, res) => {
    try {
        // Obtener el ID del veterinario de los parámetros de la URL
        const veterinarioId = req.params.veterinarioId;

        // Buscar los horarios asociados al veterinarioId y seleccionar solo el campo 'horarios'
        const horario = await Horario.findOne({ veterinarioId }).select('horarios');

        // Verificar si se encontraron horarios
        if (!horario) {
            // Si no se encontraron horarios, enviar un mensaje indicando que no se encontraron
            return res.status(404).json({ mensaje: 'No se encontraron horarios para este veterinario.' });
        }

        // Si se encontraron horarios, enviar solo el campo 'horarios' como respuesta
        return res.json(horario.horarios);
    } catch (error) {
       
        console.error('Error al obtener horarios por veterinario:', error);
        return res.status(500).json({ mensaje: 'Error al obtener horarios. Intente nuevamente más tarde.' });
    }
};



module.exports = {
    agregarHorario,
    actualizarHorario,
    eliminarHorario,
    obtenerHorarios,
};
