import React, { useState } from 'react';
import './Profile.css'; // Hozz létre egy CSS fájlt a stílusoknak

const Profile = () => {
  const [selectedSection, setSelectedSection] = useState('personal');

  // Váltás a bal oldali menü opciói között
  const renderSection = () => {
    switch (selectedSection) {
      case 'personal':
        return <PersonalDetails />;
      case 'password':
        return <ChangePassword />;
      case 'orders':
        return <OrderHistory />;
      case 'billing':
        return <BillingAddress />;
      default:
        return <PersonalDetails />;
    }
  };

  return (
    <div className="profile-container">
      <div className="sidebar">
        <ul>
          <li onClick={() => setSelectedSection('personal')} className={selectedSection === 'personal' ? 'active' : ''}>Személyes adatok</li>
          <li onClick={() => setSelectedSection('password')} className={selectedSection === 'password' ? 'active' : ''}>Jelszó módosítása</li>
          <li onClick={() => setSelectedSection('orders')} className={selectedSection === 'orders' ? 'active' : ''}>Rendelési előzmények</li>
          <li onClick={() => setSelectedSection('billing')} className={selectedSection === 'billing' ? 'active' : ''}>Számlázási cím</li>
        </ul>
      </div>

      <div className="content">
        {renderSection()}
      </div>
    </div>
  );
};

// Példa komponensek a bal oldali menü elemeihez

const PersonalDetails = () => (
  <div>
    <h2>Személyes adatok</h2>
    {/* Form a név, e-mail cím megváltoztatásához */}
    <form>
      <label>Név:</label>
      <input type="text" placeholder="Your Name" />
      <label>E-mail cím:</label>
      <input type="email" placeholder="Your Email" />
      <button type="submit">Mentés</button>
    </form>
  </div>
);

const ChangePassword = () => (
  <div>
    <h2>Jelszó módosítása</h2>
    <form>
      <label>Régi jelszó:</label>
      <input type="password" />
      <label>Új jelszó:</label>
      <input type="password" />
      <label>Új jelszó megerősítése:</label>
      <input type="password" />
      <button type="submit">Jelszó módosítása</button>
    </form>
  </div>
);

const OrderHistory = () => (
  <div>
    <h2>Rendelési előzmények</h2>
    {/* Rendelési előzmények listázása */}
    <ul>
      <li>Rendelés 1 - 2023.10.01 - Szállítva</li>
      <li>Rendelés 2 - 2023.09.15 - Feldolgozás alatt</li>
    </ul>
  </div>
);

const BillingAddress = () => (
  <div>
    <h2>Számlázási cím</h2>
    <form>
      <label>Utca:</label>
      <input type="text" placeholder="Utca, házszám" />
      <label>Város:</label>
      <input type="text" placeholder="Város" />
      <label>Irányítószám:</label>
      <input type="text" placeholder="Irányítószám" />
      <button type="submit">Mentés</button>
    </form>
  </div>
);

export default Profile;
