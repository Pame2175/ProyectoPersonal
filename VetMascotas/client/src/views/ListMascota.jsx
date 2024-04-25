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
                let response = await axios.get("http://localhost:8000/api/mascota/lista");
                if (user.role === "admin") {
                    setMascotas(response.data);
                    
                    return;
                } else {
                    const mascotasData = response.data;
                    
                    const mascotasFiltradas = mascotasData.filter((mascota) => mascota.propietarioId === user._id);
                    setMascotas(mascotasFiltradas);
                    return;
                }
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

            // Datos de la mascota
            const data = [
                ["Tipo de Animal", mascota.tipoAnimalId.nombre],
                ["Raza", mascota.razaId.nombre],
                ["Género", mascota.genero],
                ["Color", mascota.color],
                ["Tamaño", mascota.tamaño],
                ["Microchip", mascota.microchip],
                ["Condiciones Médicas", mascota.condicionesMedicas]
            ];

            // Agregar tabla con los datos de la mascota
            doc.autoTable({
                startY: 20,
                head: [["Campo", "Valor"]],
                body: data,
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

            // Guardar el archivo PDF
            doc.save(`mascota_${mascota.nombre}.pdf`);
        };

        // Función para generar un PDF con la lista completa de mascotas
        const generarPDFListaMascotas = () => {
            const doc = new jsPDF();

            // Configuración general del documento
            doc.setFontSize(16);
            doc.text("Lista de Mascotas", 10, 10);

            // Configuración de las columnas
            const columnWidths = [60, 60, 60, 60]; // Ancho de cada columna
            const columnHeaders = ["Nombre", "Tipo de Animal", "Raza", "Propietario"]; // Encabezados de columna

            // Agregar tabla con los datos de las mascotas
            doc.autoTable({
                startY: 20,
                head: [columnHeaders],
                body: mascotas.map(mascota => [
                    mascota.nombre,
                    mascota.tipoAnimalId.nombre,
                    mascota.razaId.nombre,
                    
                ]),
                columnStyles: { 0: { columnWidth: 60 } }, // Ajustar el ancho de la primera columna
                theme: "striped",
                headStyles: { fillColor: [72, 133, 237], textColor: [255, 255, 255] }, // Estilos para el encabezado
                bodyStyles: { textColor: [0, 0, 0] }, // Estilos para el cuerpo
                alternateRowStyles: { fillColor: [242, 242, 242] } // Estilos para filas alternas
            });

            // Guardar el archivo PDF
            doc.save("lista_mascotas.pdf");
        };

        return (
            <div className="container">
                <h1>Lista de Mascotas</h1>
                {cargando && <p>Cargando...</p>}
                {error && <p className="text-danger">{error}</p>}
                {!cargando && !error && (
                    <>
                        {/* Muestra la lista de mascotas */}
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
                        {user.role === 'admin' && (
                            <button onClick={generarPDFListaMascotas} className="btn btn-outline-info mt-3">
                                PDF de la Lista Completa
                            </button>
                        )}
                    </>
                )}
            </div>
        );
    };

    export default ListaMascotas;
