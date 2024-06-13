import React from 'react';

const Footer = () => {
    return (
        <div className="footer4 border-t-2  pt-8 " style={{ marginTop: '4px' }}>
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="m-b-8">
                        <h5 className="text-lg font-semibold mb-4">Address</h5>
                        <p>Chilaw, Sri Lanka</p>
                    </div>
                    <div className="m-b-8">
                        <h5 className="text-lg font-semibold mb-4">Phone</h5>
                        <p>Reception :  +94 715691911 </p>
                    </div>
                    <div className="m-b-8">
                        <h5 className="text-lg font-semibold mb-4">Email</h5>
                        <p>Email :  <a href="#" className="text-blue-500 hover:underline">info.kavindasandamal@gmail.com</a> </p>
                    </div>
                </div>
                <div className="border-t-2 border-gray-200 mt-8 py-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">All Rights Reserved by KavindaSandamal</div>
                    <div className="text-sm text-gray-600">
                        <a href="#" className="px-4 py-2 text-blue-500 hover:underline">Terms of Use</a>
                        <a href="#" className="px-4 py-2 text-blue-500 hover:underline">Legal Disclaimer</a>
                        <a href="#" className="px-4 py-2 text-blue-500 hover:underline">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
