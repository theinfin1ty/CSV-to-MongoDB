const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');
const csvToJSON = require('csvtojson');
const CSV = require('../models/csv');
const Content = require('../models/content');
const { isLoggedIn } = require('../middleware');

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        try {
            const userId = req.user._id;
            const dir = `uploads`;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            cb(null, dir);
        }
        catch (e) {
            console.log(e);
        }    
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, originalname);
    }
})

const upload = multer({ storage: storage });

router.get('/', isLoggedIn, (req, res) => {
    res.render('client/index');
})

router.post('/', isLoggedIn, upload.single("file"), catchAsync(async(req, res) => {
    try{
            if(req.file == undefined){
                req.flash("error", "Please upload a csv file");
                return res.redirect('/client');
            }
            const csv = await new CSV({ filePath: req.file.path, fileName: req.file.filename, user: req.user })
            await csv.save();
            csvToJSON()
            .fromFile(csv.filePath)
            .then(catchAsync(async(jsonObj)=>{
                headers = Object.keys(jsonObj[0]);
                csv.headers = headers;
                await csv.save();
                jsonObj.map((obj) => {
                    obj.file = csv._id;
                })
                await Content.insertMany(jsonObj);
                fs.unlink(csv.filePath, (err) => {
                    if (err) {
                        console.log(err);
                    }
                })
            req.flash('success', 'File uploaded and data saved to DB successfully');
            res.redirect('/client/select');
        }));

    } catch(error) {
        console.log("catch error-", error);
        req.flash("error", "Could not upload the file");
        res.redirect('/client');
    }
}))

router.get('/select', isLoggedIn, catchAsync(async (req, res) => {
    const csvs = await CSV.find({ user: req.user._id });
    res.render('client/select', { csvs });
}))

router.get('/select/:fileId', isLoggedIn, catchAsync(async (req, res) => {
    const { fileId } = req.params;  
    const csv = await CSV.findById(fileId);
    const headers = csv.headers;
    const data = await Content.find({ file: csv._id });
    var contents = JSON.parse(JSON.stringify(data));
    res.render('client/data', { contents, headers, fileId });
}))

router.post('/select/:fileId', isLoggedIn, catchAsync(async (req, res) => {
    const { fileId } = req.params;
    const values = req.body;
    const csv = await CSV.findById(fileId);
    const data = await new Content(values);
    await data.save();
    await Content.findByIdAndUpdate(data._id, {file: csv._id});
    req.flash('success', 'Successfully added a data entry');
    res.redirect(`/client/select/${csv._id}`);
}))

router.delete('/select/:fileId', isLoggedIn, catchAsync(async (req, res) => {
    const { fileId } = req.params;
    const csv = await CSV.findById(fileId);
    await CSV.findByIdAndDelete(fileId);
    const content = await Content.deleteMany({ file: csv._id });
    console.log(content);
    req.flash('success', 'Successfully deleted the file');
    res.redirect('/client/select');
}))

router.get('/select/:fileId/new', isLoggedIn, catchAsync(async (req, res) => {
    const { fileId } = req.params;
    const csv = await CSV.findById(fileId);
    const headers = csv.headers;
    res.render('client/new', { headers, fileId });
}))

router.get('/select/:fileId/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { fileId, id } = req.params;
    const csv = await CSV.findById(fileId);
    const headers = csv.headers;
    const data = await Content.findOne({ _id: id });
    if(!data)
    {
        req.flash("error", "Could not find data");
        res.redirect(`/client/select/${csv._id}`);
    }
    var content = JSON.parse(JSON.stringify(data));
    res.render('client/edit', { fileId, content, headers });
}))

router.put('/select/:fileId/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { fileId, id } = req.params;
    const values = req.body;
    const data = await Content.findByIdAndUpdate(id, values);
    req.flash('success', 'Data entry updated successfully');
    res.redirect(`/client/select/${fileId}`);
}))

router.delete('/select/:fileId/:id', isLoggedIn, catchAsync(async(req, res) => {
    const { fileId, id } = req.params;
    await Content.findByIdAndDelete(id);
    req.flash('success','Data entry successfully deleted');
    res.redirect(`/client/select/${fileId}`);
}))

module.exports = router;