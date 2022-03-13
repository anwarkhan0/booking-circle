const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const HotelsSchema = new Schema({
  name: {
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
  area: {
    type: String,
    required: true,
  },
  roomService: {
    type: Boolean,
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
  approvedStatus: {
    type: Boolean,
    required: true,
  },
  gallery: {
    type: [String],
    required: false,
  },
  rooms: {
    type: [
      {
        roomNo: String,
        beds: String,
        hotWater: Boolean,
        balcony: Boolean,
        status: Boolean,
        location: String,
        charges: Number,
        size: String,
        occupency: Number,
        bedSize: String,
        description: String,
        features: String,
        videoUrl: String,
        gallery: [String],
        reservations: [{
          user: Object,
          checkIn: Date,
          checkOut: Date,
          adults: Number,
          children: Number,
          date: Date
        }]
      },
    ],
    required: false,
  },
});

module.exports = mongoose.model("Hotels", HotelsSchema);
