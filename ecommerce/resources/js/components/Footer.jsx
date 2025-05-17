// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faLock, faGift } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <div className="footer-section">
      <div className="benefits-section">
        <div className="benefits-container">
          <div className="benefit-item">
            <FontAwesomeIcon icon={faTruck} className="benefit-icon" />
            <h3>Free Shipping Method</h3>
            <p>Fast and reliable delivery<br />No extra cost for you</p>
          </div>
          <div className="benefit-item">
            <FontAwesomeIcon icon={faLock} className="benefit-icon" />
            <h3>Payment Security</h3>
            <p>Secure transactions<br />Your data is protected</p>
          </div>
          <div className="benefit-item">
            <FontAwesomeIcon icon={faGift} className="benefit-icon" />
            <h3>Bonus System</h3>
            <p>Earn points with every<br />purchase and save more</p>
          </div>
        </div>
      </div>
      <div className="footer-container">
        <div className="footer-column">
          <h3>Shopzone</h3>
          <p>Your trusted electronics store</p>
          <p>Best prices guaranteed</p>
          <p>Shop with confidence</p>
        </div>
        <div className="footer-column">
          <h3>Quick Links</h3>
          <Link to="/contact">About</Link>
          <Link to="/latest">Offers & Discounts</Link>
          <Link to="/latest">Get Coupon</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
        <div className="footer-column">
          <h3>New Products</h3>
          <Link to="/shop?category=Phone">Phone</Link>
          <Link to="/shop?category=Watch">Watch</Link>
          <Link to="/shop?category=TV">TV</Link>
          <Link to="/shop?category=Laptop">Laptop</Link>
        </div>
        <div className="footer-column">
          <h3>Support</h3>
          <Link to="/contact">Frequently Asked Questions</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/">Report a Payment Issue</Link>
        </div>
      </div>

      <div className="footer-copyright">
        <div className="copyright-container">
          <div className="copyright-text">
            <p>
              Copyright ©2025 All rights reserved | This demo is made by{'miskiroli'}
              <a href="https://github.com/miskiroli" target="_blank" rel="noopener noreferrer">
                miskiroli
              </a>
            </p>
          </div>
          <div className="social-icons">
            <a href="https://www.linkedin.com/in/roland-miski-45179817a/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedin} className="social-icon" />
            </a>
            <a href="https://github.com/miskiroli" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGithub} className="social-icon" />
            </a>
            <a href="https://x.com/MiskiRoland" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitter} className="social-icon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;