const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EntrySchema = new Schema({
    page:{
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Page'
    },
    category: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    stylings: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Entry', EntrySchema);