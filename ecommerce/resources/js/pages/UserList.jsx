import React from 'react';
import axios from 'axios';
import './UserList.css';
import Swal from 'sweetalert2';
import { API } from '../api';


const UserList = ({ users = [], onDelete }) => {
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to delete this user?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff0000',
      cancelButtonColor: '#ccc',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.delete(API.ADMIN_USER_DELETE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (onDelete) onDelete();
        console.log("User deleted successfully:", response.data);
        Swal.fire({
          title: 'Successful Deletion!',
          text: 'The user has been deleted.',
          icon: 'success',
          confirmButtonColor: '#ff0000',
        });
      } catch (error) {
        console.error("Felhasználó törlése sikertelen:", error.response ? error.response.data : error.message);
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to delete the user.',
          icon: 'error',
          confirmButtonColor: '#ff0000',
        });
      }
    }
  };

  return (
    <div className="user-list">
      <h2>Users List</h2>
      {users && users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <div className="user-info">
                <strong>{user.name}</strong> - {user.email}
              </div>
              <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-users">No users available.</p>
      )}
    </div>
  );
};

export default UserList;