import React, { useState, useEffect } from 'react';
import './Home.css';
import intro from './intro.png';
import tv from './tv.jpg';
import laptop from './laptop.jpg';
import camera from './camera.jpg';
import watch from './watch.jpg';
import watchBanner from './watchbanner.jpg';
import phoneBanner from './phonebanner.jpg';
import computer from './computer.jpg';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faLock, faGift } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';


const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [popularItems, setPopularItems] = useState([]);

  // Fetch the latest 3 products on component mount
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get('/api/products', {
          params: {
            sort: 'created_at', // Sort by creation date
            order: 'desc',      // Descending order (newest first)
            limit: 3,           // Limit to 3 products
          },
        });
        setNewArrivals(response.data.products || response.data); // Adjust based on API response
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      }
    };

 // Fetch the 6 cheapest products for popular items
 const fetchPopularItems = async () => {
  try {
    const response = await axios.get('/api/products', {
      params: {
        sort: 'price',
        order: 'asc',
        limit: 6,
      },
    });
    setPopularItems(response.data.products || response.data);
  } catch (error) {
    console.error('Error fetching popular items:', error);
  }
};

fetchNewArrivals();
fetchPopularItems();
}, []);

  return (
    <div className="h">
      {/* Container for intro and img to be side-by-side */}
      <div className="intro-container">
        <div className="intro">
          <h1>Select Your Perfect Electronics</h1>
          <span>Your go-to store for the best electronics at unbeatable prices</span>
          <Link to="/shop">
            <button className="shop-btn">Shop Now</button>
          </Link>
        </div>
        <div className="img">
          <img src={intro} alt="Electronics" />
        </div>
      </div>

      {/* New Arrivals section below the intro-container */}
      <div className="new-arrivals">
      <div className="new-arrivals-h1">
      <h1>New Arrivals</h1>

      </div>
        <div className="products-row">
          {newArrivals.length > 0 ? (
            newArrivals.map((product) => {
              let firstImage = 'placeholder.jpg';
              try {
                const images = JSON.parse(product.images);
                if (images && images.length > 0) {
                  firstImage = images[0];
                }
              } catch (error) {
                console.error(`Error parsing images for product ${product.id}:`, error);
              }

              return (
                <div key={product.id} className="product-card">
                  <Link to={`/product/${product.id}`} className="image-link">
                  <div className="image-container">
                  <img
                      src={`http://127.0.0.1:8000/storage/${firstImage}`}
                      alt={product.name}
                      className="product-image"
                    />
                  </div>

                   
                  </Link>
                  <div className="product-info">
                    <div className="name-container">
                      <h3>{product.name}</h3>
                    </div>
                    <div className="price-container">
                      <p>${product.price}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No new arrivals available.</p>
          )}
        </div>
      </div>

      <div className="h-pictures">
      <div className="left-pictures">
      <div className="img-wrapper">     
         <img src={tv} alt="Tv" className='h-image' />
</div>
      <div className="img-wrapper">     

        <img src={watch} alt="Watch" className='h-image' />
</div>
      </div>
      <div className="right-pictures">
      <div className="img-wrapper">     
       <img src={camera} alt="Camera" className='h-image' /> </div>
       <div className="img-wrapper"> 
        <img src={laptop} alt="Laptop" className='h-image'/>  </div>
      </div>
      </div>

 
{/* Popular Items section */}
<div className="pop-items">
        <div className="pop-items-h1">
          <h1>Popular Items</h1>
        </div>
        <div className="products-row">
          {popularItems.length > 0 ? (
            popularItems.map((product) => {
              let firstImage = 'placeholder.jpg';
              try {
                const images = JSON.parse(product.images);
                if (images && images.length > 0) {
                  firstImage = images[0];
                }
              } catch (error) {
                console.error(`Error parsing images for product ${product.id}:`, error);
              }

              return (
                <div key={product.id} className="product-card">
                  <Link to={`/product/${product.id}`} className="image-link">
                    <div className="image-container">
                      <img
                        src={`http://127.0.0.1:8000/storage/${firstImage}`}
                        alt={product.name}
                        className="product-image"
                      />
                    </div>
                  </Link>
                  <div className="product-info">
                    <div className="name-container">
                      <h3>{product.name}</h3>
                    </div>
                    <div className="price-container">
                      <p>${product.price}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No popular items available.</p>
          )}
        </div>
        <div className="view-more-container">
          <Link to="/shop">
            <button className="view-more-btn">View More Products</button>
          </Link>
        </div>
        <div className="computer-image-container">
          <img src={computer} alt="Computer" className="computer-image" />
        </div>
      </div>
      <div className="watch-section">
        <div className="watch-container">
          <div className="watch-content">
            <h1>Watch of Choice</h1>
            <p>
              Discover our curated collection of premium watches, designed to blend style and functionality. From sleek modern designs to timeless classics, our watches are crafted to elevate your everyday look. Find the perfect timepiece that matches your unique personality.
            </p>
            <Link to="/shop?category=Watch">
              <button className="view-watches-btn">View Watches</button>
            </Link>
          </div>
          <div className="watch-image">
            <img src={watchBanner} alt="Watch Banner" className="watch-banner-image" />
          </div>
        </div>
      </div>

      <div className="phone-section">
        <div className="phone-container">
          <div className="phone-image">
            <img src={phoneBanner} alt="Phone Banner" className="phone-banner-image" />
          </div>
          <div className="phone-content">
            <h1>Phone of Choice</h1>
            <p>
              Explore our cutting-edge collection of smartphones, built for performance and style. Whether you need advanced technology or sleek design, our phones deliver exceptional quality. Choose the perfect device to stay connected and empowered.
            </p>
            <Link to="/shop?category=Phone">
              <button className="view-phones-btn">View Phones</button>
            </Link>
          </div>
        </div>
      </div>

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
<div className="footer-section">
        <div className="footer-container">
          <div className="footer-column">
            <h3>Shopzone</h3>
            <p>Your trusted electronics store</p>
            <p>Best prices guaranteed</p>
            <p>Shop with confidence</p>
          </div>
          <div className="footer-column">
            <h3>Quick Links</h3>
            <Link to="/about">About</Link>
            <Link to="/offers">Offers & Discounts</Link>
            <Link to="/coupon">Get Coupon</Link>
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
            <Link to="/faq">Frequently Asked Questions</Link>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/report-payment">Report a Payment Issue</Link>
          </div>
        </div>

        <div className="footer-copyright">
          <div className="copyright-container">
            <div className="copyright-text">
              <p>
                Copyright ©2025 All rights reserved | This demo is made by{' '}
                <a href="https://github.com/miskiroli" target="_blank" rel="noopener noreferrer">
                  miskiroli
                </a>
              </p>
            </div>
            <div className="social-icons">
              <a href="https://linkedin.com/in/miskiroli" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} className="social-icon" />
              </a>
              <a href="https://github.com/miskiroli" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} className="social-icon" />
              </a>
              <a href="https://twitter.com/miskiroli" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} className="social-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;