import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Shop.css';
import axios from 'axios';
import { CartContext } from '../components/CartContext';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';
import { useLoading } from '../components/LoadingContext';

const Shop = ({ isLoggedIn }) => {
  const { updateCart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0 || selectedCategory === 'all') {
      fetchProducts(currentPage);
    }
  }, [currentPage, selectedCategory, searchQuery, categories]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryName = params.get('category');

    if (categoryName && categories.length > 0) {
      const category = categories.find(
        (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      setSelectedCategory(category ? category.id.toString() : 'all');
      setCurrentPage(1);
    }
  }, [location.search, categories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/categories');
      setCategories(Array.isArray(response.data) ? response.data : []);
      console.log('Categories fetched:', response.data);
    } catch (error) {
      console.error('Hiba a kategóriák lekérésekor:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (page) => {
    try {
      setLoading(true);
      const params = {
        page,
        category: selectedCategory !== 'all' ? selectedCategory : null,
        ...(searchQuery.trim() && { q: searchQuery.trim() }),
      };
      const response = await axios.get('http://localhost:8000/api/products', { params });
      setProducts(response.data.data || []);
      setTotalPages(response.data.last_page || 1);
      console.log('API válasz:', response.data);
    } catch (error) {
      console.error('Hiba a termékek lekérésekor:', error.response ? error.response.data : error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    setSearchQuery('');
    const categoryName = categoryId === 'all'
      ? null
      : categories.find((cat) => cat.id.toString() === categoryId)?.name.toLowerCase();
    navigate(categoryName ? `/shop?category=${categoryName}` : '/shop');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setCurrentPage(1);
      fetchProducts(1);
    }
  };

  const addToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        title: 'Error!',
        text: 'Please log in to add items to cart.',
        icon: 'error',
        confirmButtonColor: '#ff0000',
      });
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        'http://localhost:8000/api/cart/add',
        { product_id: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const response = await axios.get('http://localhost:8000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      updateCart(response.data);
      Swal.fire({
        title: 'Success!',
        text: `${product.name} has been added to your cart!`,
        icon: 'success',
        confirmButtonColor: '#ff0000',
      });
    } catch (error) {
      console.error('Hiba a kosárba tételkor:', error.response ? error.response.data : error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add to cart.',
        icon: 'error',
        confirmButtonColor: '#ff0000',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shop-container">
      <h1>Shop</h1>

{/* Desktop: kategóriák gombként */}
<div className="categories-filter">
  <span
    className={`category ${selectedCategory === 'all' ? 'selected' : ''}`}
    onClick={() => handleCategoryChange('all')}
  >
    All
  </span>
  {categories.map((category) => (
    <span
      key={category.id}
      className={`category ${selectedCategory === category.id.toString() ? 'selected' : ''}`}
      onClick={() => handleCategoryChange(category.id.toString())}
    >
      {category.name}
    </span>
  ))}
</div>

{/* Mobil: kategóriák legördülő menüben */}
<div className="mobile-category-select">
  <select
    value={selectedCategory}
    onChange={(e) => handleCategoryChange(e.target.value)}
  >
    <option value="all">All</option>
    {categories.map((category) => (
      <option key={category.id} value={category.id.toString()}>
        {category.name}
      </option>
    ))}
  </select>
</div>


      <div className="search-and-pagination">
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
          />
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? 'active' : ''}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => {
            const firstImage = Array.isArray(product.images) && product.images.length > 0
              ? product.images[0]
              : 'placeholder.jpg';

            return (
              <div className="product-card" key={product.id}>
                <Link to={`/product/${product.id}`}>
                  <div className="image-wrapper">
                    <img
                      src={firstImage}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => { e.target.src = 'placeholder.jpg'; }}
                    />
                  </div>
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
            );
          })
        ) : (
          <p>No products available.</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Shop;