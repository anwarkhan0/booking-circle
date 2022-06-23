const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AppartmentsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
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
    required: true,
  },
  gallery: {
    type: [String],
    required: false,
  },
  reservations: [{
    user: Object,
    checkIn: Date,
    checkOut: Date,
    adults: Number,
    children: Number,
    date: Date
  }]
});

module.exports = mongoose.model('Appartments', AppartmentsSchema);
