import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaShoppingCart } from 'react-icons/fa';
import './Navbar.css';
import { CartContext } from './CartContext';

const Navbar = ({ isLoggedIn, userName, onLogout }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { cartItems } = useContext(CartContext); 
    const navigate = useNavigate();

    const handleCartClick = () => {
        navigate('/cart');
    };

    return (
        <nav className="navbar">
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
                        <FaUser className="nav-icon user-icon" onClick={() => window.location.href = '/login'} />
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
    );
};

export default Navbar;
