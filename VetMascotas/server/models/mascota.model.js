const mongoose = require('mongoose');

// Define el esquema para las vacunaciones de la mascota
const VacunacionMascotaSchema = new mongoose.Schema({
    vacunaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vacuna',
        required: true,
    },
    fechaAdministracion: {
        type: Date,
        required: true,
    },
}, { _id: false });

// Define el esquema para las mascotas
const MascotaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la mascota es obligatorio'],
    },
    tipoAnimalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoAnimal',
        required: true,
    },
    razaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Raza',
        required: true,
    },
    edad: {
        type: Number,
        required: [true, 'La edad de la mascota es obligatoria'],
    },
    fechaNacimiento: {
        type: Date,
    },
    genero: {
        type: String,
    },
    color: {
        type: String,
    },
    tamaño: {
        type: String,
    },
    microchip: {
        type: String,
    },
    vacunaciones: [VacunacionMascotaSchema],
    condicionesMedicas: {
        type: String,
    },
    // Campo para el ID del propietario
    propietarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    imagen: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Mascota', MascotaSchema);
