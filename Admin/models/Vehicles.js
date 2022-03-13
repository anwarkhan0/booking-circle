const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VehiclesSchema = new Schema({
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'vehicleCategories',
        required: true
    },
    categoryName: {
        type: String,
        required: true
    },
    vehicleNo: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    seats: {
        type: String,
        required: true
    },
    availabilityStatus: {
        type: Boolean,
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    ownerCNIC: {
        type: String,
        required: true
    },
    ownerContact: {
        type: String,
        required: true
    },
    ownerArea: {
        type: String,
        required: true
    },
    ownerAddress: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    features: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    gallery: {
        type: [String],
        required: false
    },
    reservations: {
        type: [Object],
        required: false
    }
});

module.exports = mongoose.model('Vehicles', VehiclesSchema);
