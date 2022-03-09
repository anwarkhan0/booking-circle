const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuerySchema = new Schema({
    email: {
        type: String,
        required: true
    },
    query: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('queries', QuerySchema);
