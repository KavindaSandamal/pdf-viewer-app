// PDFViewer.js
import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import axios from './axiosConfig';
import { useParams } from 'react-router-dom';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = () => {
    const { id } = useParams();
    const [pdf, setPdf] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPdf = async () => {
            try {
                if (!id) {
                    setError('No document ID provided');
                    return;
                }

                const token = localStorage.getItem('token');
                console.log("Token:", token);

                const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pdfs/${id}`, {
                    responseType: 'blob'
                });
                const file = new Blob([data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                setPdf(fileURL);
            } catch (error) {
                console.error('Failed to fetch PDF', error);
                setError('Failed to load PDF document');
            }
        };
        fetchPdf();
    }, [id]);

    return (
        <div>
            {error && <div>Error: {error}</div>}
            {pdf && (
                <Document
                    file={pdf}
                    onLoadError={(error) => setError('Error loading PDF document')}
                >
                    <Page pageNumber={1} />
                </Document>
            )}
        </div>
    );
};

export default PDFViewer;
