import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const PersonalDetails = ({ user, setUser, setUserName, setUserRole }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
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
      const response = await axios.put(
        '/api/profile',
        { name: user.name, email: user.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('API response for name update:', response.data);
      const updatedUser = response.data.user;
      if (!updatedUser || !updatedUser.name) {
        throw new Error('The response does not contain valid user data.');
      }
      setUser(updatedUser);
      setUserName(updatedUser.name); // Frissítjük az App userName állapotát
      setUserRole(updatedUser.role || 'user'); // Frissítjük az App userRole állapotát
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('Updated userName for App:', updatedUser.name);
      Swal.fire({
        title: 'Success!',
        text: 'Personal details updated successfully!',
        icon: 'success',
        confirmButtonColor: '#ff0000',
      });
    } catch (error) {
      console.error('Error updating profile:', error.response ? error.response.data : error.message);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Profile update failed.',
        icon: 'error',
        confirmButtonColor: '#ff0000',
      });
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <h2>Personal Details</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={user.name || ''}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={user.email || ''}
        onChange={handleChange}
        required
      />
      <button type="submit">Save</button>
    </form>
  );
};

export default PersonalDetails;