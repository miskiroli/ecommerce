import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './product.css';
import Footer from '../Footer';

const Product = ({ isLoggedIn }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fő termék lekérdezése
    fetch(`http://localhost:8000/api/products/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Main product API response:', data);
        if (data) {
          const productData = data.data || data;
          setProduct(productData);
          let images = productData.images;
          if (typeof images === 'string') {
            try {
              images = JSON.parse(images);
            } catch (error) {
              console.error('Error parsing images for product:', error);
              images = [];
            }
          }
          setMainImage(images && images.length > 0 ? images[0] : 'http://127.0.0.1:8000/storage/placeholder.jpg');
          if (productData.category_id) {
            fetchSimilarProducts(productData.category_id, id);
          } else {
            console.warn('No category_id found for product:', productData);
            setSimilarProducts([]);
            setLoading(false);
          }
        } else {
          throw new Error('No product data received');
        }
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        setError('Failed to load product');
        setLoading(false);
      });
  }, [id]);

  // Hasonló termékek lekérdezése
  const fetchSimilarProducts = (categoryId, excludeId) => {
    console.log(`Fetching similar products with category_id=${categoryId}, exclude=${excludeId}`);
    fetch(`http://localhost:8000/api/products?category_id=${categoryId}&limit=5&exclude=${excludeId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Similar products API response:', data);
        let products = [];
        if (Array.isArray(data)) {
          products = data;
        } else if (data.data) {
          products = data.data;
        } else if (data.products) {
          products = data.products;
        } else {
          console.warn('Unexpected API response format for similar products:', data);
        }

        const parsedProducts = products.map(item => {
          let images = item.images;
          if (typeof images === 'string') {
            try {
              images = JSON.parse(images);
            } catch (error) {
              console.error(`Error parsing images for similar product ${item.id}:`, error);
              images = [];
            }
          }
          console.log(`Parsed images for product ${item.id}:`, images); // Kép URL-ek logolása
          return { ...item, images };
        });
        setSimilarProducts(parsedProducts);
      })
      .catch(error => {
        console.error('Error fetching similar products:', error);
        setSimilarProducts([]);
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    return <div>Loading product...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const addToCart = (product) => {
    console.log('Add to Cart clicked for:', product.name);
    alert(`${product.name} kosárba téve!`);
  };

  // Segédfüggvény a kép URL-ek kezelésére
  const getImageUrl = (image) => {
    if (!image) return 'http://127.0.0.1:8000/storage/placeholder.jpg';
    // Ha az image már tartalmazza az abszolút URL-t, akkor nem adjuk hozzá az előtagot
    if (image.startsWith('http')) {
      return image;
    }
    // Ha relatív útvonal, akkor hozzáadjuk az előtagot
    return `http://localhost:8000/storage/${image}`;
  };

  return (
    <div className="product-page">
      {/* Termék képek és információk egy sorban */}
      <div className="product-main">
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
      </div>

      {/* Hasonló termékek szekció */}
      <div className="similar-products-section">
        <h3>Hasonló termékek</h3>
        <div className="similar-products-carousel">
          {similarProducts.length > 0 ? (
            similarProducts.map((similarProduct) => (
              <div key={similarProduct.id} className="product-card">
  <Link to={`/product/${similarProduct.id}`}>
    <div className="product-image-container">
      <img
        src={
          similarProduct.images && similarProduct.images.length > 0
            ? getImageUrl(similarProduct.images[0])
            : 'http://127.0.0.1:8000/storage/placeholder.jpg'
        }
        alt={similarProduct.name}
        className="product-image"
        onError={(e) => { e.target.src = 'http://127.0.0.1:8000/storage/placeholder.jpg'; }}
      />
    </div>
  </Link>
  <div className="product-details">
    <h3>{similarProduct.name}</h3>
    <p className="product-price">${similarProduct.price}</p>
    <Link to={`/product/${similarProduct.id}`}>
      <button className="view-product-btn">Megtekintés</button>
    </Link>
  </div>
</div>
            ))
          ) : (
            <p>Nincsenek hasonló termékek.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Product;