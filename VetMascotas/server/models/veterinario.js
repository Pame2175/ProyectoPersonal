const mongoose = require('mongoose');

// Definir el esquema de Veterinario
const veterinarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    especialidad: {
        type: String,
        required: true,
        trim: true,
    },
    contacto: {
        telefono: {
            type: String,
            required: true,
            match: /^\d{10}$/, // Asegura que el teléfono sea un número de 10 dígitos
        },
        email: {
            type: String,
            required: true,
            match: /^\S+@\S+\.\S+$/, // Valida la dirección de correo electrónico
        }
    },
    experiencia: {
        type: Number,
        required: true,
        min: 0,
        max: 40, // Establece un rango razonable para los años de experiencia
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

// Hook pre-save para actualizar la fecha de actualización
veterinarioSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Crear y exportar el modelo de Veterinario
const Veterinario = mongoose.model('Veterinario', veterinarioSchema);
module.exports = Veterinario;
