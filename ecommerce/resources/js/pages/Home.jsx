import React from 'react';
import './Home.css';
import intro from './intro.png';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="h">
            <div className="intro">
                <h1>Select Your Perfect Electronics</h1>
                <span>Your go-to store for the best electronics at unbeatable prices</span>
                <Link to='/shop'>
                <button className="shop-btn">Shop Now</button> 
                </Link>
                
            </div>
            <div className="img">
                <img src={intro} alt="Electronics" />
            </div>
        </div>
    );
}

export default Home;
