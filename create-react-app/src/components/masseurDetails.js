import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppNavbar from './navbar';
import commerce from '../commerce';

const masseurs = [
  {
    id: 1,
    name: 'Amelia Hart',
    focus: 'Recovery & athletic performance specialist',
    bio: 'Amelia blends sports therapy with restorative breathwork to help guests reset their bodies after peak training or demanding schedules.',
  },
  {
    id: 2,
    name: 'Noah Williams',
    focus: 'Prenatal, postpartum, and lymphatic support',
    bio: 'Noah guides guests through gentle, supportive bodywork designed to relieve tension, improve circulation, and foster mindful connection.',
  },
  {
    id: 3,
    name: 'Lena Cho',
    focus: 'Mindful relaxation and aromatherapy rituals',
    bio: 'Lena curates multi-sensory journeys featuring bespoke blends, soundscapes, and energy-balancing techniques for deep tranquility.',
  },
  {
    id: 4,
    name: 'Mateo Rivera',
    focus: 'Hot stone and detoxifying therapies',
    bio: 'Mateo combines basalt stone therapies with lymphatic drainage to encourage circulation, relieve stress, and restore alignment.',
  },
];

const MasseurDetails = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const { data } = await commerce.products.list();
        if (!isMounted) return;

        setProducts(
          data.map((product) => ({
            id: product.id,
            name: product.name,
            checked: false,
          }))
        );
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCheckboxChange = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, checked: !product.checked }
          : product
      )
    );
  };

  const masseurId = parseInt(id ?? '', 10);
  const selectedMasseur = masseurs.find((masseur) => masseur.id === masseurId);

  return (
    <div className="page-shell">
      <AppNavbar />
      <main className="content-container page-section">
        {!selectedMasseur ? (
          <div className="card-surface" style={{ textAlign: 'center' }}>
            <h2 style={{ marginTop: 0 }}>Masseur not found</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>
              The therapist profile you are looking for may have been removed. Return to the full
              list to explore our team.
            </p>
            <div className="details-actions" style={{ justifyContent: 'center' }}>
              <Link to="/masseurs" className="button button-secondary">
                Back to team
              </Link>
            </div>
          </div>
        ) : (
          <div className="details-wrapper">
            <header className="page-header">
              <span className="eyebrow">Therapist profile</span>
              <h1 className="section-title" style={{ marginBottom: '0.75rem' }}>
                {selectedMasseur.name}
              </h1>
              <p>{selectedMasseur.focus}</p>
            </header>

            <section className="card-surface">
              <h2 style={{ marginTop: 0 }}>About {selectedMasseur.name.split(' ')[0]}</h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}>{selectedMasseur.bio}</p>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
                Favorite modalities include mindful breath sequencing, therapeutic stretching, and
                guided meditations tailored to each guest. Sessions always end with curated at-home
                recommendations to extend the benefits.
              </p>
            </section>

            <section className="card-surface">
              <h2 style={{ marginTop: 0 }}>Curate the perfect service</h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                Select signature treatments to pair with this therapist. Your choices sync
                automatically with the booking workflow.
              </p>
              <div className="service-options">
                {isLoading && <div>Loading services…</div>}
                {!isLoading && products.length === 0 && (
                  <p style={{ color: 'var(--color-text-muted)' }}>
                    No services are currently available. Add offerings to commerce to enable
                    personalized pairings.
                  </p>
                )}
                {!isLoading &&
                  products.map((product) => (
                    <div key={product.id} className="service-option">
                      <input
                        type="checkbox"
                        id={product.id}
                        value={product.name}
                        checked={product.checked}
                        onChange={() => handleCheckboxChange(product.id)}
                      />
                      <label htmlFor={product.id}>{product.name}</label>
                    </div>
                  ))}
              </div>
              <div className="details-actions">
                <Link to="/masseurs" className="button button-secondary">
                  Back to team
                </Link>
                <Link to={`/book/${id}`} className="button button-primary">
                  Book with {selectedMasseur.name.split(' ')[0]}
                </Link>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default MasseurDetails;
