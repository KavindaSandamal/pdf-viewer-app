import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';

import logo from '../assets/white-text.png';

const Header = () => {
   return (
        <div style={{ borderBottom: '1px solid white', paddingBottom: '10px', paddingTop: '10px' }}>
            <div className="container mx-auto flex justify-between items-center" >
                <Link to="/" className="text-white text-lg font-bold">HOME</Link>
                <div className="flex items-center">
                    <Link to="/Login" className="text-white text-lg font-bold mr-4 border border-white  px-4 py-2">Login</Link>
                    <Link to="/Register" className="btn bg-gradient-to-r from-blue-400 to-blue-700 text-white py-2 px-4 text-sm text-xl">SignUp</Link>
                </div>
            </div>
        </div>
    );
}

export default Header;
