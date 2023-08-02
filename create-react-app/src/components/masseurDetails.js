import { BrowserRouter as Router, Route, Routes, Link, BrowserRouter, useParams } from 'react-router-dom';
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

const MasseurDetails = ({ match }) => {
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
                checked={product.checked}
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

export default MasseurDetails