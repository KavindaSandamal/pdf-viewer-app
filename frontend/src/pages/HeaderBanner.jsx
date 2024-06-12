import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import image from '../assets/books.jpg'; // Import your image file
import Header from './Header';

const HeaderBanner2 = () => {
    return (
        <div>
            <Header />
            <div className="flex justify-center items-center h-full relative z-10 py-20"  >
            <div className="lg:w-2/3 text-center py-20"> 
                <h1 className="text-9xl font-bold mb-8 text-white">PDF Viewer</h1>
                <h4 className="text-2xl font-light mb-6 text-white font-sans py-5">View Your PDF With Free<br /> Join With US To Feel New Features</h4> {/* Adjusted py value */}
                <Link to="/login"  className="btn btn-outline-light mr-4 text-white py-6 px-14 text-sm text-xl" style={{ borderColor: 'white', borderWidth: '1px' }}>View PDF</Link>
                <Link to="/register" className="btn bg-gradient-to-r from-blue-500 to-blue-700 text-white py-6 px-14 text-sm text-xl" >Join With US</Link>
            </div>
            </div>
            <div className="static-slider-head banner2 text-white relative" style={{ 
                backgroundImage: `url(${image})`, // Use backticks for dynamic URLs
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: 'calc(110vh - 100px)', // Adjust the height here
                zIndex: '-1',
                marginTop: '-710px', // Add negative margin to extend from the top
                opacity: '0.9'
            }}>
                <div className="absolute inset-0" style={{ 
                    background: 'linear-gradient(to bottom, rgba(1,1,1,1), rgba(1,1,1,1))',
                    zIndex: '1',
                    opacity: '0.4',
                }}></div>
                <div className="absolute inset-0" style={{ 
                    backgroundColor: '#0288D1',
                    opacity: '0.6',
                    zIndex: '2',
                }}></div>
                
                
            </div>
        </div>
    );
}

export default HeaderBanner2;
