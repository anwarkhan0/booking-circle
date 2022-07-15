const bcrypt = require("bcrypt");
const moment = require("moment");

const AreasModel = require("../models/Location");
const Houses = require("../models/House");

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

  const findHouses = async (req, res)=>{
    const checkIn = req.query.checkIn.replace(/\./g, "/");
    const checkOut = req.query.checkOut.replace(/\./g, "/");
    const location = req.query.location;
    const bedRooms = req.query.bedRooms;

    const entry = new Date(checkIn);
    const exit = new Date(checkOut);

    try {
      const houses = await Houses.find({location: location});
      const filteredHouses = [];
      houses.forEach(house => {
        if(house.bedRooms < bedRooms) return;
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
          house.booking = {
            type: 2,
            checkIn: entry,
            checkOut: exit,
            houseId: house.id
          }
          filteredHouses.push(house);
        }
      })
      const areas = await AreasModel.find();
      res.render("./pages/Houses/houseList", {
        loggedIn: req.session.userLoggedIn,
        user: req.session.user,
        areas: areas,
        houses: filteredHouses,
      });
    } catch (err) {
      console.log(err)
    }

  }

  const houseCheck = async (req, res)=>{
    const checkIn = req.body.checkIn.replace(/\./g, "/");
    const checkOut = req.body.checkOut.replace(/\./g, "/");
    const adults = Number(req.body.adults);
    const children = Number(req.body.children);
    const houseId = req.body.houseId;
    
    const entry = new Date(checkIn);
    const exit = new Date(checkOut);
    let totalCharges;

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
        const start = moment(entry, "YYYY-MM-DD");
        const end = moment(exit, "YYYY-MM-DD");
        const days = moment.duration(end.diff(start)).asDays();
        totalCharges = house.charges * days;
        req.session.booking = {
          type: 2,
          checkIn: entry,
          checkOut: exit,
          adults: adults,
          children: children,
          total: totalCharges,
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
    houseCheck,
    findHouses
}