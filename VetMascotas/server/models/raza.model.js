// models/Raza.js
const mongoose = require('mongoose');

const RazaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la raza es obligatorio'],
    },
    tipoAnimalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoAnimal',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Raza', RazaSchema);
