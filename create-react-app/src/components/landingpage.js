import { BrowserRouter as Router, Route, Routes, Link, BrowserRouter } from 'react-router-dom';
import styled from '@emotion/styled';
import { useParams } from "react-router-dom";
import { MasseurDetails } from './masseurDetails'; 
import AppNavbar from './navbar';

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

const LandingPage = () => {
    return (
      <MainContainer>
        <AppNavbar></AppNavbar>
        <Header>Welcome to our Spa</Header>
        <h2>Please pick your masseur:</h2>
        {masseurs.map((masseur) => (
          <Link key={masseur.id} to={`/masseurs/${masseur.id}`}>
            <MasseurCard>{masseur.name}</MasseurCard>
          </Link>
        ))}
      </MainContainer>
    );
  };
  
  export default LandingPage