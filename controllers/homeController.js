const bcrypt = require("bcrypt");
const { validationResult, check } = require("express-validator");
const Safepay = require("safepay");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const HomeModel = require("../models/homeModel");
const AreasModel = require("../models/Location");
const AppartmentModel = require("../models/Appartment");
const HotelsModel = require("../models/Hotel");
const VehiclesModel = require("../models/Vehicles");
const ToursModel = require("../models/Tour");
const NewsModel = require("../models/Updates");
const UsersModel = require("../models/usersModel");
const MessageModel = require("../models/Message");
const sliderGallery = require("../models/SliderGallery");
const subscribeModel = require("../models/subscribeModel");
const queryModel = require("../models/Query");
const { json, query } = require("express");
const Hotel = require("../models/Hotel");
const checkout = require("safepay/dist/resources/checkout");

// HomePage
const home = async (req, res, next) => {
  const areas = await HomeModel.fetchAreas();
  const sliderGall = await sliderGallery.find();

  const hotels = await HotelsModel.find({ approvedStatus: true });
  const appartments = await AppartmentModel.find();
  const tours = await ToursModel.find();
  const vehicles = await VehiclesModel.find();

  //generate random number
  function getRandom(count) {
    let random = Math.floor(Math.random() * count);

    if (random == count) {
      random = 0;
    }

    return random;
  }

  //return random data
  function getRandomData(random, data) {
    let randomData = [];
    for (let i = random; i < data.length; i++) {
      if (typeof data[i] === undefined) {
        break;
      }
      if(randomData.length == 6){
        break;
      }
      randomData.push(data[i]);
    }
    return randomData;
  }

  // save random num for every category
  const hotelsRandom = getRandom(hotels.length);
  const appartmentsRandom = getRandom(appartments.length);
  const toursRandom = getRandom(tours.length);
  const vehiclesRandom = getRandom(vehicles.length);

  // save random data for homepage
  const ourHotelsIn = getRandomData(hotelsRandom, hotels);
  const ourtAppartmentsIn = getRandomData(appartmentsRandom, appartments);
  const ourToursIn = getRandomData(toursRandom, tours);
  const ourVehiclesIn = getRandomData(vehiclesRandom, vehicles);

  res.render("./pages/HomePage/home", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    sliderGallery: sliderGall,
    areas: areas,
    hotels: ourHotelsIn,
    appartments: ourtAppartmentsIn,
    tours: ourToursIn,
    vehicles: ourVehiclesIn,
  });
};

//Appartments
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

// hotels
const hotels = async (req, res, next) => {
  //areas
  const areas = await AreasModel.find();
  //hotels
  const hotels = await HotelsModel.find({ approvedStatus: true });
  res.render("./pages/Hotels/hotels", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    hotels: hotels,
    areas: areas,
  });
};

// search for hotels with just location
const searchHotels = async (req, res, next) => {
  const location = req.params.location;
  const hotels = await HotelsModel.find({ area: location });
  const areas = await AreasModel.find();
  res.render("./pages/Hotels/hotels", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    location: location,
    areas: areas,
    hotels: hotels,
  });
};

//search for rooms in all hotels
const findHotels = async (req, res, next) => {
  let checkIn = req.query.checkIn.replace(/\./g, "/");
  let checkOut = req.query.checkOut.replace(/\./g, "/");
  const location = req.query.area;
  const adults = req.query.adults;

  const queryParams = {};
  if (location) {
    queryParams.area = location;
  }

  //areas
  // const areas = await AreasModel.find();
  //hotels
  const hotels = await HotelsModel.find(queryParams);
  const filteredRooms = [];
  let people;

  switch (true) {
    // search based on checkin checkout and adults////////////////////////////
    case checkIn != "" && checkOut != "" && adults != "false":
      people = Number(adults);
      hotels.forEach((hotel) => {
        hotel.rooms.forEach((room) => {
          const newRoom = {
            hotelName: hotel.name,
            hotelId: hotel.id,
            details: room,
          };
          let formatedCheckin = new Date(checkIn);
          let formatedCheckout = new Date(checkOut);
          if (room.occupency >= people) {
            if (room.reservations.length == 0) {
              filteredRooms.push(newRoom);
              return;
            } else {
              for (let i = 0; i < room.reservations.length; i++) {
                if (
                  formatedCheckin >= room.reservations[i].checkIn &&
                  formatedCheckin <= room.reservations[i].checkOut
                ) {
                  console.log("this room is not available");
                  return;
                }
                if (
                  formatedCheckout >= room.reservations[i].checkIn &&
                  formatedCheckout <= room.reservations[i].checkOut
                ) {
                  console.log("this room is not available");
                  return;
                }
                if (
                  formatedCheckin < room.reservations[i].checkIn &&
                  formatedCheckout > room.reservations[i].checkOut
                ) {
                  console.log("this room is not available");
                  return;
                }
              }
              filteredRooms.push(newRoom);
            }
          }
        });
      });

      res.render("./pages/Hotels/filteredRooms", {
        loggedIn: req.session.userLoggedIn,
        user: req.session.user,
        rooms: filteredRooms,
      });
      return;
    // search based on checkin and checkout
    case checkIn != "" && checkOut != "":
      hotels.forEach((hotel) => {
        hotel.rooms.forEach((room) => {
          const newRoom = {
            hotelName: hotel.name,
            hotelId: hotel.id,
            details: room,
          };
          let formatedCheckin = new Date(checkIn);
          let formatedCheckout = new Date(checkOut);

          if (room.reservations.length == 0) {
            filteredRooms.push(newRoom);
            return;
          } else {
            for (let i = 0; i < room.reservations.length; i++) {
              if (
                formatedCheckin >= room.reservations[i].checkIn &&
                formatedCheckin <= room.reservations[i].checkOut
              ) {
                console.log("this room is not available");
                return;
              }
              if (
                formatedCheckout >= room.reservations[i].checkIn &&
                formatedCheckout <= room.reservations[i].checkOut
              ) {
                console.log("this room is not available");
                return;
              }
              if (
                formatedCheckin < room.reservations[i].checkIn &&
                formatedCheckout > room.reservations[i].checkOut
              ) {
                console.log("this room is not available");
                return;
              }
            }
            filteredRooms.push(newRoom);
          }
        });
      });

      res.render("./pages/Hotels/filteredRooms", {
        loggedIn: req.session.userLoggedIn,
        user: req.session.user,
        rooms: filteredRooms,
      });
      return;
    // search based on people/////////////////////
    case adults != "false":
      people = Number(adults);
      hotels.forEach((hotel) => {
        hotel.rooms.forEach((room) => {
          if (room.occupency >= people) {
            const newRoom = {
              hotelName: hotel.name,
              hotelId: hotel.id,
              details: room,
            };
            filteredRooms.push(newRoom);
            return;
          }
        });
      });

      res.render("./pages/Hotels/filteredRooms", {
        loggedIn: req.session.userLoggedIn,
        user: req.session.user,
        rooms: filteredRooms,
      });
      return;
    // default case return hotels with location if selected
    default:
      hotels.forEach((hotel) => {
        hotel.rooms.forEach((room) => {
          const newRoom = {
            hotelName: hotel.name,
            hotelId: hotel.id,
            details: room,
          };
          filteredRooms.push(newRoom);
          return;
        });
      });
      res.render("./pages/Hotels/filteredRooms", {
        loggedIn: req.session.userLoggedIn,
        user: req.session.user,
        rooms: filteredRooms,
      });
      return;
  }
};

