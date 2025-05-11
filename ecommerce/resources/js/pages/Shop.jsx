import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Shop.css';
import axios from 'axios';
import { CartContext } from '../components/CartContext';

const Shop = ({ isLoggedIn }) => {
  const { updateCart } = useContext(CartContext);
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    // URL query paraméter kinyerése
    const params = new URLSearchParams(location.search);
    const categoryName = params.get('category'); // pl. 'phones', 'watches'

    if (categoryName && categories.length > 0) {
      // Kategória ID keresése a név alapján
      const category = categories.find(
        (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      if (category) {
        setSelectedCategory(category.id.toString());
      } else {
        setSelectedCategory('all'); // Ha nincs ilyen kategória, visszaáll 'all'-ra
      }
    } else {
      setSelectedCategory('all');
    }
  }, [location.search, categories]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categories');
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Hiba a kategóriák lekérésekor:", error);
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products');
      console.log('API válasz:', response.data);
      const fetchedProducts = Array.isArray(response.data) ? response.data : response.data.products || [];
      setProducts(fetchedProducts);
      setLoading(false);
    } catch (error) {
      console.error("Hiba a termékek lekérésekor:", error.response ? error.response.data : error);
      setProducts([]);
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:8000/api/cart/add',
        { product_id: product.id, quantity: 1 },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      const response = await axios.get('http://localhost:8000/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      updateCart(response.data);
      alert(`${product.name} kosárba téve!`);
    } catch (error) {
      console.error("Hiba a kosárba tételkor:", error.response ? error.response.data : error);
    }
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category_id.toString() === selectedCategory);

  if (loading) {
    return <div>Betöltés...</div>;
  }

  return (
    <div className="shop-container">
      <h1>Shop</h1>

      <div className="categories-filter">
        <span
          className={`category ${selectedCategory === 'all' ? 'selected' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </span>
        {categories.map((category) => (
          <span
            key={category.id}
            className={`category ${selectedCategory === category.id.toString() ? 'selected' : ''}`}
            onClick={() => setSelectedCategory(category.id.toString())}
          >
            {category.name}
          </span>
        ))}
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            let firstImage = 'placeholder.jpg';
            try {
              const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
              if (images && images.length > 0) {
                firstImage = images[0];
              }
            } catch (error) {
              console.error(`Hiba a képek parse-olásakor a ${product.id} termékhez:`, error);
            }

            return (
              <div className="product-card" key={product.id}>
                <Link to={`/product/${product.id}`}>
                  <img
                    src={`http://localhost:8000/storage/${firstImage}`}
                    alt={product.name}
                    className="product-image"
                  />
                </Link>

                <div className="p-info">
                  <h2 className="p-name">{product.name}</h2>
                  <p className="p-price">${product.price}</p>
                </div>

                {isLoggedIn && (
                  <div className="add-to-cart-container">
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                    >
                      Kosárba
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>Nincsenek elérhető termékek.</p>
        )}
      </div>
    </div>
  );
};

export default Shop;