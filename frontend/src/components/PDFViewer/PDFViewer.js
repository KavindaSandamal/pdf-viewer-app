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
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfZoom, setPdfZoom] = useState(1);
  const [error, setError] = useState(null);
  const [fitToPage, setFitToPage] = useState(false);

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
    setPdfZoom(prevZoom => Math.min(Math.max(prevZoom + offset, PDF_INITIAL_SCALE), PDF_MAX_ZOOM));
  };

  const handleFitToPage = () => {
    setFitToPage(!fitToPage);
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const pageElement = document.getElementById(`page_${page}`);
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const pageElement = document.getElementById(`page_${currentPage}`);
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage]);

  return (
    <div className="flex flex-col items-center w-full h-screen bg-stone-400 p-3">
      <div className="bg-stone-400 overflow-auto w-fit h-full">
        {error && <div className="text-red-500">Error: {error}</div>}
        {pdfUrl && (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div key={`page_${index + 1}`} id={`page_${index + 1}`} className="page-container mb-5 last:mb-0 bg-stone-400">
                <Page pageNumber={index + 1} scale={fitToPage ? 'auto' : pdfZoom * 1.5} />
              </div>
            ))}
          </Document>
        )}
      </div>
      <div className="fixed left-0 right-0 bottom-3 bg-stone-700 w-fit m-auto p-2 rounded-lg opacity-[0.9]">
        <div className="flex items-center">
          <button
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${currentPage === 1 && 'text-slate-400'}`}
            onClick={goToPrevPage}
          >
            <span className="text-md text-white">Back</span>
          </button>

          <div>
            <p className="mx-4 text-md bg-white px-3 py-2 rounded-lg border-slate-400 border-2 h-fit">
              {currentPage}
            </p>
          </div>

          <button
            disabled={currentPage === numPages}
            className={`p-2 rounded-lg ${currentPage === numPages && 'text-slate-400'}`}
            onClick={goToNextPage}
          >
            <span className="text-md text-white">Next</span>
          </button>

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
            className="text-[2rem] px-3 text-white focus:outline-none"
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