const hotelGallery = async (req, res, next) => {
  const hotelId = req.params.id;
  const hotel = await HotelsModel.findById(hotelId);
  res.render("./pages/Hotels/hotelGallery", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    hotel: hotel,
  });
};
const hotelRooms = async (req, res, next) => {
  const hotelId = req.params.id;
  const hotel = await HotelsModel.findById(hotelId);
  const rooms = hotel.rooms;

  res.render("./pages/Hotels/hotelRooms", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    oldInput: {
      hotelId: "",
      checkIn: "",
      checkOut: "",
      adults: "",
      priceRange: 25000,
      hotWater: false,
      heater: false,
      kingBeds: false,
      balcony: false,
      parking: false,
      roomService: false,
    },
    hotelId: hotelId,
    hotelName: hotel.name,
    rooms: rooms,
  });
};

const roomFilter = async (req, res, next) => {
  const hotelId = req.query.hotelId;
  const checkIn = req.query.checkIn;
  const checkOut = req.query.checkOut;
  const adults = req.query.adults;
  const children = req.query.children;
  const priceRange = Number(req.query.priceRange);
  const hotWater = req.query.hotWater;
  const heater = req.query.heater;
  const kingBeds = req.query.kingBeds;
  const balcony = req.query.balcony;
  const parking = req.query.parking;
  const roomService = req.query.roomService;

  const hotel = await HotelsModel.findById(hotelId);
  const filteredRooms = [];
  let people;

  switch (true) {
    // in case of all conditions
    case checkIn != "" &&
      checkOut != "" &&
      adults != "false" &&
      children != "false":
      people = Math.ceil((Number(children) * 1) / 2) + Number(adults);
      hotel.rooms.forEach((room) => {
        let reservationFlag = false;
        let conditionsFlag = false;
        let formatedCheckIn = new Date(checkIn.replace(/\./g, "/"));
        let formatedCheckOut = new Date(checkOut.replace(/\./g, "/"));
        // check the date against the reservation checkout dates
        room.reservations.forEach((reservation, i) => {
          if (
            formatedCheckIn < reservation.checkIn ||
            (formatedCheckIn > reservation.checkOut &&
              formatedCheckOut < reservation.checkIn) ||
            formatedCheckOut > reservation.checkOut
          ) {
            if (typeof room.reservations[i + 1] === "undefined") {
              reservationFlag = true;
            } else if (formatedCheckOut < room.reservations[i + 1]) {
              reservationFlag = true;
            }
          }
        });
        // check for other options
        if (hotWater == "true" && balcony == "true" && kingBeds == "true") {
          room.occupency == people &&
          room.hotWater &&
          room.bedSize == "king" &&
          room.balcony
            ? (conditionsFlag = true)
            : "";
        } else if (hotWater == "true" && balcony == "true") {
          room.occupency == people && room.hotWater && room.balcony
            ? (conditionsFlag = true)
            : "";
        } else if (hotWater == "true" && kingBeds == "true") {
          room.occupency == people && room.hotWater && room.bedSize == "king"
            ? (conditionsFlag = true)
            : "";
        } else if (balcony == "true" && kingBeds == "true") {
          room.occupency == people && room.balcony && room.bedSize == "king"
            ? (conditionsFlag = true)
            : "";
        } else if (hotWater == "true") {
          room.occupency == people && room.hotWater
            ? (conditionsFlag = true)
            : "";
        } else if (balcony == "true") {
          room.occupency == people && room.balcony
            ? (conditionsFlag = true)
            : "";
        } else if (kingBeds == "true") {
          room.occupency == people && room.bedSize == "king"
            ? (conditionsFlag = true)
            : "";
        } else if (priceRange < 25000) {
          room.occupency == people && room.charges <= priceRange
            ? (conditionsFlag = true)
            : "";
        } else {
          room.beds == people ? (conditionsFlag = true) : "";
        }

        if (room.reservations.length == 0 && conditionsFlag) {
          filteredRooms.push(room);
        } else if (reservationFlag && conditionsFlag) {
          filteredRooms.push(room);
        }
      });
      break;

    case checkIn != "" && adults != "false" && children != "false":
      people = Math.ceil((Number(children) * 1) / 2) + Number(adults);
      hotel.rooms.forEach((room) => {
        let reservationFlag = false;
        let conditionsFlag = false;
        let formatedCheckIn = new Date(checkIn.replace(/\./g, "/"));
        // check the date against the reservation checkout dates
        room.reservations.forEach((reservation) => {
          if (
            formatedCheckIn < reservation.checkIn ||
            formatedCheckIn > reservation.checkOut
          ) {
            reservationFlag = true;
          }
        });
        // check for other options
        if (hotWater == "true" && balcony == "true" && kingBeds == "true") {
          room.occupency == people &&
          room.hotWater &&
          room.bedSize == "king" &&
          room.balcony
            ? (conditionsFlag = true)
            : "";
        } else if (hotWater == "true" && balcony == "true") {
          room.occupency == people && room.hotWater && room.balcony
            ? (conditionsFlag = true)
            : "";
        } else if (hotWater == "true" && kingBeds == "true") {
          room.occupency == people && room.hotWater && room.bedSize == "king"
            ? (conditionsFlag = true)
            : "";
        } else if (balcony == "true" && kingBeds == "true") {
          room.occupency == people && room.balcony && room.bedSize == "king"
            ? (conditionsFlag = true)
            : "";
        } else if (hotWater == "true") {
          room.occupency == people && room.hotWater
            ? (conditionsFlag = true)
            : "";
        } else if (balcony == "true") {
          room.occupency == people && room.balcony
            ? (conditionsFlag = true)
            : "";
        } else if (kingBeds == "true") {
          room.occupency == people && room.bedSize == "king"
            ? (conditionsFlag = true)
            : "";
        } else if (priceRange < 25000) {
          room.occupency == people && room.charges <= priceRange
            ? (conditionsFlag = true)
            : "";
        } else {
          room.occupency == people ? (conditionsFlag = true) : "";
        }

        if (room.reservations.length == 0 && conditionsFlag) {
          filteredRooms.push(room);
        } else if (reservationFlag && conditionsFlag) {
          filteredRooms.push(room);
        }
      });
      break;

    case checkIn != "" && adults != "false":
      people = Number(adults);
      hotel.rooms.forEach((room) => {
        let reservationFlag = false;
        let conditionsFlag = false;
        let formatedCheckIn = new Date(checkIn.replace(/\./g, "/"));
        // check the date against the reservation checkout dates
        room.reservations.forEach((reservation) => {
          if (
            formatedCheckIn < reservation.checkIn ||
            formatedCheckIn > reservation.checkOut
          ) {
            reservationFlag = true;
          }
        });
        // check for other options
        if (hotWater == "true" && balcony == "true" && kingBeds == "true") {
          room.occupency == people &&
          room.hotWater &&
          room.bedSize == "king" &&
          room.balcony
            ? (conditionsFlag = true)
            : "";
        } else if (hotWater == "true" && balcony == "true") {
          room.occupency == people && room.hotWater && room.balcony
            ? (conditionsFlag = true)
            : "";
        } else if (hotWater == "true" && kingBeds == "true") {
          room.occupency == people && room.hotWater && room.bedSize == "king"
            ? (conditionsFlag = true)
            : "";
        } else if (balcony == "true" && kingBeds == "true") {
          room.occupency == people && room.balcony && room.bedSize == "king"
            ? (conditionsFlag = true)
            : "";
        } else if (hotWater == "true") {
          room.occupency == people && room.hotWater
            ? (conditionsFlag = true)
            : "";
        } else if (balcony == "true") {
          room.occupency == people && room.balcony
            ? (conditionsFlag = true)
            : "";
        } else if (kingBeds == "true") {
          room.occupency == people && room.bedSize == "king"
            ? (conditionsFlag = true)
            : "";
        } else if (priceRange < 25000) {
          room.occupency == people && room.charges <= priceRange
            ? (conditionsFlag = true)
            : "";
        } else {
          room.occupency == people ? (conditionsFlag = true) : "";
        }

        if (room.reservations.length == 0 && conditionsFlag) {
          filteredRooms.push(room);
        } else if (reservationFlag && conditionsFlag) {
          filteredRooms.push(room);
        }
      });
      break;

    case checkIn != "" && children != "false":
      people = Number(children) / 2;
      hotel.rooms.forEach((room) => {
        let reservationFlag = false;
        let conditionsFlag = false;
        let formatedCheckIn = new Date(checkIn.replace(/\./g, "/"));
        // check the date against the reservation checkout dates
        room.reservations.forEach((reservation) => {
          if (
            formatedCheckIn < reservation.checkIn ||
            formatedCheckIn > reservation.checkOut
          ) {
            reservationFlag = true;
          }
        });
        // check for other options
        if (hotWater == "true" && balcony == "true" && kingBeds == "true") {
          room.occupency == people &&
          room.hotWater &&
          room.bedSize == "king" &&
          room.balcony
            ? (conditionsFlag = true)
            : "";
        } else if (hotWater == "true" && balcony == "true") {
          room.occupency == people && room.hotWater && room.balcony
            ? (conditionsFlag = true)
            : "";
        } else if (hotWater == "true" && kingBeds == "true") {
          room.occupency == people && room.hotWater && room.bedSize == "king"
            ? (conditionsFlag = true)
            : "";
        } else if (balcony == "true" && kingBeds == "true") {
          room.occupency == people && room.balcony && room.bedSize == "king"
            ? (conditionsFlag = true)
            : "";
        } else if (hotWater == "true") {
          room.occupency == people && room.hotWater
            ? (conditionsFlag = true)
            : "";
        } else if (balcony == "true") {
          room.occupency == people && room.balcony
            ? (conditionsFlag = true)
            : "";
        } else if (kingBeds == "true") {
          room.occupency == people && room.bedSize == "king"
            ? (conditionsFlag = true)
            : "";
        } else if (priceRange < 25000) {
          room.occupency == people && room.charges <= priceRange
            ? (conditionsFlag = true)
            : "";
        } else {
          room.occupency == people ? (conditionsFlag = true) : "";
        }

        if (room.reservations.length == 0 && conditionsFlag) {
          filteredRooms.push(room);
        } else if (reservationFlag && conditionsFlag) {
          filteredRooms.push(room);
        }
      });
      break;

    // in case of adults and children
    case adults != "false" && children != "false":
      people = Math.ceil((Number(children) * 1) / 2) + Number(adults);
      hotel.rooms.forEach((room) => {
        if (hotWater == "true" && balcony == "true" && kingBeds == "true") {
          room.occupency == people &&
          room.hotWater &&
          room.bedSize == "king" &&
          room.balcony
            ? filteredRooms.push(room)
            : "";
        } else if (hotWater == "true" && balcony == "true") {
          room.occupency == people && room.hotWater && room.balcony
            ? filteredRooms.push(room)
            : "";
        } else if (hotWater == "true" && kingBeds == "true") {
          room.occupency == people && room.hotWater && room.bedSize == "king"
            ? filteredRooms.push(room)
            : "";
        } else if (balcony == "true" && kingBeds == "true") {
          room.occupency == people && room.balcony && room.bedSize == "king"
            ? filteredRooms.push(room)
            : "";
        } else if (hotWater == "true") {
          room.occupency == people && room.hotWater
            ? filteredRooms.push(room)
            : "";
        } else if (balcony == "true") {
          room.occupency == people && room.balcony
            ? filteredRooms.push(room)
            : "";
        } else if (kingBeds == "true") {
          room.occupency == people && room.bedSize == "king"
            ? filteredRooms.push(room)
            : "";
        } else if (priceRange < 25000) {
          room.occupency == people && room.charges <= priceRange
            ? filteredRooms.push(room)
            : "";
        } else {
          room.occupency == people ? filteredRooms.push(room) : "";
        }
      });
      break;

    // in case of checkin date
    case checkIn != "":
      hotel.rooms.forEach((room) => {
        //if there are no reservation the room is available
        if (room.reservations.length == 0) {
          filteredRooms.push(room);
          return;
        }
        let flag = false;
        let formatedCheckIn = new Date(checkIn.replace(/\./g, "/"));
        // check the date against the reservation checkout dates
        room.reservations.forEach((reservation) => {
          if (
            formatedCheckIn < reservation.checkIn ||
            formatedCheckIn > reservation.checkOut
          ) {
            flag = true;
          }
        });
        // check for other options
        if (hotWater == "true" && balcony == "true" && kingBeds == "true") {
          flag && room.hotWater && room.bedSize == "king" && room.balcony
            ? filteredRooms.push(room)
            : "";
        } else if (hotWater == "true" && balcony == "true") {
          flag && room.hotWater && room.balcony ? filteredRooms.push(room) : "";
        } else if (hotWater == "true" && kingBeds == "true") {
          flag && room.hotWater && room.bedSize == "king"
            ? filteredRooms.push(room)
            : "";
        } else if (balcony == "true" && kingBeds == "true") {
          flag && room.balcony && room.bedSize == "king"
            ? filteredRooms.push(room)
            : "";
        } else if (hotWater == "true") {
          flag && room.hotWater ? filteredRooms.push(room) : "";
        } else if (balcony == "true") {
          flag && room.balcony ? filteredRooms.push(room) : "";
        } else if (kingBeds == "true") {
          flag && room.bedSize == "king" ? filteredRooms.push(room) : "";
        } else if (priceRange < 25000) {
          flag && room.charges <= priceRange ? filteredRooms.push(room) : "";
        } else {
          flag ? filteredRooms.push(room) : "";
        }
      });
      break;

    // in case of just adult option
    case adults != "false":
      people = Number(adults);
      hotel.rooms.forEach((room) => {
        if (hotWater == "true" && balcony == "true" && kingBeds == "true") {
          room.occupency == people &&
          room.hotWater &&
          room.bedSize == "king" &&
          room.balcony
            ? filteredRooms.push(room)
            : "";
        } else if (hotWater == "true" && balcony == "true") {
          room.occupency == people && room.hotWater && room.balcony
            ? filteredRooms.push(room)
            : "";
        } else if (hotWater == "true" && kingBeds == "true") {
          room.occupency == people && room.hotWater && room.bedSize == "king"
            ? filteredRooms.push(room)
            : "";
        } else if (balcony == "true" && kingBeds == "true") {
          room.occupency == people && room.balcony && room.bedSize == "king"
            ? filteredRooms.push(room)
            : "";
        } else if (hotWater == "true") {
          room.occupency == people && room.hotWater
            ? filteredRooms.push(room)
            : "";
        } else if (balcony == "true") {
          room.occupency == people && room.balcony
            ? filteredRooms.push(room)
            : "";
        } else if (kingBeds == "true") {
          room.occupency == people && room.bedSize == "king"
            ? filteredRooms.push(room)
            : "";
        } else if (priceRange < 25000) {
          room.occupency == people && room.charges <= priceRange
            ? filteredRooms.push(room)
            : "";
        } else {
          room.occupency == people ? filteredRooms.push(room) : "";
        }
      });
      break;

    // if no dates and adults are provided just check for the other options
    default:
      hotel.rooms.forEach((room) => {
        if (hotWater == "true" && balcony == "true" && kingBeds == "true") {
          room.hotWater && room.bedSize == "king" && room.balcony
            ? filteredRooms.push(room)
            : "";
        } else if (hotWater == "true" && balcony == "true") {
          room.hotWater && room.balcony ? filteredRooms.push(room) : "";
        } else if (hotWater == "true" && kingBeds == "true") {
          room.hotWater && room.bedSize == "king"
            ? filteredRooms.push(room)
            : "";
        } else if (balcony == "true" && kingBeds == "true") {
          room.balcony && room.bedSize == "king"
            ? filteredRooms.push(room)
            : "";
        } else if (hotWater == "true") {
          room.hotWater ? filteredRooms.push(room) : "";
        } else if (balcony == "true") {
          room.balcony ? filteredRooms.push(room) : "";
        } else if (kingBeds == "true") {
          room.bedSize == "king" ? filteredRooms.push(room) : "";
        } else if (priceRange < 25000) {
          room.charges <= priceRange ? filteredRooms.push(room) : "";
        }
      });
  }

  res.render("./pages/Hotels/hotelRooms", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    oldInput: {
      hotelId: hotelId,
      checkIn: checkIn,
      checkOut: checkOut,
      adults: adults,
      children: children,
      priceRange: priceRange,
      hotWater: hotWater,
      heater: heater,
      kingBeds: kingBeds,
      balcony: balcony,
      parking: parking,
      roomService: roomService,
    },
    hotelId: hotel.id,
    hotelName: hotel.name,
    rooms: filteredRooms,
  });
};

