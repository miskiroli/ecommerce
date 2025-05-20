import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Latest.css';
import Footer from '../components/Footer';
import axios from 'axios';
import { useLoading } from '../components/LoadingContext';
import { API } from '../api';

const Latest = () => {
  const { setLoading } = useLoading();
  const [latestProducts, setLatestProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        console.log('Setting loading to true for fetchLatestProducts');
        setLoading(true);
        const response = await axios.get(API.LATEST);
        console.log('Latest API válasz:', response.data);
        const fetchedProducts = Array.isArray(response.data.data) ? response.data.data : [];
        setLatestProducts(fetchedProducts);

        // Hasonló termékek: véletlenszerűen válasszunk ki 5 elemet a latestProducts-ból
        if (fetchedProducts.length > 0) {
          const shuffled = [...fetchedProducts].sort(() => 0.5 - Math.random());
          const selectedSimilar = shuffled.slice(0, 5); // Az első 5 random elem
          console.log('Hasonló termékek:', selectedSimilar);
          setSimilarProducts(selectedSimilar);
        }
      } catch (error) {
        console.error('Error fetching products:', error.response ? error.response.data : error);
        setLatestProducts([]);
        setSimilarProducts([]);
      } finally {
        console.log('Setting loading to false for fetchLatestProducts');
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, [setLoading]);

  return (
    <div className="latest-page">
      <div className="latest-header">
        <h1>Our Latest Products</h1>
        <p>Discover Shopzone's newest electronics and offers!</p>
      </div>

      <div className="latest-products-section">
        <h2>New Arrivals</h2>
        <div className="products-grid">
          {latestProducts.length > 0 ? (
            latestProducts.map((product) => (
              <div key={product.id} className="product-card">
                <Link to={`/product/${product.id}`}>
                  <div className="product-image-container">
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : 'http://shopzone.miskiroland.com/storage/placeholder.jpg'}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => { e.target.src = 'http://shopzone.miskiroland.com/storage/placeholder.jpg'; }}
                    />
                  </div>
                </Link>
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p className="product-price">${product.price}</p>
                  <Link to={`/product/${product.id}`}>
                    <button className="view-product-btn">View Product</button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No new products available.</p>
          )}
        </div>
      </div>

      {similarProducts.length > 0 ? (
        <div className="similar-products-section">
          <h2>Similar Products</h2>
          <div className="similar-products-container">
            <div className="similar-products-track">
              {[...similarProducts, ...similarProducts].map((product, index) => (
                <div key={`${product.id}-${index}`} className="similar-product-card">
                  <Link to={`/product/${product.id}`}>
                    <div className="product-image-container">
                      <img
                        src={product.images && product.images.length > 0 ? product.images[0] : 'http://shopzone.miskiroland.com/storage/placeholder.jpg'}
                        alt={product.name}
                        className="product-image"
                        onError={(e) => { e.target.src = 'http://shopzone.miskiroland.com/storage/placeholder.jpg'; }}
                      />
                    </div>
                  </Link>
                  <div className="product-details">
                    <h3>{product.name}</h3>
                    <p className="product-price">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="similar-products-section">
          <h2>Similar Products</h2>
          <p>No similar products available.</p>
        </div>
      )}

      <div className="latest-offers-section">
        <h2>Current Offers</h2>
        <div className="offers-container">
          <div className="offer-card">
            <h3>20% Off on Phones!</h3>
            <p>Only until May 31! Don't miss out on the best deals.</p>
            <Link to="/shop?category=Phone">
              <button className="view-offer-btn">View Phones</button>
            </Link>
          </div>
          <div className="offer-card">
            <h3>Free Shipping on Orders Over $100</h3>
            <p>Shop now and save on shipping costs!</p>
            <Link to="/shop">
              <button className="view-offer-btn">Shop Now</button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Latest;