import React from 'react';
import { Carousel, Card, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Importar imágenes locales
import imagen1 from '../img/perro2.jpg';
import imagen2 from '../img/gato.jpg';
import imagen3 from '../img/perro.jpg';


const VeterinariaInfo = () => {
    // Lista de imágenes
    const imagenesPerros = [imagen1, imagen2, imagen3];

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Información de Veterinaria</h1>

            {/* Carrusel de imágenes */}
            <Carousel interval={3000} style={{ maxWidth: '800px', margin: '0 auto' }}>
                {imagenesPerros.map((imagen, index) => (
                    <Carousel.Item key={index}>
                        <img
                            className="d-block w-100"
                            src={imagen}
                            alt={`Perro ${index + 1}`}
                            style={{
                                height: '300px', // Controla la altura del carrusel
                                objectFit: 'contain' // Usa contain para ajustar la imagen
                            }}
                        />
                        <Carousel.Caption>
                            
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>

            {/* Sección de información */}
            <div className="mt-5">
                <Row>
                    <Col md={6}>
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Title>Servicios de Veterinaria</Card.Title>
                                <Card.Text>
                                    Nuestra veterinaria ofrece una variedad de servicios para cuidar de sus mascotas, incluyendo:
                                    <ul>
                                        <li>Consultas generales</li>
                                        <li>Vacunaciones</li>
                                        <li>Cirugías menores</li>
                                        <li>Odontología</li>
                                        <li>Urgencias</li>
                                    </ul>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Title>Consejos para cuidar de tu perro</Card.Title>
                                <Card.Text>
                                    Algunos consejos útiles para cuidar de tu perro:
                                    <ul>
                                        <li>Mantén al día las vacunaciones.</li>
                                        <li>Dale una dieta balanceada.</li>
                                        <li>Ofrece suficiente ejercicio diario.</li>
                                        <li>Visita al veterinario regularmente.</li>
                                        <li>Presta atención a su higiene.</li>
                                    </ul>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default VeterinariaInfo;
