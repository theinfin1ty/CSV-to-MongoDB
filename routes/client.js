const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');
const csvToJSON = require('csvtojson');
const CSV = require('../models/csv');
const Data = require('../models/data');
const { isLoggedIn } = require('../middleware');

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        try {
            const userId = req.user._id;
            const dir = `uploads/${userId}`;
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

// const csvFilter = (req, file, cb) => {
//     if(file.mimetype.includes("csv")){
//         cb(null, true);
//     } else {
//         cb("Please upload only csv file", false);
//     } , fileFilter: csvFilter 
// }

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
            const content = await Data.insertMany(jsonObj);
            req.flash('success', 'File uploaded and data saved to DB successfully');
            res.redirect('/client');
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
    const datas = await Data.find({ file: csv._id });
    var contents = JSON.parse(JSON.stringify(datas));
    res.render('client/data', { contents, headers, fileId });
}))

router.get('/select/:fileId/new', isLoggedIn, catchAsync(async (req, res) => {
    const { fileId } = req.params;
    const csv = await CSV.findById(fileId);
    const headers = csv.headers;
    res.render('client/new', { headers, fileId });
}))

router.post('/select/:fileId', isLoggedIn, catchAsync(async (req, res) => {
    const { fileId } = req.params;
    const values = req.body;
    const csv = await CSV.findById(fileId);
    const data = await new Data(values);
    await data.save();
    await Data.findByIdAndUpdate(data._id, {file: csv._id});
    req.flash('success', 'Successfully added a data entry');
    res.redirect(`/client/select/${csv._id}`);
}))

router.get('/select/:fileId/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { fileId, id } = req.params;
    const csv = await CSV.findById(fileId);
    const headers = csv.headers;
    const data = await Data.findOne({ _id: id });
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
    console.log(values);
    const data = await Data.findByIdAndUpdate(id, values);
    req.flash('success', 'Data entry updated successfully');
    res.redirect(`/client/select/${fileId}`);
}))

router.delete('/select/:fileId/:id', isLoggedIn, catchAsync(async(req, res) => {
    const { fileId, id } = req.params;
    await Data.findByIdAndDelete(id);
    req.flash('success','Data entry successfully deleted');
    res.redirect(`/client/select/${fileId}`);
}))

module.exports = router;