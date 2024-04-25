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


// Controlador para obtener los datos de una mascota específica por su ID
const obtenerMascota = async (req, res) => {
    try {
        // Consulta para obtener todas las mascotas, poblando los campos de tipo de animal, raza, y vacunaciones.
        const mascotas = await Mascota.find()
       
        
            
            .populate('razaId', 'nombre') // Pobla el campo 'nombre' de la raza
            .populate('tipoAnimalId', 'nombre')
           
           // Pobla el campo 'propietarioId' con todos los datos del propietario

            .populate({
                path: 'vacunaciones',
                populate: {
                    path: 'vacunaId', // Pobla el campo 'vacunaId' dentro de 'vacunaciones'
                    select: 'nombre', // Obtén solo el nombre de la vacuna
                }
            })
            ; 

            
           
        
        res.status(200).json(mascotas);
    } catch (error) {
        console.error("Error al obtener las mascotas:", error);
        // Envía una respuesta de error
        res.status(500).json({
            message: "Error al obtener las mascotas",
            error: error.message,
        });
    }
};
// Controlador para obtener los datos de una mascota específica
const obtenerMascotaPorId = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de la mascota desde los parámetros de la URL
        const mascota = await Mascota.findById(id).populate('tipoAnimalId razaId vacunaciones.vacunaId');

        if (!mascota) {
            // Si la mascota no se encuentra, devuelve un error 404
            return res.status(404).json({ mensaje: 'Mascota no encontrada' });
        }

        // Devuelve la mascota encontrada como respuesta JSON
        return res.json(mascota);
    } catch (error) {
        console.error('Error al obtener los datos de la mascota:', error);
        // En caso de error, devuelve un error 500
        return res.status(500).json({ mensaje: 'Hubo un problema al obtener los datos de la mascota' });
    }
};

// Controlador para editar los datos de una mascota
const editarMascota = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de la mascota desde los parámetros de la URL
        const datosActualizados = req.body; // Obtener los datos actualizados del cuerpo de la solicitud

        // Actualizar la mascota en la base de datos
        const mascotaActualizada = await Mascota.findByIdAndUpdate(
            id,
            datosActualizados,
            { new: true } // Esta opción devuelve la mascota actualizada en lugar de la antigua
        );

        if (!mascotaActualizada) {
            // Si la mascota no se encuentra, devuelve un error 404
            return res.status(404).json({ mensaje: 'Mascota no encontrada' });
        }

        // Devuelve la mascota actualizada como respuesta JSON
        return res.json(mascotaActualizada);
    } catch (error) {
        console.error('Error al editar los datos de la mascota:', error);
        // En caso de error, devuelve un error 500
        return res.status(500).json({ mensaje: 'Hubo un problema al editar los datos de la mascota' });
    }
};

module.exports = {
    crearMascota,
    obtenerMascota,
    obtenerMascotaPorId,
    editarMascota,
};
