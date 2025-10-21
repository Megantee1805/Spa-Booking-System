import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from './navbar';
import commerce from '../commerce';

const serviceIcons = ['💆‍♀️', '🌺', '🕯️', '🌊', '🌿'];

const MassageServicePage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await commerce.products.list();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="page-shell">
      <AppNavbar />
      <main className="content-container page-section">
        <header className="page-header">
          <span className="eyebrow">Signature Treatments</span>
          <h1 className="section-title">Massage Services</h1>
          <p>
            Discover curated experiences that blend ancient wisdom with modern recovery science.
            Each treatment is crafted to leave guests feeling renewed and radiant.
          </p>
        </header>

        <div className="service-grid">
          {isLoading && <div className="card-surface">Loading services…</div>}

          {!isLoading && products.length === 0 && (
            <div className="card-surface">
              <h3 style={{ marginTop: 0 }}>No services available just yet</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                Add treatments to your commerce catalogue to bring this page to life. Guests will be
                able to explore offerings, discover add-ons, and book instantly.
              </p>
            </div>
          )}

          {!isLoading &&
            products.map((product, index) => (
              <article key={product.id} className="card-surface service-card">
                <div className="service-icon" aria-hidden="true">
                  {serviceIcons[index % serviceIcons.length]}
                </div>
                <h3 style={{ margin: 0 }}>{product.name}</h3>
                {product.description && (
                  <p dangerouslySetInnerHTML={{ __html: product.description }} />
                )}
                <footer>
                  <Link to={`/info/${product.permalink}`}>View full experience</Link>
                </footer>
              </article>
            ))}
        </div>
      </main>
    </div>
  );
};

export default MassageServicePage;
