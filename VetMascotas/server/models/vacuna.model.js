// models/Vacuna.js
const mongoose = require('mongoose');

const VacunaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la vacuna es obligatorio'],
    },
    tipoAnimalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoAnimal',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Vacuna', VacunaSchema);
