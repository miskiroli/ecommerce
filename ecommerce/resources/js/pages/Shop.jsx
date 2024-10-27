import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Shop.css';
import axios from 'axios';
import { CartContext } from '../components/CartContext'; // Importáld a CartContextet

const Shop = ({ isLoggedIn }) => {
  const { updateCart } = useContext(CartContext);
  console.log("updateCart:", updateCart); // Használj useContext-et
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Az Axios alapértelmezett beállításai
  axios.defaults.withCredentials = true; // Cookie-k küldése

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addToCart = async (product) => {
    const token = localStorage.getItem('token'); // Token lekérése

    try {
        await axios.post('http://localhost:8000/api/cart/add', {
            product_id: product.id,
            quantity: 1 // Mennyiség
        }, {
            headers: {
                'Authorization': `Bearer ${token}` // Token hozzáadása a fejléchez
            }
        });

        // Kosár frissítése
        const response = await axios.get('http://localhost:8000/api/cart', {
            headers: {
                'Authorization': `Bearer ${token}` // Token hozzáadása a kéréshez
            }
        });

        // Frissítsd a kosár elemeket a CartContext-ben
        updateCart(response.data); // Frissített hívás

        alert(`${product.name} added to cart!`);
    } catch (error) {
        console.error("Error adding to cart:", error.response ? error.response.data : error);
    }
};

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category_id.toString() === selectedCategory);

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
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <Link to={`/products/${product.id}`} state={{ product }}>
              {product.images && product.images.length > 0 && (
                <img src={product.images[0]} alt={product.name} className="product-image" />
              )}
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
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
