import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContex';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { FiFileText } from 'react-icons/fi';
import useIdle from '../../hooks/useIdleTimer';
import Modal from 'react-modal';

const Home = () => {
    const { authData } = useContext(AuthContext);
    const [pdfs, setPdfs] = useState([]);
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null); 
    const navigate = useNavigate();
    const [remainingTime, setRemainingTime] = useState(0);
  
    const handleIdle = () => {
        setRemainingTime(30); 
    };
  
    const { isIdle } = useIdle({ onIdle: handleIdle, idleTime: 1});
  
    useEffect(() => {
        let interval;
  
        if (isIdle) {
            interval = setInterval(() => {
                setRemainingTime(prevRemainingTime => (prevRemainingTime > 0 ? prevRemainingTime - 1 : 0));
            }, 1000);
        }
  
        return () => clearInterval(interval);
    }, [isIdle]);
  
    useEffect(() => {
        if (remainingTime === 0 && isIdle) {
            navigate("/login");
        }
    }, [remainingTime, isIdle, navigate]);
  
    const handleLogOut = () => {
        console.log("Logout function called");
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            localStorage.removeItem("authToken");
            navigate("/login");
        }
    };
    
    const handleStayLoggedIn = () => {
        setRemainingTime(30); 
    };
  
    function millisToMinutesAndSeconds(millis) {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

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
    
        if (!file) {
            setErrorMessage('Please select a PDF file');
            return;
        }
    
        const formData = new FormData();
        formData.append('pdf', file);
    
        if (authData && authData.token) {
            if (file.size > 25 * 1024 * 1024) { 
                setErrorMessage('File size exceeds the limit (25MB)');
                return; 
            }
    
            try {
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/pdfs/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${authData.token}`
                    }
                });
                navigate(`/pdf/${response.data._id}`);
            } catch (error) {
                console.error('Failed to upload PDF', error);
                setErrorMessage('Failed to view PDF. File size should be under 25MB.');
            }
        } else {
            console.error('No auth token available');
            setErrorMessage('No auth token available');
        }
    };
    
    

    if (!authData) {
        return <p>Loading...</p>;
    }
    console.log("isIdle:", isIdle);
    
    return (
        <>
        <Modal isOpen={isIdle && remainingTime <= 30 && remainingTime > 0} onRequestClose={handleStayLoggedIn}>
            <div>
                <h2>Idle Timeout Warning</h2>
                <p>You are about to be logged out due to inactivity.</p>
                <p>Time remaining: {millisToMinutesAndSeconds(remainingTime * 1000)}</p>
                <button onClick={handleLogOut}>Logout</button>
                <button onClick={handleStayLoggedIn}>Stay Logged In</button>
            </div>
        </Modal>

        <div className="min-h-screen bg-blue-100">
        <Navbar handleLogOut={handleLogOut} />

            <div className="container mx-auto py-12 px-4 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800">Welcome to PDF Viewer</h1>
                    <p className="text-gray-600 mt-2">Upload and manage your PDF files easily</p>
                </div>
                <form onSubmit={handleUpload} className="bg-white shadow-md rounded-lg p-8 max-w-4xl mx-auto">
                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline">{errorMessage}</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <title>Close</title>
                                    <path fillRule="evenodd" d="M14.354 5.354a2 2 0 0 0-2.828 0L10 7.172 7.172 5.354a2 2 0 1 0-2.828 2.828L7.172 10l-2.828 2.828a2 2 0 1 0 2.828 2.828L10 12.828l2.828 2.828a2 2 0 1 0 2.828-2.828L12.828 10l2.828-2.828a2 2 0 0 0 0-2.828z"/>
                                </svg>
                            </span>
                        </div>
                    )}
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
        </>
    );
};

export default Home;
