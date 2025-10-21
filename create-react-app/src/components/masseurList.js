import { BrowserRouter as Router, Route, Routes, Link, BrowserRouter } from 'react-router-dom';
import styled from '@emotion/styled';
import { useParams } from "react-router-dom";
import { MasseurDetails } from './masseurDetails'; 
import AppNavbar from './navbar';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const masseurs = [
  { id: 1, name: 'Masseur 1' },
  { id: 2, name: 'Masseur 2' },
  { id: 3, name: 'Masseur 3' },
];

const MainContainer = styled.div`
  text-align: center;
  padding: 40px;
`;

const Header = styled.h1`
  font-size: 36px;
  margin-bottom: 20px;
`;

const MasseurCard = styled.div`
  background-color: #f2f2f2;
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
  display: inline-block;
  width: 200px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const MasseurList = () => {
    return (
      <Container>
      <AppNavbar/>
      <h1 className="text-center mt-5">Masseurs</h1>
      <Row className="mt-4">
        {masseurs.map((masseur) => (
          <Col key={masseur.id} md={4} className="mb-4">
            <Card>
              {/* <Card.Img variant="top" src={require(`../../public/${masseur.image}`).default} /> */}
              <Card.Body>
                <Card.Title>{masseur.name}</Card.Title>
                <Card.Text>{masseur.expertise}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
    );
  };
  
  export default MasseurList