// vehicles
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

const galleryAppRoom = async (req, res, next) => {
  const hotels = await HotelsModel.find();
  const appartments = await AppartmentModel.find();
  const vehicles = await VehiclesModel.find();
  const hotelGallery = [];
  const appartmentsGallery = [];
  const vehiclesGallery = [];
  hotels.forEach((hotel) => {
    hotel.gallery.forEach( image => {
      hotelGallery.push(image);
    })
  });
  appartments.forEach((appartment) => {
    appartment.gallery.forEach((image) => {
      appartmentsGallery.push(image);
    });
  });
  vehicles.forEach((vehicle) => {
    vehicle.gallery.forEach((image) => {
      vehiclesGallery.push(image);
    });
  });
  res.render("./Gallery/galleries", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    hGallery: hotelGallery,
    aGallery: appartmentsGallery,
    vGallery: vehiclesGallery,
  });
};

const roomBooking = async (req, res, next) => {
  const hotelId = req.params.hotelId;
  const roomId = req.query.roomId;

  const hotel = await HotelsModel.findById(hotelId);
  let selectedRoom;
  hotel.rooms.forEach((room) =>
    room.id == roomId ? (selectedRoom = room) : ""
  );
  res.render("./pages/Hotels/roomBooking", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    hotelId: hotel.id,
    room: selectedRoom,
    oldInput: {
      checkIn: "",
      checkOut: "",
      adults: false,
      children: false,
    },
    flashMessage: "",
  });
};

