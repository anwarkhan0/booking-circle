const bcrypt = require("bcrypt");
const { validationResult, check } = require("express-validator");
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
  const adults = req.query.adults;
  const children = req.query.children;
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
  let formatedCheckin = new Date(checkIn);
  let formatedCheckout = new Date(checkOut);

  appartments.forEach((appartment) => {
    let isSuitable =
      (adults + children / 2) / appartment.occupancy <= 1 ? true : false;
    if (isSuitable) {
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
    }
  });
  res.render("./pages/Appartments/allappartments", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    areas: areas,
    appartments: filteredAppartments
  });
};

const appartmentCheck = async (req, res, next) => {
  const appartmentId = req.query.appartmentId;
  const checkIn = req.query.checkIn.replace(/\./g, "/");
  const checkOut = req.query.checkOut.replace(/\./g, "/");
  const adults = Number(req.query.adults);
  const children = Number(req.query.children);

  const appartment = await AppartmentModel.findById(appartmentId);

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

  const entry = new Date(checkIn);
  const exit = new Date(checkOut);
  let isAvailable;
  let isSuitable = (adults + children/2)/appartment.occupancy <= 1 ? true : false;
  let totalCharges;

  if(isSuitable){
    if (appartment.reservations.length == 0) {
      isAvailable = true;
    } else {
      for (let i = 0; i < appartment.reservations.length; i++) {
        isAvailable = false;
        if (
          entry >= appartment.reservations[i].checkIn &&
          entry <= appartment.reservations[i].checkOut
        ) {
          console.log("this appartment is not available");
          break;
        }
        if (
          exit >= appartment.reservations[i].checkIn &&
          exit <= appartment.reservations[i].checkOut
        ) {
          console.log("this appartment is not available");
          break;
        }
        if (
          entry < appartment.reservations[i].checkIn &&
          exit > appartment.reservations[i].checkOut
        ) {
          console.log("this appartment is not available");
          break;
        }
        const start = moment(entry, "YYYY-MM-DD");
        const end = moment(exit, "YYYY-MM-DD");
        const days = moment.duration(end.diff(start)).asDays();
        totalCharges = appartment.charges * days;
        isAvailable = true;
      }
    }
  }else{
    isAvailable = false;
  }
  

  if(isAvailable){
    req.session.booking = {
      type: 3,
      appartmentId: appartmentId,
      checkIn: entry,
      checkOut: exit,
      adults: adults,
      children: children,
      date: new Date(),
      total: totalCharges
    };
    
    res.redirect("/Bookings/userDetails");
  }else{
    const appartments = await AppartmentModel.find();
    res.render("./pages/Appartments/notAvailable", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      appartments: appartments
    })
  }

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
  appartmentCheck,
  searchAppartments,
  findAppartments,
  filterAppartments
};
