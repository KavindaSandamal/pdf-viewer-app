const Pdf = require('../models/Pdf');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDFs are allowed'));
        }
    },
    limits: { fileSize: 25 * 1024 * 1024 } 
}).single('pdf');

exports.uploadPdf = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ error: 'File size exceeds the limit of 25MB' });
                } else {
                    return res.status(400).json({ error: err.message });
                }
            } else if (err.message === 'Only PDFs are allowed') {
                return res.status(400).json({ error: 'Only PDF files are allowed' });
            } else {
                return res.status(500).json({ error: 'An error occurred while uploading the file' });
            }
        }

        const { filename, originalname, path: filePath } = req.file;
        const { id } = req.user;

        try {
            const pdf = await Pdf.create({ filename, originalname, path: filePath, user: id });
            res.status(201).json(pdf);
        } catch (error) {
            res.status(500).json({ error: 'PDF upload failed', error });
        }
    });
};


exports.getPdfs = async (req, res) => {
    try {
        const pdfs = await Pdf.find({ user: req.user.id });
        res.json(pdfs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch PDFs', error });
    }
};

exports.viewPdf = async (req, res) => {
    try {
        const pdf = await Pdf.findById(req.params.id);
        if (!pdf) {
            return res.status(404).json({ error: 'PDF not found' });
        }
        res.sendFile(path.resolve(pdf.path));
    } catch (error) {
        res.status(500).json({ error: 'Failed to view PDF', error });
    }
};
