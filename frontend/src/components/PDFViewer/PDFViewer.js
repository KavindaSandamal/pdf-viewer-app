import React, { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import axios from 'axios';

const PDFViewer = ({ match }) => {
    const [pdf, setPdf] = useState(null);

    useEffect(() => {
        const fetchPdf = async () => {
            try {
                const { data } = await axios.get(`/api/pdfs/${match.params.id}`, {
                    responseType: 'blob'
                });
                const file = new Blob([data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                setPdf(fileURL);
            } catch (error) {
                console.error('Failed to fetch PDF', error);
            }
        };
        fetchPdf();
    }, [match.params.id]);

    return (
        <div>
            {pdf && (
                <Document file={pdf}>
                    <Page pageNumber={1} />
                </Document>
            )}
        </div>
    );
};

export default PDFViewer;
