const express = require('express');
const { uploadPdf, getPdfs, viewPdf } = require('../controllers/pdfController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/upload', protect, uploadPdf);
router.get('/', protect, getPdfs);
router.get('/:id', protect, viewPdf);

module.exports = router;
