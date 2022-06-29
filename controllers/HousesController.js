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

  const filterHouses = async (req, res)=>{
    const moment = require('moment');
    
    const stay = req.query.stay;
    const houses = await Houses.find();
    const filteredHouses = [];
  
    if(stay == 'shortTerm'){
      const nextMonth = moment().add(1, 'month');
      // checking the reservation in this month from today to next 30 days
      houses.forEach((house , i) => {
        if(houses[i].reservations.length == 0){
          filteredAppartments.push(house);
          return;
        }
        house.reservations.forEach( reserv => {
          if(reserv.checkIn < nextMonth || reserv.checkOut < nextMonth) return;
          filteredHouses.push(house);
        })
      })
    }else{
    
      const nextSixMonth = moment().add(6, 'month');
      // checking the reservation in this month from today to next 6 months
      houses.forEach((appart , i) => {
        if(houses[i].reservations.length == 0){
          filteredHouses.push(appart);
          return;
        }
        appart.reservations.forEach( reserv => {
          if(reserv.checkIn < nextSixMonth || reserv.checkOut < nextSixMonth) return;
          filteredHouses.push(appart);
        })
      })
    }
    const areas = await AreasModel.find();
    res.render("./pages/Houses/houseList", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      areas: areas,
      houses: filteredHouses,
    });
  
  }

  const houseCheck = async (req, res)=>{
    const checkIn = req.body.checkIn.replace(/\./g, "/");
    const checkOut = req.body.checkOut.replace(/\./g, "/");
    const adults = req.body.adults;
    const children = req.body.children;
    const houseId = req.body.houseId;
    
    const entry = new Date(checkIn);
    const exit = new Date(checkOut);

    try {
      const house = await Houses.findById(houseId);
      let isAvailable;
      if(house.reservations.length == 0) isAvailable = true;
      house.reservations.forEach(reservation => {
        if (
          entry >= reservation.checkIn &&
          entry <= reservation.checkOut
        ) {
          isAvailable = false;
          return;
        } else if (
          exit >= reservation.checkIn &&
          exit <= reservation.checkOut
        ) {
          isAvailable = false;
          return;
        } else if (
          entry < reservation.checkIn &&
          exit > reservation.checkOut
        ) {
          isAvailable = false;
          return;
        }
        isAvailable = true;
      });
  
      if(isAvailable){
        req.session.booking = {
          type: 2,
          checkIn: entry,
          checkOut: exit,
          adults: adults,
          children: children,
          houseId: house.id
        }
        res.redirect("/Bookings/userDetails");
      }else{
        res.redirect("/")
      }
  
    } catch (err) {
      console.log(err);
      res.redirect('/')
    }


  }


module.exports = {
    houses,
    houseInfo,
    filterHouses,
    houseCheck
}