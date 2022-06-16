const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const HotelsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  stars: {
    type: Number,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true
  },
  parking: {
    type: Boolean,
    required: true,
  },
  roomService: {
    type: Boolean,
    required: true,
  },
  wifi: {
    type: Boolean,
    required: true,
  },
  hotWater: {
    type: Boolean,
    required: true,
  },
  heater: {
    type: Boolean,
    required: true,
  },
  description: String,
  features: String,
  owner: {
    name: {
      type: String,
      required: true,
    },
    cnic: {
      type: String,
      required: true,
    },
    contact: {
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
  gallery: [String],
  rooms: {
    single: {
      total: Number,
      charges: Number,
      videoUrl: String,
      size: String,
      occupancy: Number,
      view: Number,
      bedSize: String,
      reservations: [{
        roomNo: Number,
        user: Object,
        date: Date,
        checkIn: Date,
        checkOut: Date,
        noOfRooms: Number,
        confirm: Boolean
      }]
    },
    twin: {
      total: Number,
      charges: Number,
      videoUrl: String,
      size: String,
      occupancy: Number,
      view: Number,
      bedSize: String,
      reservations: [{
        roomNo: Number,
        user: Object,
        date: Date,
        checkIn: Date,
        checkOut: Date,
        noOfRooms: Number,
        confirm: Boolean
      }]
    },
    triple: {
      total: Number,
      charges: Number,
      videoUrl: String,
      size: String,
      occupancy: Number,
      view: Number,
      bedSize: String,
      reservations: [{
        roomNo: Number,
        user: Object,
        date: Date,
        checkIn: Date,
        checkOut: Date,
        noOfRooms: Number,
        confirm: Boolean
      }]
    },
    quad: {
      total: Number,
      charges: Number,
      videoUrl: String,
      size: String,
      occupancy: Number,
      view: Number,
      bedSize: String,
      reservations: [{
        roomNo: Number,
        user: Object,
        date: Date,
        checkIn: Date,
        checkOut: Date,
        noOfRooms: Number,
        confirm: Boolean
      }]
    },
    quin: {
      total: Number,
      charges: Number,
      videoUrl: String,
      size: String,
      occupancy: Number,
      view: Number,
      bedSize: String,
      reservations: [{
        roomNo: Number,
        user: Object,
        date: Date,
        checkIn: Date,
        checkOut: Date,
        noOfRooms: Number,
        confirm: Boolean
      }]
    },
    gallery: [String]
  }
});

module.exports = mongoose.model("Hotels", HotelsSchema);
