const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const csvSchema = new Schema({
    filePath: {
        type: String
    },
    fileName: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('CSV', csvSchema);