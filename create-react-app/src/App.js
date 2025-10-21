import './App.css';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/landingPage';
import MasseurDetails from './components/masseurDetails';
import SpaScheduler from './components/spaScheduler';
import { Analytics } from '@vercel/analytics/react';
import MassageServicePage from './components/massageServicePage';
import Login from './components/loginPage';
import Signup from './components/signUp';
import MasseurList from './components/masseurList';

const App = () => {
  return (
    <div className='App'>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/masseurs/:id" element={<MasseurDetails />} />
        <Route path="/book/:id" element={<SpaScheduler />} />
        <Route path="/services" element={<MassageServicePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/masseurs" element={<MasseurList />} />
      </Routes>
      <Analytics />
    </div>
  );
};

export default App;