import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (password !== passwordConfirmation) {
      setError('A jelszavak nem egyeznek.');
      return;
    }

    console.log({ name, email, password, password_confirmation: passwordConfirmation }); // Log data

    try {
      const response = await axios.post('/api/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation, // Include this field
      });
      console.log("Regisztráció sikeres:", response.data);
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      console.error("Regisztrációs hiba:", error.response?.data);
      setError(error.response?.data?.message || 'Hiba történt a regisztráció során.');
    }
  };

  return (
    <div className="register-container">
      <h2>Regisztráció</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Név"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Jelszó"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Jelszó újra"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
        <button type="submit">Regisztráció</button>
        {error && <p className="error">{error}</p>}
      </form>

      {/* Back to login button */}
      <button onClick={() => navigate('/login')} className="login-button">
        Vissza a bejelentkezéshez
      </button>
    </div>
  );
};

export default Register;