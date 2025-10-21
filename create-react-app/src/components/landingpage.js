import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from './navbar';

const LandingPage = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Online Spa CRM</h1>
        <p>Your One-Stop Solution for Managing Your Spa Business</p>
      </header>
      <section className="features">
        <Container>
          <Row>
            <Col md={3} className="feature">
              <h2>Appointment Management</h2>
              <p>Effortlessly schedule and manage appointments for your clients.</p>
            </Col>
            <Col md={3} className="feature">
              <h2>Client Profiles</h2>
              <p>Keep detailed records of your clients, preferences, and history.</p>
            </Col>
            <Col md={3} className="feature">
              <h2>Staff Management</h2>
              <p>Organize your spa staff, schedules, and assignments.</p>
            </Col>
            <Col md={3} className="feature">
              <h2>Staff Progression</h2>
              <p>Help your staff grow, get better rates, provide personalized care.</p>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="cta">
        <Container>
          <h2>Ready to Transform Your Spa Business?</h2>
          <p>Join us and experience the power of our online spa CRM.</p>
          <Button variant="primary" size="lg">Get Started</Button>
        </Container>
      </section>
      <footer className="footer">
        <Container>
          <p>&copy; 2023 Online Spa CRM. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;
