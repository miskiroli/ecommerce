import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './product.css'; 


const Product = ({ isLoggedIn }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/products/${id}`)
      .then(response => response.json())
      .then(data => {
        setProduct(data);
        setMainImage(data.images && data.images.length > 0 ? data.images[0] : null); 
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading product...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-page">
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
        <p>{product.description}</p>

        {isLoggedIn && (
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        )}

        <p className="product-price">${product.price}</p>
      </div>
    </div>
  );
};

export default Product;
