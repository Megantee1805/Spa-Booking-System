import React from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from './navbar';

const masseurs = [
  { id: 1, name: 'Amelia Hart', expertise: 'Deep tissue · Sports recovery' },
  { id: 2, name: 'Noah Williams', expertise: 'Prenatal care · Reflexology' },
  { id: 3, name: 'Lena Cho', expertise: 'Aromatherapy · Mindful massage' },
  { id: 4, name: 'Mateo Rivera', expertise: 'Hot stone · Lymphatic drainage' },
];

const MasseurList = () => (
  <div className="page-shell">
    <AppNavbar />
    <main className="content-container page-section">
      <header className="page-header">
        <span className="eyebrow">Meet the artisans</span>
        <h1 className="section-title">Our dedicated therapists</h1>
        <p>
          Each professional is hand-selected for their craft, empathy, and commitment to holistic
          wellness. Explore specialties to find the perfect match for your guests.
        </p>
      </header>
      <div className="masseur-grid">
        {masseurs.map((masseur) => (
          <article key={masseur.id} className="card-surface masseur-card">
            <h3>{masseur.name}</h3>
            <span>{masseur.expertise}</span>
            <Link to={`/masseurs/${masseur.id}`}>View full profile</Link>
          </article>
        ))}
      </div>
    </main>
  </div>
);

export default MasseurList;
