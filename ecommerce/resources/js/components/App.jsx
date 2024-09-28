import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
const App = () => {
    return (
       <BrowserRouter>
       <Navbar />
        <Routes>
        <Route path="/" element={<Home />} /> {/* Főoldal */}
        <Route path="/shop" element={<Shop />} />
        </Routes>
       </BrowserRouter>
    );
}

export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}