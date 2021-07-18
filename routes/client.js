const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const client = require('../controllers/client');
const { isLoggedIn } = require('../middleware');

const upload = client.upload;

router.get('/', isLoggedIn, client.index);

router.post('/', isLoggedIn, upload.single("file"), catchAsync(client.fileUpload))

router.get('/select', isLoggedIn, catchAsync(client.selectFile))

router.get('/select/:fileId', isLoggedIn, catchAsync(client.viewFileContents))

router.delete('/select/:fileId', isLoggedIn, catchAsync(client.deleteFile))

router.get('/select/:fileId/new', isLoggedIn, catchAsync(client.renderNewEntryForm))

router.post('/select/:fileId', isLoggedIn, catchAsync(client.saveNewEntry))

router.get('/select/:fileId/:id', isLoggedIn, catchAsync(client.renderEditForm))

router.put('/select/:fileId/:id', isLoggedIn, catchAsync(client.updateEntry))

router.delete('/select/:fileId/:id', isLoggedIn, catchAsync(client.deleteEntry))

module.exports = router;