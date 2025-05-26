import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ChangePassword.css';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;

    // Kliensoldali validáció
    if (!currentPassword || !newPassword || !confirmPassword) {
      Swal.fire({
        title: 'Error!',
        text: 'All fields are required.',
        icon: 'error',
        confirmButtonColor: '#ff0000',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: 'Error!',
        text: 'New password and confirmation do not match.',
        icon: 'error',
        confirmButtonColor: '#ff0000',
      });
      return;
    }

    if (newPassword.length < 8) {
      Swal.fire({
        title: 'Error!',
        text: 'New password must be at least 8 characters long.',
        icon: 'error',
        confirmButtonColor: '#ff0000',
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.post(
        '/api/user/change-password',
        {
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        title: 'Success!',
        text: 'Your password has been changed successfully.',
        icon: 'success',
        confirmButtonColor: '#ff0000',
      });

      // Űrlap alaphelyzetbe állítása
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to change password.',
        icon: 'error',
        confirmButtonColor: '#ff0000',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;