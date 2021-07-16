const mongoose = require('mongoose');
const express = require('express');

mongoose.connect('mongodb://localhost:27017/docAppoint', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.get('/', (req, res) => {
    res.send('Application Initialized');
})

app.listen(3000, () => {
    console.log('serving on port 3000');
})