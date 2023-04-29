const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { authenticateJWT } = require('./JWT.router.js');
const router = express.Router();

const randomBase64String = (length) => {
    const bytes = crypto.randomBytes(length);
    const base64String = bytes.toString('base64');
    return base64String.substr(0, length);
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images');
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const hashName = `${randomBase64String(64)}${fileExtension}`;
        cb(null, hashName);
    },
});

const upload = multer({ storage: storage }).single('image');

router.post('/upload',authenticateJWT, (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).send({
                message: 'Error uploading image',
                error: err,
            });
        } else {
            res.json({
                message: 'Image uploaded successfully',
                // imageName: req.file.filename,
                // file: req.file,
                imagePath: req.file.filename,
            });
        }
    });
});

module.exports = router;
