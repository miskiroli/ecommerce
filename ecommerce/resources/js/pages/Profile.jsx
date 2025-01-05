import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

// Komponensek
import PersonalDetails from './PersonalDetails';
import ChangePassword from './ChangePassword';
import OrderHistory from './OrderHistory';

const Profile = () => {
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
      console.error("Nincs token. Kérlek jelentkezz be.");
      return;
    }

    try {
      const { data } = await axios.get('/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data.user);
    } catch (error) {
      console.error("Hiba történt a profil adatok lekérésekor:", error);
      alert("Kérlek jelentkezz be újra. A munkamenet lejárt.");
    }
  };

  // Rendelési előzmények lekérése
  const fetchOrderHistory = async () => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data.orders);
    } catch (error) {
      console.error("Hiba történt a rendelési előzmények lekérésekor:", error);
    }
  };

  // Kiválasztott szekció renderelése
  const renderSection = () => {
    switch (selectedSection) {
      case 'personal':
        return <PersonalDetails user={user} setUser={setUser} />;
      case 'password':
        return <ChangePassword user={user} />;
      case 'orders':
        return <OrderHistory orders={orders} />;
      default:
        return <PersonalDetails user={user} setUser={setUser} />;
    }
  };

  return (
    <div className="profile-container">
      <div className="sidebar">
        <ul>
          <li onClick={() => setSelectedSection('personal')}>Személyes adatok</li>
          <li onClick={() => setSelectedSection('password')}>Jelszó módosítása</li>
          <li onClick={() => setSelectedSection('orders')}>Rendelési előzmények</li>
        </ul>
      </div>
      <div className="content">
        {renderSection()}
      </div>
    </div>
  );
};

export default Profile;
