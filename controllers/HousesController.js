const bcrypt = require("bcrypt");
const { validationResult, check } = require("express-validator");
const Safepay = require("safepay");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const HomeModel = require("../models/homeModel");
const AreasModel = require("../models/Location");
const AppartmentModel = require("../models/Appartment");
const Houses = require("../models/House");
const HotelsModel = require("../models/Hotel");
const VehiclesModel = require("../models/Vehicles");
const ToursModel = require("../models/Tour");
const NewsModel = require("../models/Updates");
const UsersModel = require("../models/usersModel");
const MessageModel = require("../models/Message");
const sliderGallery = require("../models/SliderGallery");
const subscribeModel = require("../models/subscribeModel");
const queryModel = require("../models/Query");
const Feedbacks = require("../models/Feedback");
const checkout = require("safepay/dist/resources/checkout");
const { findByIdAndDelete } = require("../models/Location");
const houses = async (req, res, next) => {
    //areas
    const areas = await AreasModel.find();
    //fetch appartments
    const houses = await Houses.find();
    res.render("./pages/Houses/houseList", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      areas: areas,
      houses: houses,
    });
  };
  
  const houseInfo = async (req, res)=>{
    const id = req.params.id;
    const house = await Houses.findById(id);
    res.render("./pages/Houses/houseDetails", {
      flashMessage: '',
      oldInput: {
        checkIn: "",
        checkOut: "",
        adults: false,
        children: false,
      },
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      house: house,
    });
  }


module.exports = {
    houses,
    houseInfo  
}