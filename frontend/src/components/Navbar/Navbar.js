import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between">
                <Link to="/" className="text-white text-lg font-bold">Home</Link>
                <Link to="/Login" className="text-white text-lg font-bold">Login</Link>
                <Link to="/Register" className="text-white text-lg font-bold">SignUp</Link>
            </div>
        </nav>
    );
};

export default Navbar;
