import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import Swal from 'sweetalert2';
import { API } from '../api';

// Komponensek
import PersonalDetails from './PersonalDetails';
import ChangePassword from './ChangePassword';
import OrderHistory from './OrderHistory';

const Profile = ({ setUserName, setUserRole }) => {
  const [selectedSection, setSelectedSection] = useState('personal');
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);

  // Felhasználói adatok betöltése
  useEffect(() => {
    fetchProfileData();
    fetchOrderHistory();
  }, []);

  // Profil adatok lekérése
  const fetchProfileData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        title: 'Error!',
        text: 'Please log in again. Your session has expired.',
        icon: 'error',
        confirmButtonColor: '#ff0000',
      });
      return;
    }

    try {
      const { data } = await axios.get(API.PROFILE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data.user || {});
      setUserName(data.user.name);
      setUserRole(data.user.role || 'user');
      console.log('Profil adatok:', data.user);
    } catch (error) {
      console.error('Hiba történt a profil adatok lekérésekor:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Please log in again. Your session has expired.',
        icon: 'error',
        confirmButtonColor: '#ff0000',
      });
    }
  };

  // Rendelési előzmények lekérése
  const fetchOrderHistory = async () => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get(API.PROFILE_ORDERS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Teljes API válasz rendelési előzményekre:', data);

      // Ha a válasz nem tömb, üres tömböt állítunk be
      if (!Array.isArray(data)) {
        console.warn('Az API nem tömböt adott vissza:', data);
        setOrders([]);
        return;
      }

      // Az /api/profile/orders már tartalmazza az items-eket, így nincs szükség további API hívásra
      const ordersWithItems = data.map((order, index) => {
        console.log(`Order ${index} adatai:`, order);
        return {
          order_id: order.order_id || `Unknown-${index}`,
          order_date: order.order_date || 'No date',
          total_price: order.total_price || 0,
          status: order.status || 'Unknown',
          items: order.items || [],
        };
      });

      setOrders(ordersWithItems);
      console.log('Rendelési előzmények:', ordersWithItems);
    } catch (error) {
      console.error('Hiba történt a rendelési előzmények lekérésekor:', error.response ? error.response.data : error);
      if (error.response && error.response.data.includes('<!DOCTYPE html>')) {
        Swal.fire({
          title: 'Error!',
          text: 'The API endpoint is not accessible. Please check the backend configuration (/api/profile/orders).',
          icon: 'error',
          confirmButtonColor: '#ff0000',
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load order history. Please check your connection or log in again.',
          icon: 'error',
          confirmButtonColor: '#ff0000',
        });
      }
      setOrders([]);
    }
  };

  // Kiválasztott szekció renderelése
  const renderSection = () => {
    switch (selectedSection) {
      case 'personal':
        return <PersonalDetails user={user} setUser={setUser} setUserName={setUserName} setUserRole={setUserRole} />;
      case 'password':
        return <ChangePassword user={user} />;
      case 'orders':
        return <OrderHistory orders={orders} />;
      default:
        return <PersonalDetails user={user} setUser={setUser} setUserName={setUserName} setUserRole={setUserRole} />;
    }
  };

  return (
    <div className="profile-container">
      <div className="sidebar">
        <ul>
          <li
            className={selectedSection === 'personal' ? 'active' : ''}
            onClick={() => setSelectedSection('personal')}
          >
            Personal Details
          </li>
          <li
            className={selectedSection === 'password' ? 'active' : ''}
            onClick={() => setSelectedSection('password')}
          >
            Change Password
          </li>
          <li
            className={selectedSection === 'orders' ? 'active' : ''}
            onClick={() => setSelectedSection('orders')}
          >
            Order History
          </li>
        </ul>
      </div>
      <div className="content">
        {renderSection()}
      </div>
    </div>
  );
};

export default Profile;