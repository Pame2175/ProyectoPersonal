const mongoose = require('mongoose');

// Definir el esquema de horario del veterinario
const horarioSchema = new mongoose.Schema({
    veterinarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veterinario', // Referencia al modelo de Veterinario
        required: true,
    },
    horarios: [
        {
            dia: {
                type: String, // 0=Domingo, 1=Lunes, 2=Martes, etc.
                required: true,
            },
            horaInicio: {
                type: String, // Formato 'HH:mm' (ej. '09:00')
                required: true,
            },
            horaFin: {
                type: String, // Formato 'HH:mm' (ej. '17:00')
                required: true,
            },
        }
    ]
});

// Crear el modelo de horario basado en el esquema
const Horario = mongoose.model('Horario', horarioSchema);

// Exportar el modelo de horario
module.exports = Horario;
