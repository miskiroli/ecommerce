import React, { useState, useEffect } from 'react';
import './Shop.css'; // stílusok külön fájlban

const Shop = () => {
  const [products, setProducts] = useState([]);

  // Termékek betöltése az API-ból
  useEffect(() => {
    fetch('http://localhost:8000/api/products') // Laravel backend API hívás
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="shop-container">
      <h1>Shop</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p className="product-price">${product.price}</p>
            <button className="add-to-cart-btn">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
