import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import image from '../assets/books.jpg'; 
import Header from './Header';

const HeaderBanner2 = () => {
    return (
        <div>
            <div className="relative overflow-hidden">
                <div
                    className=" text-white relative"
                    style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center-bottom',
                        minHeight: '100%',
                        opacity: '0.9',
                        height:'100vh'
                        
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-40" />

                    <div className="absolute inset-0 " style={{ 
                    backgroundColor: '#0288D1',
                    opacity: '0.6',
                    
                    
                }} />
                    <div>
                    <div className="absolute inset-0  ">
                    <Header />
                    <div className="flex flex-col items-center justify-center h-screen ">
                    <div className="text-center text-white">
                        <h1 className="text-9xl font-bold mb-8">PDF Viewer </h1>
                        <h4 className="text-2xl font-light mb-6 font-sans">
                            View Your PDF With Free<br /> Join With US To Feel New Features
                        </h4>
                    </div>
                    <div className="mt-8">
                        <Link
                            to="/login"
                            className="btn btn-outline-light mr-4 text-white py-3 px-6 md:py-6 md:px-14 text-sm md:text-xl"
                            style={{ borderColor: 'white', borderWidth: '1px', textDecoration: 'none' }}
                        >
                            View PDF
                        </Link>
                        <Link
                            to="/register"
                            className="btn bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-6 md:py-6 md:px-14 text-sm md:text-xl"
                            style={{ textDecoration: 'none' }}
                        >
                            Join With US
                        </Link>
                    </div>
                    </div>
                    </div>
                    
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeaderBanner2;
