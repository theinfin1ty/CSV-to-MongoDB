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

module.exports = router;