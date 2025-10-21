import React from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from './navbar';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const masseurs = [
  { id: 1, name: 'Masseur 1', expertise: 'Deep Tissue Specialist' },
  { id: 2, name: 'Masseur 2', expertise: 'Sports Massage' },
  { id: 3, name: 'Masseur 3', expertise: 'Swedish Massage' },
];

const MasseurList = () => (
  <Container>
    <AppNavbar />
    <h1 className="text-center mt-5">Masseurs</h1>
    <Row className="mt-4">
      {masseurs.map((masseur) => (
        <Col key={masseur.id} md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>{masseur.name}</Card.Title>
              <Card.Text>{masseur.expertise}</Card.Text>
              <Link to={`/masseurs/${masseur.id}`}>View Details</Link>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
);

export default MasseurList;
