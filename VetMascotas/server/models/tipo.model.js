// models/TipoAnimal.js
const mongoose = require('mongoose');

const TipoAnimalSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del tipo de animal es obligatorio'],
    },
}, { timestamps: true });

module.exports = mongoose.model('TipoAnimal', TipoAnimalSchema);
