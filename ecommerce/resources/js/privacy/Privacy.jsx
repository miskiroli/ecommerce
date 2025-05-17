import React from 'react';
import './Privacy.css';
import Footer from '../components/Footer';

const Privacy = () => {
  return (
    <div className="privacy">
    <div className="privacy-container">
      <h1>Privacy Policy</h1>
      <p><strong>Last Updated: May 14, 2025</strong></p>

      <h2>1. Information We Collect</h2>
      <p>We collect information you provide (e.g., name, email, address) when you register, place an order, or contact us. We also collect data automatically (e.g., IP address, browser type) via cookies.</p>

      <h2>2. How We Use Your Data</h2>
      <ul>
        <li>To process your orders and deliver products.</li>
        <li>To improve our website and services.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2>3. Data Sharing</h2>
      <p>We do not sell your personal data. We may share it with third parties (e.g., payment processors, shipping companies) only as necessary to fulfill your orders.</p>

      <h2>4. Cookies</h2>
      <p>We use cookies to enhance your experience and analyze site usage. You can manage cookie preferences through your browser settings.</p>

      <h2>5. Your Rights</h2>
      <p>You have the right to access, correct, or delete your personal data. Contact us at support@shopzone.com to exercise these rights.</p>

      <h2>6. Security</h2>
      <p>We implement reasonable security measures to protect your data, but no online transmission is 100% secure.</p>

      <h2>7. Changes to Policy</h2>
      <p>We may update this policy. Changes will be posted here with the updated date.</p>

      <p>© 2025 Shopzone. All rights reserved.</p>
    </div>
    <Footer />
    </div>
  );
};

export default Privacy;