const postRoomBooking = async (req, res, next) => {
  const hotelId = req.query.hotelId;
  const roomId = req.query.roomId;
  const checkIn = req.query.checkIn.replace(/\./g, "/");
  const checkOut = req.query.checkOut.replace(/\./g, "/");
  const adults = req.query.adults;
  const children = req.query.children;
  const routePath = req.query.routePath;
  const charges = req.query.charges;
  const redirectUrl = routePath + hotelId + "?roomId=" + roomId;

  if (!req.session.userLoggedIn) {
    req.session.redirectUrl = redirectUrl;
    res.redirect("/user/login");
    return;
  }

  const hotel = await HotelsModel.findById(hotelId);
  const room = hotel.rooms.find((room) => room.id == roomId);
  const formatedCheckin = new Date(checkIn);
  const formatedCheckout = new Date(checkOut);
  let flag;
  if (room.reservations.length == 0) {
    flag = true;
  } else {
    for (let i = 0; i < room.reservations.length; i++) {
      flag = false;
      if (
        formatedCheckin >= room.reservations[i].checkIn &&
        formatedCheckin <= room.reservations[i].checkOut
      ) {
        console.log("this room is not available");
        break;
      }
      if (
        formatedCheckout >= room.reservations[i].checkIn &&
        formatedCheckout <= room.reservations[i].checkOut
      ) {
        console.log("this room is not available");
        break;
      }
      if (
        formatedCheckin < room.reservations[i].checkIn &&
        formatedCheckout > room.reservations[i].checkOut
      ) {
        console.log("this room is not available");
        break;
      }
      flag = true;
    }
  }

  if (!flag) {
    return res.status(422).render("./pages/Hotels/roomBooking", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      hotelId: hotel.id,
      room: room,
      flashMessage:
        "Sorry, this room is already reserved for given dates or room is insufficient for you.",
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
    bookingMode: "room",
    hotelId: hotelId,
    roomId: roomId,
    checkIn: checkIn,
    checkOut: checkOut,
    adults: adults,
    children: children,
    date: new Date(),
  };
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("./pages/Hotels/roomBooking", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      hotelId: hotel.id,
      room: room,
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
    charges: charges,
  });
};

