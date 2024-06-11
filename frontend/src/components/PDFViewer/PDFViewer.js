import React, { useEffect, useState } from 'react';
import axios from './axiosConfig';
import { Document, Page, pdfjs } from 'react-pdf';
import { useParams } from 'react-router-dom';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Set the workerSrc globally for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = () => {
  const { id } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pdfs/${id}`, {
          responseType: 'blob',
        });
        const blobUrl = URL.createObjectURL(data);
        setPdfUrl(blobUrl);
      } catch (error) {
        console.error('Failed to fetch PDF', error);
        setError('Failed to fetch PDF');
      }
    };

    fetchPdf();

    // Cleanup blob URL on unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [id]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div>
      {error && <div>Error: {error}</div>}
      {pdfUrl && (
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(
            new Array(numPages),
            (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
              />
            ),
          )}
        </Document>
      )}
    </div>
  );
};

export default PDFViewer;
