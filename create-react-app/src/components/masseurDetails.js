import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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

const ServicesContainer = styled.div`
  margin-top: 20px;
  text-align: left;
  display: inline-block;
`;

const MasseurDetails = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);

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

  const masseurId = parseInt(id, 10);
  const selectedMasseur = masseurs.find((masseur) => masseur.id === masseurId);

  return (
    <MainContainer>
      <Header>Masseur Details</Header>
      {selectedMasseur ? (
        <div>
          <h2>{selectedMasseur.name}</h2>
          <ServicesContainer>
            <h3>Services Offered</h3>
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
          </ServicesContainer>
        </div>
      ) : (
        <h2>Masseur not found.</h2>
      )}
      <Link to="/">Back to Home</Link>
      <br />
      <Link to={`/book/${id}`}>Book</Link>
    </MainContainer>
  );
};

export default MasseurDetails;
