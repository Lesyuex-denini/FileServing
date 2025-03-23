const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const multer = require('multer');
const express = require('express');

const app = express();
const upload = multer({ dest: 'uploads/' });

const publicDirectory = path.join(__dirname, 'public'); // Correct public folder path
app.use(express.static(publicDirectory));

// File upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send('File uploaded successfully');
});

// Serve static files and handle 404 errors
app.use((req, res, next) => {
    let filePath = path.join(publicDirectory, req.url === '/' ? 'index.html' : req.url);

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.status(404).send('<h1>404 - File Not Found</h1>');
            } else {
                res.status(500).send(`Server Error: ${err.code}`);
            }
        } else {
            res.setHeader('Content-Type', mime.lookup(filePath) || 'application/octet-stream');
            res.send(content);
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
