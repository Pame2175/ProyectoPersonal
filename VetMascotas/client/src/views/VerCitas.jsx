import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import UserContext from "../context/UserContext";
import { Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css"; // Importa los estilos de Bootstrap

const ListaCitas = () => {
    const { user } = useContext(UserContext);
    const [citas, setCitas] = useState([]);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Estado para manejar el filtro de búsqueda
    const [buscar, setBuscar] = useState("");
    const [citasFiltradas, setCitasFiltradas] = useState([]);

    // Carga las citas desde el endpoint de la API
    const cargarCitas = async () => {
        try {
            let response;
            if (user.role === 'admin') {
                response = await axios.get("http://localhost:8000/api/mascota/cita/lista");
            } else {
                response = await axios.get("http://localhost:8000/api/mascota/cita/lista");
                const mascotasCita = response.data;
                const citasFiltradas = mascotasCita.filter((mascota) => mascota.propietarioId === user._id);
                response.data = citasFiltradas;
            }
            setCitas(response.data);
        } catch (error) {
            console.error("Error al cargar la lista de citas:", error);
            setError("Hubo un problema al cargar la lista de citas.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarCitas();
    }, [user._id]);

    // Actualizar las citas filtradas cuando cambie la búsqueda o las citas
    useEffect(() => {
        const resultadosFiltrados = citas.filter((cita) =>
            // Filtrar por la búsqueda en los campos Mascota, Veterinario, Descripción, Horario, y Estado
            cita.mascotaId.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
            cita.veterinarioId.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
            cita.descripcion.toLowerCase().includes(buscar.toLowerCase()) ||
            cita.horario.toLowerCase().includes(buscar.toLowerCase()) ||
            cita.estado.toLowerCase().includes(buscar.toLowerCase())
        );

        setCitasFiltradas(resultadosFiltrados);
    }, [buscar, citas]);

    // Función para abrir el modal con los detalles de la cita
    const verDetalleCita = (cita) => {
        setCitaSeleccionada(cita);
        setShowModal(true);
    };

    // Función para cerrar el modal
    const cerrarDetalleCita = () => {
        setShowModal(false);
        setCitaSeleccionada(null);
    };

    // Función para generar un PDF con la lista completa de citas
    const generarPDFListaCitas = () => {
        const doc = new jsPDF();

        // Configuración general del documento
        doc.setFontSize(16);
        doc.text("Lista de Citas", 10, 10);

        // Configuración de la tabla de citas
        const headers = [["Mascota", "Veterinario", "Descripción", "Horario", "Estado"]];
        const rows = citas.map((cita) => [
            cita.mascotaId.nombre,
            cita.veterinarioId.nombre,
            cita.descripcion,
            cita.horario,
            cita.estado,
        ]);

        // Insertar la tabla de citas
        doc.autoTable({
            startY: 20,
            head: headers,
            body: rows,
            theme: "striped",
            headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
            bodyStyles: { textColor: [0, 0, 0] },
            alternateRowStyles: { fillColor: [250, 250, 250] },
        });

        // Guarda el archivo PDF
        doc.save("lista_citas.pdf");
    };

    // Definición de columnas para la tabla interactiva
    const columns = [
        { name: "Mascota", selector: (row) => row.mascotaId.nombre, sortable: true },
        { name: "Veterinario", selector: (row) => row.veterinarioId.nombre, sortable: true },
        { name: "Descripción", selector: (row) => row.descripcion, sortable: true },
        { name: "Horario", selector: (row) => row.horario, sortable: true },
        { name: "Estado", selector: (row) => row.estado, sortable: true },
        {
            name: "Acciones",
            cell: (row) => (
                <div className="d-flex">
                    {user.role === 'admin' && (
                        <Link
                            to={`/mascota/cita/edit/${row._id}`}
                            className="btn btn-outline-success btn-sm me-2"
                        >
                            Editar
                        </Link>
                    )}
                    <button
                        className="btn btn-outline-info btn-sm me-2"
                        onClick={() => verDetalleCita(row)}
                    >
                        Ver detalles
                    </button>
                    {user.role === 'user' && (
                        <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => eliminarCita(row._id)}
                        >
                            Eliminar
                        </button>
                    )}
                </div>
            ),
        },
    ];

    // Definición de estilos condicionales para las filas de la tabla
    const conditionalRowStyles = [
        {
            when: row => row.estado === "atendido",
            style: {
                backgroundColor: "#d4edda", // Verde claro para Atendido
            },
        },
        {
            when: row => row.estado === "pendiente",
            style: {
                backgroundColor: "#fff3cd", // Amarillo claro para Pendiente
            },
        },
        {
            when: row => row.estado === "en proceso",
            style: {
                backgroundColor: "#ffe7c3", // Naranja claro para En proceso
            },
        },
    ];

   // Función para eliminar una cita
const eliminarCita = async (id) => {
    try {
        const confirmacion = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede revertir.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (confirmacion.isConfirmed) {
            await axios.delete(`http://localhost:8000/api/mascota/cita/delete/${id}`);
            cargarCitas();
            Swal.fire(
                '¡Eliminado!',
                'La cita ha sido eliminada correctamente.',
                'success'
            );
        }
    } catch (error) {
        console.error("Error al eliminar la cita:", error);
        setError("Hubo un problema al eliminar la cita.");
        Swal.fire(
            'Error',
            'Hubo un problema al eliminar la cita. Por favor, inténtalo de nuevo más tarde.',
            'error'
        );
    }
};


    return (
        <div className="container">
            <h1>Lista de Citas</h1>
            {cargando && <p>Cargando...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!cargando && !error && (
                <>
                    {/* Barra de búsqueda */}
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Buscar..."
                        value={buscar}
                        onChange={(e) => setBuscar(e.target.value)}
                    />

                    {/* DataTable para mostrar la lista de citas */}
                    <DataTable
                        title="Lista de Citas"
                        columns={columns}
                        data={citasFiltradas}
                        pagination
                        highlightOnHover
                        pointerOnHover
                        conditionalRowStyles={conditionalRowStyles}
                    />

                    <button onClick={generarPDFListaCitas} className="btn btn-outline-info mt-3">
                        Descargar PDF
                    </button>

                    {/* Modal de Bootstrap para mostrar los detalles de la cita */}
                    <Modal show={showModal} onHide={cerrarDetalleCita}>
                        <Modal.Header closeButton>
                            <Modal.Title>Detalles de la Cita</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {citaSeleccionada && (
                                <div>
                                    <p><strong>Mascota:</strong> {citaSeleccionada.mascotaId.nombre}</p>
                                    <p><strong>Veterinario:</strong> {citaSeleccionada.veterinarioId.nombre}</p>
                                    <p><strong>Propietario:</strong> {citaSeleccionada.mascotaId.propietarioId ? `${citaSeleccionada.mascotaId.propietarioId.firstName} ${citaSeleccionada.mascotaId.propietarioId.lastName}` : 'Desconocido'}</p>
                                    <p><strong>Descripción:</strong> {citaSeleccionada.descripcion}</p>
                                    <p><strong>Horario:</strong> {citaSeleccionada.horario}</p>
                                    <p><strong>Estado:</strong> {citaSeleccionada.estado}</p>
                                   
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={cerrarDetalleCita}
                            >
                                Cerrar
                            </button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default ListaCitas;
