import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AppNavbar = () => {
  return (
    <Navbar expand="lg" className="navbar-surface" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          TranquilFlow Spa CRM
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="primary-navigation" />
        <Navbar.Collapse id="primary-navigation">
          <Nav className="me-auto align-items-lg-center">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/masseurs">
              Masseurs
            </Nav.Link>
            <Nav.Link as={NavLink} to="/services">
              Services
            </Nav.Link>
            <Nav.Link as={NavLink} to="/memberships">
              Memberships
            </Nav.Link>
            <Nav.Link as={NavLink} to="/billing">
              Billing
            </Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
          </Nav>
          <div className="nav-actions">
            <Button as={Link} to="/login" variant="outline-light" size="sm" className="nav-btn">
              Log in
            </Button>
            <Button as={Link} to="/register" variant="light" size="sm" className="nav-btn nav-btn-accent">
              Create account
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
