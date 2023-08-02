import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, BrowserRouter } from 'react-router-dom';
import styled from '@emotion/styled';
import { useParams } from "react-router-dom";
import LandingPage from './components/landingpage';
import MasseurDetails from './components/masseurDetails';
import SpaScheduler from './components/spaScheduler';
import { Analytics } from '@vercel/analytics/react';
import MassageServicePage from './components/massageServicePage';

// app.js (or index.js)

// Rest of your application code

const App = () => {
  return (
    <div className='App'>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/masseurs/:id" element={<MasseurDetails />} />
        <Route path="/book/:id" element={<SpaScheduler />} />
        <Route path="/services" element={<MassageServicePage />} />
      </Routes>
      <Analytics />
    </div>
  );
};

export default App;