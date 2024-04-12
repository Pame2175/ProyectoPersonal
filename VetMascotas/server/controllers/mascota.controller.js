// controllers/mascota.controller.js
const Mascota = require('../models/mascota.model');


// Controlador para agregar una nueva mascota
const crearMascota = async (req, res) => {
    try {
        // Crear una nueva instancia de Mascota con los datos recibidos
        const nuevaMascota = new Mascota(req.body);
        
        // Guardar la nueva mascota en la base de datos
        await nuevaMascota.save();
        
        // Enviar una respuesta de éxito
        res.status(201).json({
            message: "¡Mascota agregada exitosamente!",
            data: nuevaMascota,
        });
    } catch (error) {
        console.error("Error al agregar la mascota:", error);
        // Enviar una respuesta de error
        res.status(500).json({
            message: "Error al agregar la mascota",
            error: error.message,
        });
    }
};

module.exports = {
    crearMascota,
};
