const mongoose = require('mongoose');

// Definir el esquema de la cita
const citaSchema = new mongoose.Schema({
    mascotaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mascota', // Referencia al modelo de Mascota
        required: true,
    },
    veterinarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veterinario', // Referencia al modelo de Veterinario
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
        trim: true, // Elimina espacios adicionales
    },
    horario: {
        type: String,
        required: true,
        trim: true,

    },
    estado: {
        type: String,
        enum: ['pendiente', 'en proceso', 'atendido'],
        default: 'pendiente',
    },
    propietarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mascota', // Referencia al modelo de Mascota
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Hook para actualizar la fecha de actualización antes de guardar
citaSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Crear el modelo de cita basado en el esquema
const Cita = mongoose.model('Cita', citaSchema);

// Exportar el modelo de cita
module.exports = Cita;
