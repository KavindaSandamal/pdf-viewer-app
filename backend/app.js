const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const winston = require('winston');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/userRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

dotenv.config();

connectDB();

const app = express();  // Initialize app here

app.use(cors());  // Now you can use app
app.use(express.json());
app.use(morgan('combined'));

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

app.use('/api/auth', authRoutes);
app.use('/api/pdfs', pdfRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
