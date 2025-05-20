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
import Footer from '../components/Footer';
import { useLoading } from '../components/LoadingContext';
import { API } from '../api';

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Setting loading to true');
        setLoading(true);
        const [newArrivalsResponse, popularResponse] = await Promise.all([
          axios.get(API.NEW_ARRIVALS),
          axios.get(API.POPULAR),
        ]);
        console.log('New Arrivals API válasz:', newArrivalsResponse.data);
        console.log('Popular API válasz:', popularResponse.data);
        setNewArrivals(newArrivalsResponse.data.data || []);
        setPopularItems(popularResponse.data.data || []);

        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 másodperc
      } catch (error) {
        console.error('Error fetching home data:', error.response ? error.response.data : error);
        setNewArrivals([]);
        setPopularItems([]);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    fetchData();
  }, [setLoading]);

  const handleAcceptCookies = () => {
    setShowCookieConsent(false);
  };

  return (
    <div className="h">
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

      <div className="new-arrivals">
        <div className="new-arrivals-h1">
          <h1>New Arrivals</h1>
        </div>
        <div className="products-row">
          {newArrivals.length > 0 ? (
            newArrivals.map((product) => (
              <div key={product.id} className="product-card">
                <Link to={`/product/${product.id}`}>
                  <div className="product-image-container">
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : 'http://shopzone.miskiroland.com/storage/placeholder.jpg'}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => { e.target.src = 'http://shopzone.miskiroland.com/storage/placeholder.jpg'; }}
                    />
                  </div>
                </Link>
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p className="product-price">${product.price}</p>
                  <Link to={`/product/${product.id}`}>
                    <button className="view-product-btn">View Product</button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No new arrivals available.</p>
          )}
        </div>
      </div>

      <div className="h-pictures">
        <div className="left-pictures">
          <div className="img-wrapper">
            <img src={tv} alt="Tv" className="h-image" />
          </div>
          <div className="img-wrapper">
            <img src={watch} alt="Watch" className="h-image" />
          </div>
        </div>
        <div className="right-pictures">
          <div className="img-wrapper">
            <img src={camera} alt="Camera" className="h-image" />
          </div>
          <div className="img-wrapper">
            <img src={laptop} alt="Laptop" className="h-image" />
          </div>
        </div>
      </div>

      <div className="pop-items">
        <div className="pop-items-h1">
          <h1>Popular Items</h1>
        </div>
        <div className="products-row">
          {popularItems.length > 0 ? (
            popularItems.map((product) => (
              <div key={product.id} className="product-card">
                <Link to={`/product/${product.id}`}>
                  <div className="product-image-container">
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : 'http://shopzone.miskiroland.com/storage/placeholder.jpg'}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => { e.target.src = 'http://shopzone.miskiroland.com/storage/placeholder.jpg'; }}
                    />
                  </div>
                </Link>
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p className="product-price">${product.price}</p>
                  <Link to={`/product/${product.id}`}>
                    <button className="view-product-btn">View Product</button>
                  </Link>
                </div>
              </div>
            ))
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

      {showCookieConsent && (
        <div className="cookie-consent">
          <p>
            This site uses cookies to enhance your user experience. For more information, see our{" "}
            <Link to="/privacy">Privacy Policy</Link> and <Link to="/terms">Terms & Conditions</Link>.
          </p>
          <button onClick={handleAcceptCookies}>Accept</button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Home;