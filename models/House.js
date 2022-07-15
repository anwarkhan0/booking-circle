const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HousesSchema = new Schema({
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
  bedRooms: {
    type: Number,
    required: true
  }, 
  baths: {
    type: Number,
    required: true
  },
  area: {
    type: String,
    require: true
  },
  wifi: {
    type: Boolean,
    required: true
  },
  parking: {
    type: Boolean,
    required: true,
  },
  kitchen: {
    type: Boolean,
    required: true
  },
  secuirity: {
    type: Boolean,
    required: true
  },
  location: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  owner: {
    name: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true,
    },
    cnic: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
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
  reservations: [Object]
});

module.exports = mongoose.model('Houses', HousesSchema);
