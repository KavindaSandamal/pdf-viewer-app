import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from './axiosConfig';
import { Document, Page, pdfjs } from 'react-pdf';
import { useParams } from 'react-router-dom';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import '../../index.css';
import { Icon } from "@iconify/react";
import { isMobile } from "react-device-detect";
import { MdFitScreen } from "react-icons/md";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = () => {
  const { id } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfZoom, setPdfZoom] = useState(1);
  const [error, setError] = useState(null);
  const [fitToPage, setFitToPage] = useState(false);
  const [inputPageNumber, setInputPageNumber] = useState('1');
  const viewerRef = useRef(null);
  const isScrollingRef = useRef(false);

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
      handlePageChange(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setInputPageNumber(page.toString());
    isScrollingRef.current = true; 
    const pageElement = document.getElementById(`page_${page}`);
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        isScrollingRef.current = false; 
      }, 300);
    }
  };

  const handlePageInputChange = (event) => {
    setInputPageNumber(event.target.value);
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(inputPageNumber, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= numPages) {
      handlePageChange(pageNumber);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handlePageInputSubmit();
    }
  };

  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const handleScroll = useCallback(debounce(() => {
    if (isScrollingRef.current) return;
    if (viewerRef.current) {
      const { scrollTop, offsetHeight } = viewerRef.current;
      const pageElements = viewerRef.current.querySelectorAll('.page-container');
      pageElements.forEach((pageElement, index) => {
        const { offsetTop, offsetHeight: pageHeight } = pageElement;
        if (scrollTop >= offsetTop - pageHeight / 2 && scrollTop < offsetTop + pageHeight / 2) {
          setCurrentPage(index + 1);
          setInputPageNumber((index + 1).toString());
        }
      });
    }
  }, 200), [numPages]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (viewer) {
      viewer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (viewer) {
        viewer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <div className="flex flex-col items-center w-full h-screen bg-stone-400 p-3">
      <div className="bg-stone-400 overflow-auto w-fit h-full" ref={viewerRef}>
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

          <input
            type="text"
            className="mx-4 text-md bg-white px-3 py-2 rounded-lg border-slate-400 border-2 h-fit"
            value={inputPageNumber}
            onChange={handlePageInputChange}
            onKeyPress={handleKeyPress}
            style={{ width: '50px', textAlign: 'center' }}
          />

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
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
