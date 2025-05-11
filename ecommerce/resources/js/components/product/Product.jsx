// Product.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './product.css';
import axios from 'axios';

const Product = ({ isLoggedIn }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fő termék lekérdezése
    fetch(`http://localhost:8000/api/products/${id}`)
      .then(response => response.json())
      .then(data => {
        setProduct(data);
        setMainImage(data.images && data.images.length > 0 ? data.images[0] : null);
      })
      .catch(error => console.error('Error fetching product:', error));

    // Hasonló termékek lekérdezése (azonos kategóriából)
    if (product && product.category_id) {
      fetch(`http://localhost:8000/api/products?category_id=${product.category_id}&limit=5&exclude=${id}`)
        .then(response => response.json())
        .then(data => setSimilarProducts(Array.isArray(data) ? data : data.products || []))
        .catch(error => console.error('Error fetching similar products:', error));
    }
    setLoading(false);
  }, [id, product?.category_id]);

  if (loading) {
    return <div>Loading product...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  // Helyettesítő addToCart függvény (mivel nem definiáltad)
  const addToCart = (product) => {
    console.log('Add to Cart clicked for:', product.name);
    // Itt integrálhatod a kosár logikát (pl. axios.post)
    alert(`${product.name} kosárba téve!`);
  };

  return (
    <div className="product-page">
      {/* Termék képek és információk */}
      <div className="product-images">
        {mainImage ? (
          <div className="main-image">
            <img src={mainImage} alt={product.name} />
          </div>
        ) : (
          <div>No image available</div>
        )}

        <div className="image-thumbnails">
          {product.images && product.images.length > 1 && product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index}`}
              onClick={() => setMainImage(image)}
              className={`thumbnail ${image === mainImage ? 'active-thumbnail' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="product-info">
        <h2>{product.name}</h2>
        <p>{product.description || 'Nincs leírás'}</p>

        {isLoggedIn && (
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        )}

        <p className="product-price">${product.price}</p>
        <Link to="/shop">
          <button className="back-to-shop-btn">Vissza a termékekhez</button>
        </Link>
      </div>

      {/* Hasonló termékek szekció */}
      <div className="similar-products-section">
        <h3>Hasonló termékek</h3>
        <div className="similar-products-carousel">
          {similarProducts.length > 0 ? (
            similarProducts.map((similarProduct) => (
              <div key={similarProduct.id} className="similar-product-card">
                <Link to={`/product/${similarProduct.id}`}>
                  <img
                    src={`http://localhost:8000/storage/${similarProduct.images && similarProduct.images.length > 0 ? similarProduct.images[0] : 'placeholder.jpg'}`}
                    alt={similarProduct.name}
                    className="similar-product-image"
                  />
                </Link>
                <div className="similar-product-info">
                  <h4>{similarProduct.name}</h4>
                  <p>${similarProduct.price}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Nincsenek hasonló termékek.</p>
          )}
        </div>
      </div>

      {/* Footer és copyright */}
      <div className="product-footer">
        <div className="footer-container">
          <div className="footer-column">
            <h3>Shopzone</h3>
            <p>Your trusted electronics store</p>
            <p>Best prices guaranteed</p>
          </div>
          <div className="footer-column">
            <h3>Quick Links</h3>
            <Link to="/shop">Shop</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div className="footer-copyright">
          <p>Copyright ©2025 All rights reserved | Made by <a href="https://github.com/miskiroli" target="_blank">miskiroli</a></p>
        </div>
      </div>
    </div>
  );
};

export default Product;