// Tours
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
  const bookingData = {
    user: req.session.user,
    bookingMode: "tour",
    tourId: tourId,
    seats: seats,
    date: new Date(),
  };
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
  req.session.bookingData = bookingData;
  res.render("./pages/Payment/checkout", {
    layout: false,
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    charges: 2000,
  });
};

const gallerytandh = (req, res, next) =>
  res.render("./pages/Tours/gallerytandh", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
  });

// News
const news = (req, res, next) => {
  const page = Number(req.query.page);
  const ITEMS_PER_PAGE = 6;
  let totalItems;

  NewsModel.find()
    .count()
    .then((newsLength) => {
      totalItems = newsLength;
      return NewsModel.find()
        .sort({ date: -1 })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((news) => {
      res.render("./pages/News/news", {
        loggedIn: req.session.userLoggedIn,
        user: req.session.user,
        news: news,
        totalProducts: totalItems,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const exploreNews = async (req, res, next) => {
  const id = req.params.id;
  try {
    const post = await NewsModel.findById(id);
    res.render("./pages/News/exploreNews", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      post: post,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

// About Us
const about = (req, res, next) =>
  res.render("./pages/About/about", { loggedIn: req.session.userLoggedIn, user: req.session.user, });

// Contact
const contact = (req, res, next) => {
  res.render("./pages/Contact/contact", { loggedIn: req.session.userLoggedIn, user: req.session.user, });
};

const postMessage = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  try {
    const feedback = new MessageModel({
      name: name,
      email: email,
      message: message,
    });
    await feedback.save();
    console.log("message added");
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

// User
const login = (req, res, next) => {
  const message = req.flash("message");
  const registrationMsg = req.flash("successReg");
  res.render("./pages/User/login", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    flashMessage: message,
    successReg: registrationMsg,
    oldInput: {
      email: "",
      password: "",
    },
  });
};

const logout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

const signup = (req, res, next) => {
  res.render("./pages/User/signup", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    flashMessage: req.flash('message'),
    oldInput: {
      name: "",
      phoneNo: "",
      email: "",
      password: "",
      cnfmPassword: ""
    },
  });
};
const verification = (req, res, next) =>
  res.render("./pages/User/verification", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
  });
const forgotPassword = (req, res, next) =>
  res.render("./pages/User/forgotPassword", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    flashMessage: "",
    email: "",
  });

const sendMail = async (req, res, next) => {
  const userEmail = req.body.email;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render("./pages/User/forgotPassword", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      flashMessage: errors.errors[0].msg,
      email: userEmail,
    });
  } else {
    const nodemailer = require("nodemailer");

    const user = await UsersModel.findOne({ email: userEmail });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jacksparrow0340@gmail.com",
        pass: "cin>>mygoogleid1234",
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: "Reset Password",
      html: `<p>You requested password please click the link below to reset your password.</p> <hr> <a href='http://localhost:3000/User/passwordReset/?u=${user.id}'>reset password</a>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.redirect("/User/forgotPassword");
      } else {
        console.log("Email sent: " + info.response);
        res.redirect("/user/mailSent");
      }
    });
  }

  // const mailjet = require("node-mailjet").connect(
  //   "61e0d98a1a3d43d7aa28d3be0ab1d613",
  //   "d6d4bc2548bcb79cc5ea4c003ee8665b"
  // );
  // const request = mailjet.post("send", { version: "v3.1" }).request({
  //   Messages: [
  //     {
  //       From: {
  //         Email: "jacksparr0340@gmail.com",
  //         Name: "anwar",
  //       },
  //       To: [
  //         {
  //           Email: userEmail,
  //           Name: "anwar",
  //         },
  //       ],
  //       Subject: "Reset Password",
  //       TextPart: "Password reset",
  //       HTMLPart:
  //         "<p>you requested password reset click the link below to reset your password. <br> <a href='http://localhost:3000/User/passwordReset'>new password</a>",
  //       CustomID: "AppGettingStartedTest",
  //     },
  //   ],
  // });
  // request
  //   .then((result) => {
  //     console.log(result.body);
  //     res.redirect('/')
  //   })
  //   .catch((err) => {
  //     console.log(err.statusCode);
  //   });
};

const passwordReset = async (req, res, next) => {
  const id = req.query.u;
  try {
    res.render("./pages/User/passwordReset", {
      userId: id,
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/User/forgotPassword");
  }
};

//post request for password reset
const resetPassword = async (req, res, next) => {
  const userId = req.body.userId;
  const password = req.body.password;

  // generate salt to hash password
  const salt = await bcrypt.genSalt(16);
  // now we set user password to hashed password
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await UsersModel.findById(userId);
    user.password = hashedPassword;
    user.save();
    console.log("password reset succesffully");
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/User/forgotPassword");
  }
};

//postLogin
const postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  const redirectUrl = req.session.redirectUrl || "/";

  if (!errors.isEmpty()) {
    return res.status(422).render("../views/pages/User/login", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      flashMessage: errors.errors[0].msg,
      successReg: '',
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

  UsersModel.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("email invalid."));
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.userLoggedIn = true;
            req.session.user = user;
            req.flash("message", "Welcome " + user.name);
            return req.session.save((err) => {
              console.log(err);
              res.redirect(redirectUrl);
            });
          }

          res.status(422).render("../views/pages/User/login", {
            loggedIn: req.session.userLoggedIn,
            user: req.session.user,
            flashMessage: "invalid Password.",
            successReg: '',
            oldInput: {
              email: email,
              password: password,
            },
            validationErrors: errors.array(),
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);

      res.status(422).render("../views/pages/User/login", {
        loggedIn: req.session.userLoggedIn,
        user: req.session.user,
        flashMessage: "invalid Email.",
        successReg: '',
        oldInput: {
          email: email,
          password: password,
        },
        validationErrors: errors.array(),
      });
    });
};

const postSignUp = async (req, res) => {
  const name = req.body.name;
  const contact = req.body.phoneNo;
  const email = req.body.email;
  const password = req.body.password;
  const cnfmPassword = req.body.cnfmPassword;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("../views/pages/User/signup", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      flashMessage: errors.errors[0].msg,
      oldInput: {
        name: name,
        phoneNo: contact,
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

  // Number verification
  const phoneNumber = "92" + contact.replace(/\s/g, "").substring(1);
  const otp = (() => {
    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  })();
  const msg = 'Your OTP is: ' + otp;
  console.log(msg)
  let isMsgSent;
  try {
    await fetch(`https://outreach.pk/api/sendsms.php/sendsms/url?id=rchbookingring&pass=booking1122&mask=bookingring&to=${phoneNumber}&lang=English&msg=${msg}&type=json`);
    isMsgSent = true;
  } catch (error) {
    console.log(error);
    isMsgSent = false;
  }

  if(isMsgSent){
      // generate salt to hash password
    const salt = await bcrypt.genSalt(16);
    // now we set user password to hashed password
    const hashedPassword = await bcrypt.hash(password, salt);

    req.session.userRegistration = {
      name: name,
      phoneNo: phoneNumber,
      email: email,
      password: hashedPassword,
      otp: otp
    };
    res.render('./pages/User/otp', {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      num: phoneNumber
    })
  }else{
    return res.status(422).render("../views/pages/User/signup", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      flashMessage: 'Oops! Something went wrong try again.',
      oldInput: {
        name: name,
        phoneNo: contact,
        email: email,
        password: password,
        cnfmPassword: cnfmPassword
      },
      validationErrors: errors.array(),
    });
  }

};

//Finish Registration after number verification
const completeUsrReg = async (req, res)=>{

  const enteredOtp = req.body.otp;
  if(enteredOtp == req.session.userRegistration.otp){
    const user = new UsersModel({
      name: req.session.userRegistration.name,
      phoneNo: req.session.userRegistration.phoneNo,
      email: req.session.userRegistration.email,
      password: req.session.userRegistration.password,
    });
    try {
      await user.save();
      console.log("Added user");
      req.flash('successReg', 'Registration Succesfull. you can login now.')
      res.redirect("/User/login");
    } catch (err) {
      req.flash('message', 'Try again. Something went wrong.');
      console.log(err);
      res.redirect('/User/signUp');
    }
  }else{
    req.flash('message', 'Verification failed, check Your Number.');
    res.redirect('/User/signUp');
  }
  
}

const userProfile = async (req, res, next)=>{
  res.render('./pages/User/profile', {loggedIn: true, user: req.session.user});
}

const userBookings = async(req, res, next) =>{

  const hotels = await HotelsModel.find();
  const filteredHotels = hotels.filter( hotel => {
    let flag = false;
    hotel.rooms.forEach( room => {
      room.reservations.forEach(reservation => {
        String(reservation.user._id)===String(req.session.user._id) ? flag = true : '';
      })
    })
    return flag;
  })

  const appartments = await AppartmentModel.find();
  const filteredAppartments = appartments.filter( appartment => {
    let flag = false;
    appartment.reservations.forEach(reservation => {
      String(reservation.user._id)===String(req.session.user._id) ? flag = true : '';
    })
    return flag;
  })

  const vehicles = await VehiclesModel.find();
  const filteredVehicles = vehicles.filter( vehicle => {
    let flag = false;
    vehicle.reservations.forEach(reservation => {
      String(reservation.user._id)===String(req.session.user._id) ? flag = true : '';
    })
    return flag;
  })

  const tours = await ToursModel.find();
  const filteredTours = tours.filter( tour => {
    let flag = false;
    tour.reservations.forEach(reservation => {
      String(reservation.user._id)===String(req.session.user._id) ? flag = true : '';
    })
    return flag;
  })
  
  res.render('./pages/User/bookings', {
    loggedIn: true,
    user: req.session.user,
    filteredHotels: filteredHotels,
    filteredAppartments: filteredAppartments,
    filteredVehicles: filteredVehicles,
    filteredTours: filteredTours
  });
}

const editUserProfile = async (req, res)=>{
  res.render('./pages/User/editProfile', {
    loggedIn: true, 
    user: req.session.user,
    flashMessage: ''
  });
}

const postEditUserProfile = async (req, res)=>{
  const userId = req.body.id;
  const name = req.body.name;
  const email = req.body.email;
  const phoneNo = req.body.phoneNo;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("../views/pages/User/editProfile", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      flashMessage: errors.errors[0].msg,
      oldInput: {
        name: name,
        phoneNo: phoneNo,
        email: email,
        // password: password,
      },
      validationErrors: errors.array(),
    });
  }
  
  try {
    const user = await UsersModel.findById(userId);
    user.name = name;
    user.email = email;
    user.phoneNo = phoneNo;
    await user.save();
    req.session.user = user;
    console.log('updated succesfully');
    res.redirect('/User/profile/');
  
  } catch (error) {
    console.log(error);
    req.flash('message', 'Something went wrong');
    res.redirect('/User/edit');
  }
}

const subscribe = (req, res) => {
  const email = req.body.email;
  const subscription = new subscribeModel({
    email: email,
  });
  try {
    subscription.save();
    console.log("subscription succeeded");
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

// Terms And Conditions
const termsAndCondition = (req, res, next) =>
  res.render("./pages/TermsConditions/termsAndCondition", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
  });

// FAQ's
const faqs = async (req, res, next) => {
  const queries = await queryModel.find();
  const faqs = [];

  const similarity = (s1, s2) => {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    const longerLength = longer.length;
    if (longerLength === 0) {
      return 1.0;
    }
    return (
      (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
    );
  };

  const editDistance = (s1, s2) => {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    const costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0) costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  };

  for (let i = 0; i < queries.length; i++) {
    let matches = 0;
    for (let k = i + 1; k < queries.length; k++) {
      let perc =
        Math.round(similarity(queries[i].query, queries[k].query) * 10000) /
        100;
      if (perc >= 60) {
        ++matches;
      }
    }
    if (matches >= 2) {
      faqs.push(queries[i]);
    }
  }

  res.render("./pages/FAQs/faqs", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    faqs: faqs,
  });
};

const postQuery = (req, res, next) => {
  const email = req.body.email;
  const query = req.body.query;
  const saveQuery = new queryModel({
    email: email,
    query: query,
  });
  try {
    saveQuery.save();
    console.log("query added successfully");
    res.redirect("/FAQs/faqs");
  } catch (err) {
    console.log(err);
    res.redirect("/FAQs/faqs");
  }
};

// const payment = (bookingData, redirectUrl, ) => {
//   if(!req.session.userLoggedIn){
//     req.session.redirectUrl = redirectUrl;
//     res.redirect('/user/login');
//     return;
//   }
//   req.session.bookingData = bookingData;
//   res.render("./pages/Payment/checkout", {
//     layout: false,
//     loggedIn: req.session.userLoggedIn,
//   });
// };

const safepayPayment = async (req, res) => {
  // const amount = req.body.amount;

  const config = {
    environment: "sandbox",
    sandbox: {
      baseUrl: "https://sandbox.api.getsafepay.com",
      apiKey: process.env.SAFEPAY_API_KEY,
      apiSecret: process.env.SAFEPAY_SECRET_KEY,
    },
    // production: {
    //   baseUrl: "https://api.getsafepay.com",
    //   apiKey: process.env.API_KEY,
    //   apiSecret: process.env.API_SECRET,
    // },
  };

  let sfpy = new Safepay(config);

  console.log(sfpy);

  // --------------------
  // Payments
  // --------------------

  // initialize payment
  sfpy.payments
    .create({
      amount: 2000,
      currency: "PKR",
    })
    .then((response) => {
      return response.data;
    })
    .then((data) => {
      return sfpy.checkout.create({
        tracker: data.data.token,
        orderId: "1234",
        source: "custom",
        cancelUrl: `${process.env.BASE_URL}/payment/cancel`,
        redirectUrl: `${process.env.BASE_URL}/payment/success`,
      });
    })
    .then((url) => {
      res.redirect(url);
    })
    .catch((error) => {
      console.error(error);
      res.redirect("/");
    });
};

const stripePayment = async (req, res) => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const charges = req.query.charges;

  const product = await stripe.products.create({ name: "bookingService" });
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: Number(charges),
    currency: "usd",
  });

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell

          price: price.id,

          quantity: 1,
        },
      ],

      mode: "payment",

      success_url: `${process.env.BASE_URL}/payment/success`,

      cancel_url: `${process.env.BASE_URL}/payment/cancel`,
    });

    res.redirect(303, session.url);
  } catch (err) {
    console.log(err);
    res.redirect("/payment/error");
  }
};

