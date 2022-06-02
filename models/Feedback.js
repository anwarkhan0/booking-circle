const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FeedbacksSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    publish: {
        type: Boolean,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('feedbacks', FeedbacksSchema);
