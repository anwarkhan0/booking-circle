const bcrypt = require("bcrypt");
const { validationResult, check } = require("express-validator");
const Safepay = require("safepay");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const moment = require('moment');

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

const tours = async (req, res, next) => {
    const areas = await AreasModel.find();
    const tours = await ToursModel.find({ tourType: "tour" });
    const hikes = await ToursModel.find({ tourType: "hike" });
    res.render("./pages/Tours/tours", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      areas: areas,
      tours: tours,
      hikes: hikes,
      moment: moment,
    });
  };
  
  const searchTour = async (req, res, next) => {
    const location = req.params.location;
    const areas = await AreasModel.find();
    const tours = await ToursModel.find({ toPlace: location, tourType: "tour" });
    const hikes = await ToursModel.find({ toPlace: location, tourType: "hike" });
    res.render("./pages/Tours/tours", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      areas: areas,
      tours: tours,
      hikes: hikes,
    });
  };
  
  const hike = (req, res, next) => res.render("./pages/Tours/hike");
  const booking = async (req, res, next) => {
    const id = req.params.id;
    const tour = await ToursModel.findById(id);
    res.render("./pages/Tours/booking", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      flashMessage: "",
      tour: tour,
    });
  };
  
  const postTourEnrolling = async (req, res, next) => {
    const tourId = req.query.tourId;
    const seats = Number(req.query.seats);
    const routePath = req.query.routePath;
    const redirectUrl = routePath + tourId;
  
    if (!req.session.userLoggedIn) {
      req.session.redirectUrl = redirectUrl;
      res.redirect("/user/login");
      return;
    }
    const tour = await ToursModel.findById(tourId);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("./pages/Tours/booking", {
        loggedIn: req.session.userLoggedIn,
        user: req.session.user,
        tourId: tourId,
        tour: tour,
        flashMessage: errors.errors[0].msg,
        oldInput: {
          seats: seats,
        },
        // validationErrors: errors.array(),
      });
    }
    const bookingData = {
      user: req.session.user,
      bookingMode: "tour",
      tourId: tourId,
      seats: seats,
      charges: Number(seats) * tour.chargesPerHead,
      date: new Date(),
    };
    req.session.bookingData = bookingData;
    res.render("./pages/Payment/checkout", {
      layout: false,
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      charges: Number(seats) * tour.chargesPerHead,
    });
  };
  
  const gallerytandh = (req, res, next) =>
    res.render("./pages/Tours/gallerytandh", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
    });
  

    module.exports = {
        tours,
  hike,
  booking,
  gallerytandh,
  postTourEnrolling,
  searchTour
    }