import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaArrowUp, FaBars } from 'react-icons/fa';
import './Navbar.css';
import { CartContext } from './CartContext';

const Navbar = ({ isLoggedIn, userName, onLogout }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isScrollButtonVisible, setIsScrollButtonVisible] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Hamburger menü állapota
    const { cartItems } = useContext(CartContext); 
    const navigate = useNavigate();

    useEffect(() => {
        const toggleScrollButton = () => {
            if (window.scrollY > 200) {
                setIsScrollButtonVisible(true);
            } else {
                setIsScrollButtonVisible(false);
            }
        };

        window.addEventListener('scroll', toggleScrollButton);

        return () => window.removeEventListener('scroll', toggleScrollButton);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleCartClick = () => {
        navigate('/cart');
    };
    const handleLoginClick = () => {
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-brand">
                    <Link to="/">
                        <span className="brand-shop">Shop</span>
                        <span className="brand-zone">Zone</span>
                    </Link>
                </div>
                <div className="hamburger" onClick={toggleMenu}>
                    <FaBars className="hamburger-icon" />
                </div>
                <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                    <li>
                        <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    </li>
                    <li>
                        <Link to="/shop" onClick={() => setIsMenuOpen(false)}>Shop</Link>
                    </li>
                    <li>
                        <Link to="/latest" onClick={() => setIsMenuOpen(false)}>Latest</Link>
                    </li>
                    <li>
                        <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                    </li>
                </ul>
                <div className="nav-icons">
                    <div className="cart-container" onClick={handleCartClick}>
                        <FaShoppingCart className="nav-icon cart-icon" />
                        {cartItems.length > 0 && (
                            <span className="cart-count">{cartItems.length}</span>
                        )}
                    </div>
                    <div className="user-menu">
                        {!isLoggedIn ? (
                            <FaUser className="nav-icon user-icon" onClick={handleLoginClick} />
                        ) : (
                            <>
                                <FaUser className="nav-icon user-icon" onClick={() => setIsDropdownOpen(!isDropdownOpen)} />
                                <span className="user-name">{userName}</span>
                                {isDropdownOpen && (
                                    <div className="user-dropdown">
                                        <Link to="/profile">Profile</Link>
                                        <button onClick={onLogout}>Logout</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </nav>
            <div className={`scroll-to-top-button ${isScrollButtonVisible ? 'visible' : ''}`}>
                <button onClick={scrollToTop} aria-label="Back to top">
                    <FaArrowUp />
                </button>
            </div>
        </>
    );
};

export default Navbar;