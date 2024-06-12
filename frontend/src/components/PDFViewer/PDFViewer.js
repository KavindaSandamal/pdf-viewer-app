import React, { useEffect, useState } from 'react';
import axios from './axiosConfig';
import { Document, Page, pdfjs } from 'react-pdf';
import { useParams } from 'react-router-dom';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import '../../index.css';
import { Icon } from "@iconify/react";
import { isMobile } from "react-device-detect";
import { MdFitScreen } from "react-icons/md";

// Set the workerSrc globally for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = () => {
  const { id } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pdfZoom, setPdfZoom] = useState(1);
  const [error, setError] = useState(null);
  const [fitToPage, setFitToPage] = useState(false); // New state for fitting PDF to page

  const PDF_INITIAL_SCALE = isMobile ? 0.6 : 1;
  const PDF_MAX_ZOOM = PDF_INITIAL_SCALE + 1;

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

  const handleZoomChange = (offset) => {
    setPdfZoom(prevZoom => prevZoom + offset);
  };

  const handleFitToPage = () => {
    setFitToPage(!fitToPage);
  };

  return (
    <div className="flex flex-col items-center w-full h-screen bg-stone-400 p-3">
      <div className="bg-gray-200  overflow-auto w-fit">
        {error && <div className="text-red-500">Error: {error}</div>}
        {pdfUrl && (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            options={{ scrollMode: 'vertical' }}
          >
            {Array.from(
              new Array(numPages),
              (el, index) => (
                <div key={`page_${index + 1}`} className="mb-8 bg-gray-200">
                  <Page pageNumber={index + 1} scale={fitToPage ? 'auto' : pdfZoom * 1.5} />
                </div>
              )
            )}
          </Document>
        )}
      </div>
      <div className="fixed left-0 right-0 bottom-3 bg-stone-700 w-fit m-auto p-2 rounded-lg opacity-[0.9]">
        <div className="flex items-center">
          <button
            type="button"
            className={`text-white text-[2rem] px-3 ${pdfZoom <= PDF_INITIAL_SCALE ? 'text-[silver]' : 'text-white'}`}
            onClick={() => handleZoomChange(-0.2)}
          >
            <Icon icon="material-symbols:zoom-out" />
          </button>

          <button
            type="button"
            className={`text-[2rem] px-3 ${pdfZoom >= PDF_MAX_ZOOM ? 'text-[silver]' : 'text-white'}`}
            onClick={() => handleZoomChange(0.2)}
          >
            <Icon icon="material-symbols:zoom-in" />
          </button>

          <button
            type="button"
            className="text-[2rem] px-3 text-white"
            onClick={handleFitToPage}
          >
            <MdFitScreen /> 
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
