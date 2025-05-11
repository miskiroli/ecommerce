import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaShoppingCart, FaArrowUp } from 'react-icons/fa';
import './Navbar.css';
import { CartContext } from './CartContext';

const Navbar = ({ isLoggedIn, userName, onLogout }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isScrollButtonVisible, setIsScrollButtonVisible] = useState(false);
    const { cartItems } = useContext(CartContext); 
    const navigate = useNavigate();

    // Görgetési esemény figyelése a felfelé gombhoz
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

    // Az oldal tetejére ugrás
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

    return (
        <>
            <nav className="navbar">
                <div className="navbar-brand">
                    <Link to="/">
                        <span className="brand-shop">Shop</span>
                        <span className="brand-zone">Zone</span>
                    </Link>
                </div>
                <ul className="nav-links">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/shop">Shop</Link>
                    </li>
                    <li>
                        <Link to="/latest">Latest</Link>
                    </li>
                    <li>
                        <Link to="/contact">Contact</Link>
                    </li>
                </ul>
                <div className="nav-icons">
                    <div className="search-container">
                        <FaSearch className="nav-icon search-icon" onClick={() => setIsSearchOpen(!isSearchOpen)} />
                        {isSearchOpen && (
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search products..."
                            />
                        )}
                    </div>
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
                <button onClick={scrollToTop} aria-label="Vissza az oldal tetejére">
                    <FaArrowUp />
                </button>
            </div>
        </>
    );
};

export default Navbar;