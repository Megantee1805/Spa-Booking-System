// src/MassageServicePage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import commerce from '../commerce';

const MassageServicePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await commerce.products.list();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div>
      <h1>Massage Services</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link to={`/info/${product.permalink}`}>{product.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MassageServicePage;
