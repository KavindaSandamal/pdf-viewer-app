import React, { useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';

const Header = () => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div style={{ borderBottom: '1px solid white', paddingBottom: '10px', paddingTop: '10px'}}>
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-lg font-bold">HOME</Link>
                <div className="lg:hidden">
                    <button onClick={() => setShowMenu(!showMenu)} className="text-white focus:outline-none">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {showMenu ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
                <div className={`lg:flex items-center ${showMenu ? 'block' : 'hidden'}`}>
                    <div className="text-white text-lg font-bold mr-4 border border-white  px-4 py-2">
                        <Link to="/Login" className="block">Login</Link>
                    </div>
                    <div>
                        <Link to="/Register" className="btn bg-gradient-to-r from-blue-400 to-blue-700 text-white py-2 px-4 text-sm text-xl block">SignUp</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
