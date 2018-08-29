const mongoose = reqiure('mongoose');
const Schema = mongoose.Schema;

const MediaItem = new Schema({
    mediaType: {
        type: String,
        required: true
    },
    altText: {
        type: String,
        required: true
    },
    mediaData: {
        type: Buffer,
        reqiured: true
    }
});

module.exports = mongoose.model('Media', MediaItem);