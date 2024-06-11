import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContex';
import { useNavigate } from 'react-router-dom';

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
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('pdf', file);

        if (authData && authData.token) {
            try {
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/pdfs/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${authData.token}`
                    }
                });
                navigate('/');
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
        <div>
            <div>
                <h1>Home</h1>
            </div>
            <form onSubmit={handleUpload}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            <ul>
                {pdfs.map(pdf => (
                    <li key={pdf._id}>
                        <a href={`/pdf/${pdf._id}`} target="_blank" rel="noopener noreferrer">{pdf.originalname}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
