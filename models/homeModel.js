const AreasModel = require('../Admin/models/Location');
const HotelsModel = require('../Admin/models/Hotel');
// const AppartmentsModel = require('./appartmentsModel');
// const VehiclesModel = require('./vehiclesModel');
module.exports = {
    fetchAreas: ()=>{
        return AreasModel.find();
    }
  };
