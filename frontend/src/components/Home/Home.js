import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContex';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar'; 
import { FiFileText } from 'react-icons/fi';

const Home = () => {
    const { authData } = useContext(AuthContext);
    const [pdfs, setPdfs] = useState([]);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPdfs = async () => {
            if (authData && authData.token) {
                try {
                    const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pdfs`, {
                        headers: {
                            Authorization: `Bearer ${authData.token}`
                        }
                    });
                    setPdfs(data);
                } catch (error) {
                    console.error('Failed to fetch PDFs', error);
                }
            }
        };
        fetchPdfs();
    }, [authData]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };
    
    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        setFile(droppedFile);
    };
    
    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('pdf', file);

        if (authData && authData.token) {
            try {
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/pdfs/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${authData.token}`
                    }
                });
                // Redirect to PDFViewer with the id of the uploaded PDF
                navigate(`/pdf/${response.data._id}`);
            } catch (error) {
                console.error('Failed to upload PDF', error);
            }
        } else {
            console.error('No auth token available');
        }
    };

    if (!authData) {
        return <p>Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-blue-100">
            <Navbar />
            <div className="container mx-auto py-12 px-4 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800">Welcome to PDF Viewer</h1>
                    <p className="text-gray-600 mt-2">Upload and manage your PDF files easily</p>
                </div>
                <form onSubmit={handleUpload} className="bg-white shadow-md rounded-lg p-8 max-w-4xl mx-auto">
                    <label 
                        htmlFor="fileInput" 
                        className="border border-dashed border-gray-400 p-12 mb-4 cursor-pointer flex flex-col items-center justify-center transition duration-300 ease-in-out transform hover:scale-105 bg-gray-50 rounded-md w-full" 
                        onDragOver={handleDragOver} 
                        onDrop={handleDrop}
                    >
                        {file ? (
                            <div className="flex items-center space-x-2">
                                <FiFileText size={48} className="text-blue-500 transition duration-300 ease-in-out transform hover:scale-110" />
                                <span className="text-gray-700 font-medium transition duration-300 ease-in-out transform hover:text-blue-700">{file.name}</span>
                            </div>
                        ) : (
                            <span className="text-gray-500">Drag & Drop or Click to Browse</span>
                        )}
                        <input type="file" id="fileInput" onChange={handleFileChange} className="hidden" />
                    </label>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">View</button>
                </form>
                {pdfs.length > 0 && (
                    <div className="mt-8 max-w-4xl mx-auto">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recently Viewed PDFs</h2>
                        <ul className="bg-white shadow-md rounded-lg p-4">
                            {pdfs.map(pdf => (
                                <li key={pdf._id} className="border-b border-gray-200 last:border-0 py-2">
                                    <a href={`/pdf/${pdf._id}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{pdf.originalname}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
