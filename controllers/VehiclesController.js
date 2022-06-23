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

const vehicles = async (req, res, next) => {
    //areas
    const areas = await AreasModel.find();
    //vehicles
    const vehicles = await VehiclesModel.find({ availabilityStatus: true });
    res.render("./pages/Vehicles/vehicles", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      areas: areas,
      vehicles: vehicles,
    });
  };
  const vehicleBooking = async (req, res, next) => {
    const id = req.params.id;
    const areas = await AreasModel.find();
    const vehicle = await VehiclesModel.findById(id);
    res.render("./pages/Vehicles/vehicleBooking", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      areas: areas,
      vehicle: vehicle,
      flashMessage: "",
      oldInput: {
        checkIn: "",
        checkOut: "",
        adults: false,
        children: false,
      },
    });
  };
  
  const searchVehicles = async (req, res, next) => {
    const location = req.params.location;
    const areas = await AreasModel.find();
    const vehicles = await VehiclesModel.find({ ownerArea: location });
    res.render("./pages/Vehicles/vehicles", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      areas: areas,
      vehicles: vehicles,
    });
  };
  
  const findVehicles = async (req, res, next) => {
    const location = req.query.area;
    const adults = req.query.adults;
    const children = req.query.children;
  
    let queryParams = {};
    let people;
    if (location && adults != "false" && children != "false") {
      people = Math.ceil((Number(children) * 1) / 2) + Number(adults);
      queryParams = {
        ownerArea: location,
        seats: { $gte: people },
      };
    } else if (location) {
      queryParams.ownerArea = location;
    } else if (adults != "false") {
      queryParams.seats = adults;
    }
  
    //areas
    const areas = await AreasModel.find();
    //hotels
    const vehicles = await VehiclesModel.find(queryParams);
  
    res.render("./pages/Vehicles/vehicles", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      areas: areas,
      vehicles: vehicles,
    });
  };
  
  const postVehicleBooking = async (req, res, next) => {
    const vehicleId = req.query.vehicleId;
    const checkIn = req.query.checkIn;
    const checkOut = req.query.checkOut;
    const location = req.query.location;
    const adults = req.query.adults;
    const children = req.query.children;
    const routePath = req.query.routePath;
    const redirectUrl = routePath + vehicleId;
  
    if (!req.session.userLoggedIn) {
      req.session.redirectUrl = redirectUrl;
      res.redirect("/user/login");
      return;
    }
  
    const vehicle = await VehiclesModel.findById(vehicleId);
    const areas = await AreasModel.find();
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("./pages/Vehicles/vehicleBooking", {
        loggedIn: req.session.userLoggedIn,
        user: req.session.user,
        vehicleId: vehicleId,
        vehicle: vehicle,
        areas: areas,
        flashMessage: errors.errors[0].msg,
        oldInput: {
          location: location,
          checkIn: checkIn,
          checkOut: checkOut,
          adults: adults,
          children: children,
        },
        // validationErrors: errors.array(),
      });
    }
  
    const formatedCheckin = new Date(checkIn);
    const formatedCheckout = new Date(checkOut);
    let flag = false;
  
    if (vehicle.reservations.length == 0) {
      flag = true;
    } else {
      for (let i = 0; i < vehicle.reservations.length; i++) {
        flag = false;
        if (
          formatedCheckin >= vehicle.reservations[i].checkIn &&
          formatedCheckin <= vehicle.reservations[i].checkOut
        ) {
          console.log("this vehicle is not available");
          break;
        }
        if (
          formatedCheckout >= vehicle.reservations[i].checkIn &&
          formatedCheckout <= vehicle.reservations[i].checkOut
        ) {
          console.log("this vehicle is not available");
          break;
        }
        if (
          formatedCheckin < vehicle.reservations[i].checkIn &&
          formatedCheckout > vehicle.reservations[i].checkOut
        ) {
          console.log("this vehicle is not available");
          break;
        }
        flag = true;
      }
    }
  
    if (!flag) {
      return res.status(422).render("./pages/Vehicles/vehicleBooking", {
        loggedIn: req.session.userLoggedIn,
        user: req.session.user,
        vehicleId: vehicleId,
        vehicle: vehicle,
        areas: areas,
        flashMessage: "Sorry, this vehicle is already booked for given dates.",
        oldInput: {
          location: location,
          checkIn: checkIn,
          checkOut: checkOut,
          adults: adults,
          children: children,
        },
        // validationErrors: errors.array(),
      });
    }
    const bookingData = {
      user: req.session.user,
      bookingMode: "vehicle",
      vehicleId: vehicleId,
      checkIn: checkIn,
      checkOut: checkOut,
      adults: adults,
      children: children,
      date: new Date(),
    };
  
    req.session.bookingData = bookingData;
    res.render("./pages/Payment/checkout", {
      layout: false,
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      charges: 2000,
    });
  };

module.exports = {
    vehicles,
  vehicleBooking,
  postVehicleBooking,
  searchVehicles,
  findVehicles
}