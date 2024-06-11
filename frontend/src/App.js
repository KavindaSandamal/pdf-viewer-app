import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PDFViewerContainer from './pages/PDFViewer'; // Import PDFViewerContainer

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/pdf/:id" element={<PDFViewerContainer />} /> {/* Use PDFViewerContainer */}
            </Routes>
        </Router>
    );
}

export default App;
