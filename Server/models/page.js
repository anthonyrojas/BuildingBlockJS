const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PageSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: [Schema.Types.ObjectId],
        ref: 'Entry',
        required: false
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Page',
        required: false
    }
});
module.exports = mongoose.model('Page', PageSchema);