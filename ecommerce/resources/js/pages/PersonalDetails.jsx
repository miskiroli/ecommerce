import React from 'react';

const PersonalDetails = ({ user, setUser, handleUpdate }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  return (
    <form onSubmit={handleUpdate}>
      <h2>Személyes adatok</h2>
      <input
        type="text"
        name="name"
        placeholder="Név"
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
      <button type="submit">Mentés</button>
    </form>
  );
};

export default PersonalDetails;
