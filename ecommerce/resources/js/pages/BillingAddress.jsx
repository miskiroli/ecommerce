import React from 'react';

const BillingAddress = ({ address, setAddress, handleUpdate }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  return (
    <form onSubmit={handleUpdate}>
      <h2>Számlázási cím</h2>
      <input
        type="text"
        name="address_line_1"
        placeholder="Cím sor 1"
        value={address.address_line_1 || ''}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="address_line_2"
        placeholder="Cím sor 2"
        value={address.address_line_2 || ''}
        onChange={handleChange}
      />
      <input
        type="text"
        name="city"
        placeholder="Város"
        value={address.city || ''}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="state"
        placeholder="Megye"
        value={address.state || ''}
        onChange={handleChange}
      />
      <input
        type="text"
        name="postal_code"
        placeholder="Irányítószám"
        value={address.postal_code || ''}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="country"
        placeholder="Ország"
        value={address.country || ''}
        onChange={handleChange}
        required
      />
      <button type="submit">Mentés</button>
    </form>
  );
};

export default BillingAddress;