const paymentSuccess = async (req, res, next) => {
  
  try {
    // Room Booking data saving //////////////
  if (req.session.bookingData.bookingMode == "room") {
    const hotel = await HotelsModel.findById(req.session.bookingData.hotelId);
    let reservedRoom;
    console.log(new Date());
    hotel.rooms.forEach((room) => {
      if (room.id == req.session.bookingData.roomId) {
        room.reservations.push({
          user: req.session.user,
          checkIn: req.session.bookingData.checkIn,
          checkOut: req.session.bookingData.checkOut,
          adults: Number(req.session.bookingData.adults),
          date: req.session.bookingData.date,
        });
        reservedRoom = room;
      }
    });
    await hotel.save();
    res.redirect('/Booking/confirmed');
    // Appartment booking data save ///////////////
  } else if (req.session.bookingData.bookingMode == "appartment") {
    const appartment = await AppartmentModel.findById(
      req.session.bookingData.appartmentId
    );
    appartment.reservations.push({
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      checkIn: req.session.bookingData.checkIn,
      checkOut: req.session.bookingData.checkOut,
      adults: Number(req.session.bookingData.adults),
      date: req.session.bookingData.date,
    });
    await appartment.save();
    res.redirect('/Booking/confirmed');
    // Vehicle Booking data save //////////////////
  } else if (req.session.bookingData.bookingMode == "vehicle") {
    const vehicle = await VehiclesModel.findById(
      req.session.bookingData.vehicleId
    );
    vehicle.reservations.push({
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      checkIn: req.session.bookingData.checkIn,
      checkOut: req.session.bookingData.checkOut,
      adults: Number(req.session.bookingData.adults),
      date: req.session.bookingData.date,
    });
    await vehicle.save();
    res.redirect('/Booking/confirmed');
    // Tour/Hikes Booking Save ////////////////////
  } else if (req.session.bookingData.bookingMode == "tour") {
    const tour = await ToursModel.findById(req.session.bookingData.tourId);
    tour.availableSeats -= req.session.bookingData.seats;
    tour.reservations.push({
      user: req.session.user,
      seats: req.session.bookingData.seats,
      date: req.session.bookingData.date,
    });
    await tour.save();
    res.redirect('/Booking/confirmed');
  }
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const paymentCancel = (req, res, next) => {
  res.render("./pages/Payment/cancel", {
    layout: false,
    loggedIn: req.session.userLoggedIn,
    user: req.session.user
  });
};

const paymentError = (req, res, next) => {
  res.render("./pages/Payment/error", {
    layout: false,
    loggedIn: req.session.userLoggedIn,
    user: req.session.user
  });
};

const jazzCashResponse = (req, res) => {
  console.log(req.data);
  res.send("jazz response arrived");
};

const bookingConfirmation = (req, res, next)=>{
  console.log(req.session.bookingData)
  res.render("./pages/Payment/success", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    data: req.session.bookingData
  });
}

module.exports = {
  // HomePage
  home,

  // Appartments
  appartments,
  allappartments,
  apartmentBooking,
  appartmentGallery,
  postAppartmentBooking,
  searchAppartments,
  findAppartments,

  //hotels
  hotels,
  hotelGallery,
  hotelRooms,
  roomBooking,
  postRoomBooking,
  findHotels,
  roomFilter,

  //vehicles
  vehicles,
  vehicleBooking,
  galleryAppRoom,
  searchHotels,
  postVehicleBooking,
  searchVehicles,
  findVehicles,

  // Tours
  tours,
  hike,
  booking,
  gallerytandh,
  postTourEnrolling,
  searchTour,

  // News
  news,
  exploreNews,

  // About
  about,

  // Contact
  contact,
  postMessage,

  // User
  login,
  signup,
  completeUsrReg,
  userProfile,
  editUserProfile,
  postEditUserProfile,
  userBookings,
  verification,
  forgotPassword,
  passwordReset,
  postSignUp,
  postLogin,
  logout,
  sendMail,
  resetPassword,
  subscribe,

  // Terms And Conditions
  termsAndCondition,

  // FAQ's
  faqs,
  postQuery,

  //payment
  safepayPayment,
  stripePayment,
  paymentSuccess,
  paymentCancel,
  paymentError,
  jazzCashResponse,

  //booking
  bookingConfirmation
};
