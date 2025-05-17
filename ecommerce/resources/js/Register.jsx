import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';
import Swal from 'sweetalert2'; // SweetAlert2 importálása

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};

    if (password !== passwordConfirmation) {
      newErrors.password = ['The passwords do not match.'];
    }
    if (password.length < 8) {
      newErrors.password = newErrors.password || [];
      newErrors.password.push('The password must be at least 8 characters long.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = ['Invalid email format.'];
    }

    if (name.length > 255) {
      newErrors.name = ['The name cannot be longer than 255 characters.'];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Validációs hibák SweetAlert2-vel
      Swal.fire({
        icon: 'error',
        title: 'Registration Error',
        html: Object.keys(newErrors)
          .map((key) => `<p>${newErrors[key].join('<br>')}</p>`)
          .join(''),
        confirmButtonText: 'OK',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      console.log("Regisztráció sikeres:", response.data);
      // Sikeres regisztráció SweetAlert2-vel
      Swal.fire({
        icon: 'success',
        title: 'Successful Registration!',
        text: 'Registration completed successfully. You will be redirected to the login page.',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate('/login');
      });
    } catch (error) {
      console.error("Regisztrációs hiba:", error.response?.data);
      if (error.response?.status === 422) {
        const serverErrors = error.response.data.errors || { general: ['An error occurred during registration.'] };
        setErrors(serverErrors);
        // Szerveroldali validációs hibák SweetAlert2-vel
        Swal.fire({
          icon: 'error',
          title: 'Registration Error',
          html: Object.keys(serverErrors)
            .map((key) => `<p>${serverErrors[key].join('<br>')}</p>`)
            .join(''),
          confirmButtonText: 'OK',
        });
      } else {
        setErrors({ general: ['An error occurred during registration.'] });
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred during registration. Please try again later.',
          confirmButtonText: 'OK',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Registration</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
        {Object.keys(errors).length > 0 && (
          <div className="error-messages">
            {Object.keys(errors).map((key) =>
              errors[key].map((msg, index) => (
                <p key={`${key}-${index}`} className="error">
                  {msg}
                </p>
              ))
            )}
          </div>
        )}
      </form>

      <button onClick={() => navigate('/login')} className="login-button">
        Back to Login
      </button>
    </div>
  );
};

export default Register;