import { Link, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import React, { useState, useEffect } from 'react';
import commerce from '../commerce';

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

const MasseurDetails = () => {
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const handleCheckboxChange = (productId) => {
    const updatedOptions = products.map((product) =>
      product.id === productId ? { ...product, checked: !product.checked } : product
    );
    setProducts(updatedOptions);
  };


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

  const masseurId = parseInt(id, 10);
  const selectedMasseur = masseurs.find((masseur) => masseur.id === masseurId);

  return (
    <MainContainer>
      <Header>Masseur Details</Header>
      {selectedMasseur ? (
        <div>
          <h2>{selectedMasseur.name}</h2>
          <h2>Services Offered</h2>
          {products.map((product) => (
            <div key={product.id}>
              <input
                type="checkbox"
                id={product.id}
                value={product.name}
                checked={Boolean(product.checked)}
                onChange={() => handleCheckboxChange(product.id)}
              />
              <label htmlFor={product.id}>{product.name}</label>
            </div>
          ))}
          {/* Add more details about the masseur here */}
        </div>
      ) : (
        <h2>Masseur not found.</h2>
      )}
      <Link to="/">Back to Home</Link>
      <br></br>
      <Link to={`/book/${id}`}> Book</Link>
    </MainContainer>
  );
};

export default MasseurDetails;
