import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import UserContext from '../context/UserContext';
import { useContext } from "react";

const ListaMascotas = () => {
    const { user } = useContext(UserContext);
    const [mascotas, setMascotas] = useState([]);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(true);

    const cargarMascotas = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/mascota/lista");
            const mascotasData = response.data;

            // Filtra las mascotas para mostrar solo aquellas cuyo propietario coincide con el _id del usuario actual
            const mascotasFiltradas = mascotasData.filter((mascota) => mascota.propietarioId === user._id);

            setMascotas(mascotasFiltradas);
        } catch (error) {
            console.error("Error al cargar la lista de mascotas:", error);
            setError("Hubo un problema al cargar la lista de mascotas.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarMascotas();
    }, []);

    // Función para generar un PDF con los datos de una mascota específica
    const generarPDFMascota = (mascota) => {
        const doc = new jsPDF();

        // Configuración general del documento
        doc.setFontSize(16);
        doc.text(`Ficha de Mascota: ${mascota.nombre}`, 10, 10);

        // Tabla de información de la mascota
        const data = [
            { campo: "Tipo de Animal", valor: mascota.tipoAnimalId.nombre },
            { campo: "Raza", valor: mascota.razaId.nombre },
            { campo: "Propietario", valor: mascota.propietario },
            { campo: "Género", valor: mascota.genero },
            { campo: "Color", valor: mascota.color },
            { campo: "Tamaño", valor: mascota.tamaño },
            { campo: "Microchip", valor: mascota.microchip },
            { campo: "Condiciones Médicas", valor: mascota.condicionesMedicas }
        ];

        doc.autoTable({
            startY: 20,
            head: [["Campo", "Valor"]],
            body: data.map((d) => [d.campo, d.valor]),
            theme: "striped",
            headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
            bodyStyles: { textColor: [0, 0, 0] },
            alternateRowStyles: { fillColor: [250, 250, 250] }
        });

        // Tabla de vacunaciones de la mascota
        if (mascota.vacunaciones && mascota.vacunaciones.length > 0) {
            const vacunacionesData = mascota.vacunaciones.map((vacunacion, index) => [
                index + 1,
                vacunacion.vacunaId.nombre,
                vacunacion.fechaAdministracion
            ]);

            doc.autoTable({
                startY: doc.lastAutoTable.finalY + 10,
                head: [["#", "Vacuna", "Fecha de Administración"]],
                body: vacunacionesData,
                theme: "striped",
                headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
                bodyStyles: { textColor: [0, 0, 0] },
                alternateRowStyles: { fillColor: [250, 250, 250] }
            });
        }

        // Guarda el archivo PDF
        doc.save(`mascota_${mascota.nombre}.pdf`);
    };

    // Función para generar un PDF con la lista completa de mascotas
    const generarPDFListaMascotas = () => {
        const doc = new jsPDF();

        // Configuración general del documento
        doc.setFontSize(16);
        doc.text("Lista de Mascotas", 10, 10);

        // Configuración de la tabla de mascotas
        const headers = [["Nombre", "Tipo de Animal", "Raza", "Propietario"]];
        const rows = mascotas.map((mascota) => [
            mascota.nombre,
            mascota.tipoAnimalId.nombre,
            mascota.razaId.nombre,
            mascota.propietario
        ]);

        // Insertar la tabla de mascotas
        doc.autoTable({
            startY: 20,
            head: headers,
            body: rows,
            theme: "striped",
            headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
            bodyStyles: { textColor: [0, 0, 0] },
            alternateRowStyles: { fillColor: [250, 250, 250] }
        });

        // Guarda el archivo PDF
        doc.save("lista_mascotas.pdf");
    };

    return (
        <div className="container">
            <h1>Lista de Mascotas</h1>
            {cargando && <p>Cargando...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!cargando && !error && (
                <>
                    {/* Muestra la lista de mascotas como tarjetas */}
                    <div className="row">
                        {mascotas.map((mascota) => (
                            <div key={mascota._id} className="col-md-4 mb-3">
                                {/* Tarjeta para cada mascota */}
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h5 className="card-title">{mascota.nombre}</h5>
                                        <p className="card-text">
                                            <strong>Tipo de Animal:</strong> {mascota.tipoAnimalId.nombre}<br />
                                            <strong>Raza:</strong> {mascota.razaId.nombre}
                                        </p>
                                    </div>
                                    <div className="card-footer">
                                        {/* Botones de acciones */}
                                        <Link
                                            to={`/mascota/editar/${mascota._id}`}
                                            className="btn btn-outline-success btn-sm me-2"
                                        >
                                            Editar
                                        </Link>
                                        {/* Agendar cita */}
                                        <Link
                                            to={`/mascota/cita/${mascota._id}`}
                                            className="btn btn-outline-warning btn-sm me-2"
                                        >
                                            Agendar Cita
                                        </Link>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                        // Lógica de eliminación aquí
                                        >
                                            Eliminar
                                        </button>
                                        {/* Botón para descargar PDF de la mascota */}
                                        <button
                                            onClick={() => generarPDFMascota(mascota)}
                                            className="btn btn-outline-info btn-sm ms-2"
                                        >
                                            PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Botón para descargar la lista completa de mascotas en PDF */}
                    <button onClick={generarPDFListaMascotas} className="btn btn-outline-info mt-3">
                        PDF de la Lista Completa
                    </button>
                </>
            )}
        </div>
    );
};

export default ListaMascotas;
