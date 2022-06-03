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
  location: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  facilities: {
    type: {
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
        required: true
      },
      hotWater: {
        type: Boolean,
        required: true
      },
      heater: {
        type: Boolean,
        required: true
      }
    }
  },
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
    }
  },
  gallery:  [String],
  rooms: {
    type: {
      single:[{
        total: Number,
        charges: Number,
        videoUrl: String,
        size: String,
        occupancy: Number,
        View: Number,
        bedSize: String,
        description: String,
        Features: String
      }],
      twin:[{
        total: Number,
        charges: Number,
        videoUrl: String,
        size: String,
        occupancy: Number,
        View: Number,
        bedSize: String,
        description: String,
        Features: String
      }],
      triple:[{
        total: Number,
        charges: Number,
        videoUrl: String,
        size: String,
        occupancy: Number,
        View: Number,
        bedSize: String,
        description: String,
        Features: String
      }],
      quad:[{
        total: Number,
        charges: Number,
        videoUrl: String,
        size: String,
        occupancy: Number,
        View: Number,
        bedSize: String,
        description: String,
        Features: String
      }]
    }
  }
});

module.exports = mongoose.model("Hotels", HotelsSchema);
