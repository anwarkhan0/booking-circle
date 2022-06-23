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
const { filter } = require("compression");

const appartments = (req, res, next) =>
  res.render("./pages/Appartments/appartments");
const allappartments = async (req, res, next) => {
  //areas
  const areas = await AreasModel.find();
  //fetch appartments
  const appartments = await AppartmentModel.find();
  res.render("./pages/Appartments/allappartments", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    areas: areas,
    appartments: appartments,
  });
};
const apartmentBooking = async (req, res, next) => {
  const appartId = req.params.id;
  const appartment = await AppartmentModel.findById(appartId);

  res.render("./pages/Appartments/apartmentBooking", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    appartment: appartment,
    flashMessage: "",
    oldInput: {
      checkIn: "",
      checkOut: "",
      adults: false,
      children: false,
    },
  });
};

const searchAppartments = async (req, res, next) => {
  const location = req.params.location;
  const appartments = await AppartmentModel.find({ area: location });
  res.render("./pages/Appartments/searchResult", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    appartments: appartments,
  });
};

const filterAppartments = async (req, res)=>{
  const moment = require('moment');
  
  const stay = req.query.stay;
  const appartments = await AppartmentModel.find();
  const filteredAppartments = [];

  if(stay == 'shortTerm'){
    const nextMonth = moment().add(1, 'month');
    // checking the reservation in this month from today to next 30 days
    appartments.forEach((appart , i) => {
      if(appartments[i].reservations.length == 0){
        filteredAppartments.push(appart);
        return;
      }
      appart.reservations.forEach( reserv => {
        if(reserv.checkIn < nextMonth || reserv.checkOut < nextMonth) return;
        filteredAppartments.push(appart);
      })
    })
  }else{
    
    const nextSixMonth = moment().add(6, 'month');
    // checking the reservation in this month from today to next 6 months
    appartments.forEach((appart , i) => {
      if(appartments[i].reservations.length == 0){
        filteredAppartments.push(appart);
        return;
      }
      appart.reservations.forEach( reserv => {
        if(reserv.checkIn < nextSixMonth || reserv.checkOut < nextSixMonth) return;
        filteredAppartments.push(appart);
      })
    })
  }
  const areas = await AreasModel.find();
  res.render("./pages/Appartments/allappartments", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    areas: areas,
    appartments: filteredAppartments,
  });

}

const findAppartments = async (req, res, next) => {
  const checkIn = req.query.checkIn.replace(/\./g, "/");
  const checkOut = req.query.checkOut.replace(/\./g, "/");
  const location = req.query.area;

  const queryParams = {};
  if (location) {
    queryParams.area = location;
  }

  //areas
  const areas = await AreasModel.find();
  //hotels
  const appartments = await AppartmentModel.find(queryParams);

  const filteredAppartments = [];
  if (checkIn != "" && checkOut != "") {
    let formatedCheckin = new Date(checkIn);
    let formatedCheckout = new Date(checkOut);

    appartments.forEach((appartment) => {
      if (appartment.reservations.length == 0) {
        filteredAppartments.push(appartment);
      } else {
        for (let i = 0; i < appartment.reservations.length; i++) {
          flag = false;
          if (
            formatedCheckin >= appartment.reservations[i].checkIn &&
            formatedCheckin <= appartment.reservations[i].checkOut
          ) {
            console.log("this appartment is not available");
            break;
          }
          if (
            formatedCheckout >= appartment.reservations[i].checkIn &&
            formatedCheckout <= appartment.reservations[i].checkOut
          ) {
            console.log("this appartment is not available");
            break;
          }
          if (
            formatedCheckin < appartment.reservations[i].checkIn &&
            formatedCheckout > appartment.reservations[i].checkOut
          ) {
            console.log("this appartment is not available");
            break;
          }
          filteredAppartments.push(appartment);
        }
      }
    });
    res.render("./pages/Appartments/allappartments", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      areas: areas,
      appartments: filteredAppartments,
    });
  } else {
    res.render("./pages/Appartments/allappartments", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      areas: areas,
      appartments: appartments,
    });
  }
};

const postAppartmentBooking = async (req, res, next) => {
  const appartmentId = req.query.appartmentId;
  const checkIn = req.query.checkIn.replace(/\./g, "/");
  const checkOut = req.query.checkOut.replace(/\./g, "/");
  const adults = req.query.adults;
  const children = req.query.children;
  const routePath = req.query.routePath;
  const redirectUrl = routePath + appartmentId;

  if (!req.session.userLoggedIn) {
    req.session.redirectUrl = redirectUrl;
    res.redirect("/user/login");
    return;
  }

  const appartment = await AppartmentModel.findById(appartmentId);
  const formatedCheckin = new Date(checkIn);
  const formatedCheckout = new Date(checkOut);
  let flag;

  if (appartment.reservations.length == 0) {
    flag = true;
  } else {
    for (let i = 0; i < appartment.reservations.length; i++) {
      flag = false;
      if (
        formatedCheckin >= appartment.reservations[i].checkIn &&
        formatedCheckin <= appartment.reservations[i].checkOut
      ) {
        console.log("this appartment is not available");
        break;
      }
      if (
        formatedCheckout >= appartment.reservations[i].checkIn &&
        formatedCheckout <= appartment.reservations[i].checkOut
      ) {
        console.log("this appartment is not available");
        break;
      }
      if (
        formatedCheckin < appartment.reservations[i].checkIn &&
        formatedCheckout > appartment.reservations[i].checkOut
      ) {
        console.log("this appartment is not available");
        break;
      }
      flag = true;
    }
  }

  if (!flag) {
    return res.status(422).render("./pages/Appartments/apartmentBooking", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      appartmentId: appartment.id,
      appartment: appartment,
      flashMessage:
        "Sorry, this appartment/house is already reserved for given dates.",
      oldInput: {
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
    bookingMode: "appartment",
    appartmentId: appartmentId,
    checkIn: checkIn,
    checkOut: checkOut,
    adults: adults,
    children: children,
    date: new Date(),
  };
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("./pages/Appartments/apartmentBooking", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      appartmentId: appartmentId,
      appartment: appartment,
      flashMessage: errors.errors[0].msg,
      oldInput: {
        checkIn: checkIn,
        checkOut: checkOut,
        adults: adults,
        children: children,
      },
      // validationErrors: errors.array(),
    });
  }
  req.session.bookingData = bookingData;
  res.render("./pages/Payment/checkout", {
    layout: false,
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    charges: appartment.price,
  });
};

const appartmentGallery = (req, res, next) =>
  res.render("./pages/Appartments/appartmentGallery", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
  });

module.exports = {
  appartments,
  allappartments,
  apartmentBooking,
  appartmentGallery,
  postAppartmentBooking,
  searchAppartments,
  findAppartments,
  filterAppartments
};
