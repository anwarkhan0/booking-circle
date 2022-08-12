const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AppartmentsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  charges: {
    type: Number,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  occupancy: {
    type: Number,
    required: true
  },
  parking: {
    type: Boolean,
    required: true,
  },
  wifi: {
    type: Boolean,
    required: true
  },
  secuirity: {
    type: Boolean,
    required: true
  },
  kitchen: {
    type: Boolean,
    required: true
  },
  tv: {
    type: Boolean,
    required: true
  },
  cleaning: {
    type: Boolean,
    required: true
  },
  pets: {
    type: Boolean,
    required: true
  },
  livingArea: {
    type: Boolean,
    required: true
  },
  view: {
    type: Boolean,
    required: true
  },
  area: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  ownerCNIC: {
    type: String,
    required: true,
  },
  ownerContact: {
    type: String,
    required: true,
  },
  loginEmail: {
    type: String,
    required: true,
  },
  loginPassword: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: false,
    default: false
  },
  gallery: {
    type: [String],
    required: false,
  },
  reservations: [Object]
});

module.exports = mongoose.model('Appartments', AppartmentsSchema);
