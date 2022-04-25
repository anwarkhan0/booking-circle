const AreasModel = require('./Location');
const HotelsModel = require('./Hotel');
// const AppartmentsModel = require('./appartmentsModel');
// const VehiclesModel = require('./vehiclesModel');
module.exports = {
    fetchAreas: ()=>{
        return AreasModel.find();
    }
  };
