import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = ({ user }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Ellenőrizd, hogy van-e user adat
  if (!user) {
    return <p>Felhasználói adatok betöltése...</p>;
  }


   
    
  const handleChangePassword = async (e) => {
    e.preventDefault();
  
    if (newPassword !== confirmPassword) {
      setError('Az új jelszó és a megerősítés nem egyezik.');
      return;
    }
  
    try {
      const response = await axios.put('/api/profile/password', {
        currentPassword,
        newPassword,
        newPassword_confirmation: confirmPassword, // Add this line
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
  
      if (response.status === 200) {
        setSuccess('Jelszó sikeresen megváltoztatva.');
        setError('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error("Jelszó módosítási hiba:", error);
      if (error.response && error.response.data.errors) {
        // Show specific validation errors
        setError(Object.values(error.response.data.errors).join(' '));
      } else {
        setError('Hibás jelszó vagy hiba történt a módosítás során.');
      }
    }
  };
  
  
  

  return (
    <div className="change-password-container">
      <h2>Jelszó megváltoztatása</h2>
      <form onSubmit={handleChangePassword}>
        <input
          type="password"
          placeholder="Jelenlegi jelszó"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Új jelszó"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Jelszó megerősítése"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Jelszó módosítása</button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
};

export default ChangePassword;
