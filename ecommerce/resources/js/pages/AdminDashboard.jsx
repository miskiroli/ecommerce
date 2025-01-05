import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductList from './ProductList';
import UserList from './UserList';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchProducts();
      await fetchUsers();
      await fetchCategories();
    };

    fetchData();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Termékek betöltési hiba:', error);
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Felhasználók betöltési hiba:', error);
    }
  };

  const fetchCategories = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data || []);
    } catch (error) {
      console.error('Kategóriák betöltési hiba:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error('Termék törlési hiba:', error);
    }
  };

  const handleAddProduct = async (formData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('/api/admin/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setProducts([...products, response.data.product]);
    } catch (error) {
      console.error('Termék hozzáadási hiba:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <ul>
          <li
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            Termékek
          </li>
          <li
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Felhasználók
          </li>
        </ul>
      </div>
      <div className="content">
        {activeTab === 'products' && (
          <ProductList
            products={products}
            categories={categories}
            onDelete={handleDeleteProduct}
            onAdd={handleAddProduct}
          />
        )}
        {activeTab === 'users' && <UserList users={users} />}
      </div>
    </div>
  );
};

export default AdminDashboard;
