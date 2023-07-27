import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, BrowserRouter } from 'react-router-dom';
import styled from '@emotion/styled';

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

const masseurs = [
  { id: 1, name: 'Masseur 1' },
  { id: 2, name: 'Masseur 2' },
  { id: 3, name: 'Masseur 3' },
];

const LandingPage = () => {
  return (
    <MainContainer>
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

const MasseurDetails = ({ match }) => {
  const masseurId = parseInt(match.params.id, 10);
  const selectedMasseur = masseurs.find((masseur) => masseur.id === masseurId);

  return (
    <MainContainer>
      <Header>Masseur Details</Header>
      {selectedMasseur ? (
        <div>
          <h2>{selectedMasseur.name}</h2>
          {/* Add more details about the masseur here */}
        </div>
      ) : (
        <h2>Masseur not found.</h2>
      )}
      <Link to="/">Back to Home</Link>
    </MainContainer>
  );
};

const App = () => {
  return (
    <div className='App'>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/masseurs/:id" element={<MasseurDetails />} />
      </Routes>
    </div>
  );
};

export default App;