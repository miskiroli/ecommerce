import React from 'react';
import './Terms.css';
import Footer from '../components/Footer';

const Terms = () => {
  return (
    <div className=" terms">
    <div className="terms-container">
      <h1>Terms & Conditions</h1>
      <p><strong>Last Updated: May 14, 2025</strong></p>

      <h2>1. Introduction</h2>
      <p>Welcome to Shopzone! These Terms & Conditions govern your use of our website and services. By accessing or using our site, you agree to be bound by these terms.</p>

      <h2>2. Eligibility</h2>
      <p>You must be at least 18 years old to use this website. By using our services, you confirm that you meet this requirement.</p>

      <h2>3. Product Purchases</h2>
      <ul>
        <li>All products are subject to availability.</li>
        <li>Prices are listed in USD and include applicable taxes unless otherwise stated.</li>
        <li>We reserve the right to modify prices or discontinue products without prior notice.</li>
      </ul>

      <h2>4. User Conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the site for illegal purposes.</li>
        <li>Attempt to interfere with the site's operation.</li>
        <li>Post false or misleading information.</li>
      </ul>

      <h2>5. Limitation of Liability</h2>
      <p>Shopzone is not liable for any indirect, incidental, or consequential damages arising from the use of this website or its products.</p>

      <h2>6. Changes to Terms</h2>
      <p>We may update these terms at any time. Changes will be effective upon posting on this page.</p>

      <h2>7. Contact Us</h2>
      <p>For questions, contact us at miski.roland91@gmail.com </p>
      <p>© 2025 Shopzone. All rights reserved.</p>

     
    </div>
       <Footer />
    </div>
  );
};

export default Terms;