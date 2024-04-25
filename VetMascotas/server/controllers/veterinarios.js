const Veterinario = require('../models/veterinario'); 

// Función para obtener la lista de veterinarios
const obtenerVeterinarios = async (req, res) => {
    try {
        // Realiza la consulta para obtener todos los veterinarios
        const veterinarios = await Veterinario.find();

        // Si la consulta es exitosa, responde con un estado 200 y la lista de veterinarios
        res.status(200).json(veterinarios);
    } catch (error) {
        // Si hay un error, imprime el error en la consola
        console.error('Error al obtener los veterinarios:', error);

        // Responde con un estado 500 indicando un error interno del servidor
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    obtenerVeterinarios,
};
