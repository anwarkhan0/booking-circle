const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GallerySchema = new Schema({
    images: {
        type:  [String],
        required: true
    }
});


module.exports = mongoose.model('SliderGallery', GallerySchema);