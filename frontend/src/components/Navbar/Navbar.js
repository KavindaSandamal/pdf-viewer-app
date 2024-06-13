import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ handleLogOut }) => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between">
                <Link to="#" className="text-white text-lg font-bold">Home</Link>
                <button className="text-white text-lg font-bold" onClick={handleLogOut}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
