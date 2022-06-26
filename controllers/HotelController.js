const bcrypt = require("bcrypt");
const { validationResult, check } = require("express-validator");
const Safepay = require("safepay");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const AreasModel = require("../models/Location");
const HotelsModel = require("../models/Hotel");

// hotels
const hotels = async (req, res, next) => {
  //areas
  const areas = await AreasModel.find();
  //hotels
  const hotels = await HotelsModel.find();
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
  const allAdults = Number(req.query.adults);
  const children = Number(req.query.children);
  console.log(allAdults, children)
  let adults = allAdults + children / 2;

  const hotels = await HotelsModel.find({ location: location });
  const HotelsFound = [];
  // set counter to count rooms
  const entry = new Date(checkIn);
  const exit = new Date(checkOut);
 
  hotels.forEach((hotel) => {
    const singleFit = adults / hotel.rooms.single.occupancy <= 1 ? true : false;
    const twinFit = adults / hotel.rooms.twin.occupancy <= 1 ? true : false;
    const tripleFit = adults / hotel.rooms.triple.occupancy <= 1 ? true : false;
    const quadFit =
      adults / hotel.rooms.quad.occupancy <= 1 <= 1 ? true : false;
    const quinFit =
      adults / hotel.rooms.quin.occupancy <= 1 <= 1 ? true : false;
    if (singleFit) {
      console.log("checking single rooms");
      let isIndexAvailable;
      for (let i = 0; i < hotel.rooms.single.total; i++) {
        isIndexAvailable = true;
        console.log("room index: ", i);
        hotel.rooms.single.reservations.forEach((reservation) => {
          if (
            entry >= reservation.checkIn &&
            entry <= reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          } else if (
            exit >= reservation.checkIn &&
            exit <= reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          } else if (
            entry < reservation.checkIn &&
            exit > reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          }
        });

        if (isIndexAvailable) {
          HotelsFound.push(hotel);
          break;
        }
      }
    } else if (twinFit) {
      console.log("checking twin rooms");
      let isIndexAvailable;
      for (let i = 0; i < hotel.rooms.twin.total; i++) {
        isIndexAvailable = true;
        console.log("room index: ", i);
        hotel.rooms.twin.reservations.forEach((reservation) => {
          if (
            entry >= reservation.checkIn &&
            entry <= reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          } else if (
            exit >= reservation.checkIn &&
            exit <= reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          } else if (
            entry < reservation.checkIn &&
            exit > reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          }
        });

        if (isIndexAvailable) {
          HotelsFound.push(hotel);
          break;
        }
      }
    } else if (tripleFit) {
      console.log("checking triple rooms");
      let isIndexAvailable;
      for (let i = 0; i < hotel.rooms.triple.total; i++) {
        isIndexAvailable = true;
        console.log("room index: ", i);
        hotel.rooms.triple.reservations.forEach((reservation) => {
          if (
            entry >= reservation.checkIn &&
            entry <= reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          } else if (
            exit >= reservation.checkIn &&
            exit <= reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          } else if (
            entry < reservation.checkIn &&
            exit > reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          }
        });

        if (isIndexAvailable) {
          HotelsFound.push(hotel);
          break;
        }
      }
    } else if (quadFit) {
      console.log("checking quadruple rooms");
      let isIndexAvailable;
      for (let i = 0; i < hotel.rooms.quad.total; i++) {
        isIndexAvailable = true;
        console.log("room index: ", i);
        hotel.rooms.quad.reservations.forEach((reservation) => {
          if (
            entry >= reservation.checkIn &&
            entry <= reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          } else if (
            exit >= reservation.checkIn &&
            exit <= reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          } else if (
            entry < reservation.checkIn &&
            exit > reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          }
        });

        if (isIndexAvailable) {
          HotelsFound.push(hotel);
          break;
        }
      }
    } else if (quinFit) {
      console.log("checking quintruple rooms");
      let isIndexAvailable;
      for (let i = 0; i < hotel.rooms.quin.total; i++) {
        isIndexAvailable = true;
        console.log("room index: ", i);
        hotel.rooms.quin.reservations.forEach((reservation) => {
          if (
            entry >= reservation.checkIn &&
            entry <= reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          } else if (
            exit >= reservation.checkIn &&
            exit <= reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          } else if (
            entry < reservation.checkIn &&
            exit > reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          }
        });

        if (isIndexAvailable) {
          HotelsFound.push(hotel);
          break;
        }
      }
    }
  });
   

  res.render("./pages/Hotels/availableHotels", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    hotels: HotelsFound,
  });

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

  res.render("./pages/Hotels/roomBooking", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    hotelId: hotel.id,
    hotel: hotel,
    oldInput: {
      checkIn: "",
      checkOut: "",
      adults: false,
      children: false,
    },
    flashMessage: "",
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

const postRoomCheck = async (req, res, next) => {
  const hotelId = req.body.hotelId;
  const checkIn = req.body.checkIn.replace(/\./g, "/");
  const checkOut = req.body.checkOut.replace(/\./g, "/");
  const noOfRooms = Number(req.body.numOfRooms);

  const adults1 = Number(req.body.adults1);
  const children1 = Number(req.body.children1);

  const adults2 = req.body.adults2 ? Number(req.body.adults2) : "";
  const children2 = req.body.children2 ? Number(req.body.children2) : "";

  const adults3 = req.body.adults3 ? Number(req.body.adults3) : "";
  const children3 = req.body.children3 ? Number(req.body.children3) : "";

  const adults4 = req.body.adults4 ? Number(req.body.adults4) : "";
  const children4 = req.body.children4 ? Number(req.body.children4) : "";

  const adults5 = req.body.adults5 ? Number(req.body.adults5) : "";
  const children5 = req.body.children5 ? Number(req.body.children5) : "";

  const hotel = await HotelsModel.findById(hotelId);
  // set counter to count rooms
  const entry = new Date(checkIn);
  const exit = new Date(checkOut);

  let totalCharges = 0;
  const booking = {
    type: 1,
    single: [],
    twin: [],
    triple: [],
    quad: [],
    quin: []
  }

  let counter = 1;
  let isAllFound = true;
  let singleFit, twinFit, tripleFit, quadFit, quinFit;
  while (counter <= noOfRooms) {
    if (counter == 1) {
      singleFit =
        (adults1 + children1 / 2) / hotel.rooms.single.occupancy <= 1
          ? true
          : false;
      twinFit =
        (adults1 + children1 / 2) / hotel.rooms.twin.occupancy <= 1
          ? true
          : false;
      tripleFit =
        (adults1 + children1 / 2) / hotel.rooms.triple.occupancy <= 1
          ? true
          : false;
      quadFit =
        (adults1 + children1 / 2) / hotel.rooms.quad.occupancy <= 1 <= 1
          ? true
          : false;
      quinFit =
        (adults1 + children1 / 2) / hotel.rooms.quin.occupancy <= 1 <= 1
          ? true
          : false;
    } else if (counter == 2) {
      singleFit =
        (adults2 + children2 / 2) / hotel.rooms.single.occupancy <= 1
          ? true
          : false;
      twinFit =
        (adults2 + children2 / 2) / hotel.rooms.twin.occupancy <= 1
          ? true
          : false;
      tripleFit =
        (adults2 + children2 / 2) / hotel.rooms.triple.occupancy <= 1
          ? true
          : false;
      quadFit =
        (adults2 + children2 / 2) / hotel.rooms.quad.occupancy <= 1 <= 1
          ? true
          : false;
      quinFit =
        (adults2 + children2 / 2) / hotel.rooms.quin.occupancy <= 1 <= 1
          ? true
          : false;
    } else if (counter == 3) {
      singleFit =
        (adults3 + children3 / 2) / hotel.rooms.single.occupancy <= 1
          ? true
          : false;
      twinFit =
        (adults3 + children3 / 2) / hotel.rooms.twin.occupancy <= 1
          ? true
          : false;
      tripleFit =
        (adults3 + children3 / 2) / hotel.rooms.triple.occupancy <= 1
          ? true
          : false;
      quadFit =
        (adults3 + children3 / 2) / hotel.rooms.quad.occupancy <= 1 <= 1
          ? true
          : false;
      quinFit =
        (adults3 + children3 / 2) / hotel.rooms.quin.occupancy <= 1 <= 1
          ? true
          : false;
    } else if (counter == 4) {
      singleFit =
        (adults4 + children4 / 2) / hotel.rooms.single.occupancy <= 1
          ? true
          : false;
      twinFit =
        (adults4 + children4 / 2) / hotel.rooms.twin.occupancy <= 1
          ? true
          : false;
      tripleFit =
        (adults4 + children4 / 2) / hotel.rooms.triple.occupancy <= 1
          ? true
          : false;
      quadFit =
        (adults4 + children4 / 2) / hotel.rooms.quad.occupancy <= 1 <= 1
          ? true
          : false;
      quinFit =
        (adults4 + children4 / 2) / hotel.rooms.quin.occupancy <= 1 <= 1
          ? true
          : false;
    } else if (counter == 5) {
      singleFit =
        (adults5 + children5 / 2) / hotel.rooms.single.occupancy <= 1
          ? true
          : false;
      twinFit =
        (adults5 + children5 / 2) / hotel.rooms.twin.occupancy <= 1
          ? true
          : false;
      tripleFit =
        (adults5 + children5 / 2) / hotel.rooms.triple.occupancy <= 1
          ? true
          : false;
      quadFit =
        (adults5 + children5 / 2) / hotel.rooms.quad.occupancy <= 1 <= 1
          ? true
          : false;
      quinFit =
        (adults5 + children5 / 2) / hotel.rooms.quin.occupancy <= 1 <= 1
          ? true
          : false;
    }

    if (singleFit) {
      console.log("checking single rooms");
      let isIndexAvailable;
      console.log("checking for room no: ", counter);
      for (let i = 0; i < hotel.rooms.single.total; i++) {
        isIndexAvailable = true;
        console.log("room index: ", i);
        hotel.rooms.single.reservations.forEach((reservation) => {
          if (
            entry >= reservation.checkIn &&
            entry <= reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          } else if (
            exit >= reservation.checkIn &&
            exit <= reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          } else if (
            entry < reservation.checkIn &&
            exit > reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          }
        });

        if (isIndexAvailable) {
          totalCharges += hotel.rooms.single.charges;
          booking.single.push({
            roomIndex: i,
            noOfRooms: noOfRooms,
            date: new Date(),
            checkIn: entry,
            checkOut: exit
          });
          req.session.booking = booking;
          console.log("room reserved on index : " + i);
          break;
        } else {
          console.log("index", i, "is reserved");
          const isLastIndex = i + 1 == hotel.rooms.single.total ? true : false;
          if (isLastIndex) {
            isAllFound = false;
          }
        }
      }
    } else if (twinFit) {
      console.log("checking twin rooms");
      let isIndexAvailable;
      console.log("checking for room no: ", counter);
      for (let i = 0; i < hotel.rooms.twin.total; i++) {
        isIndexAvailable = true;
        console.log("room index: ", i);
        hotel.rooms.twin.reservations.forEach((reservation) => {
          if (
            entry >= reservation.checkIn &&
            entry <= reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          } else if (
            exit >= reservation.checkIn &&
            exit <= reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          } else if (
            entry < reservation.checkIn &&
            exit > reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          }
        });

        if (isIndexAvailable) {
          totalCharges += hotel.rooms.twin.charges;
          booking.twin.push({
            roomIndex: i,
            noOfRooms: noOfRooms,
            date: new Date(),
            checkIn: entry,
            checkOut: exit
          });
          req.session.booking = booking;
          console.log("room reserved on index : " + i);
          break;
        } else {
          console.log("index", i, "is reserved");
          const isLastIndex = i + 1 == hotel.rooms.twin.total ? true : false;
          if (isLastIndex) {
            isAllFound = false;
          }
        }
      }
    } else if (tripleFit) {
      console.log("checking triple rooms");
      let isIndexAvailable;
      console.log("checking for room no: ", counter);
      for (let i = 0; i < hotel.rooms.triple.total; i++) {
        isIndexAvailable = true;
        console.log("room index: ", i);
        hotel.rooms.triple.reservations.forEach((reservation) => {
          if (
            entry >= reservation.checkIn &&
            entry <= reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          } else if (
            exit >= reservation.checkIn &&
            exit <= reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          } else if (
            entry < reservation.checkIn &&
            exit > reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          }
        });

        if (isIndexAvailable) {
          totalCharges += hotel.rooms.triple.charges;
          booking.triple.push({
            roomIndex: i,
            noOfRooms: noOfRooms,
            date: new Date(),
            checkIn: entry,
            checkOut: exit
          });
          req.session.booking = booking;
          console.log("room reserved on index : " + i);
          break;
        } else {
          console.log("index", i, "is reserved");
          const isLastIndex = i + 1 == hotel.rooms.triple.total ? true : false;
          if (isLastIndex) {
            isAllFound = false;
          }
        }
      }
    } else if (quadFit) {
      console.log("checking quadruple rooms");
      let isIndexAvailable;
      console.log("checking for room no: ", counter);
      for (let i = 0; i < hotel.rooms.quad.total; i++) {
        isIndexAvailable = true;
        console.log("room index: ", i);
        hotel.rooms.quad.reservations.forEach((reservation) => {
          if (
            entry >= reservation.checkIn &&
            entry <= reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          } else if (
            exit >= reservation.checkIn &&
            exit <= reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          } else if (
            entry < reservation.checkIn &&
            exit > reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          }
        });

        if (isIndexAvailable) {
          totalCharges += hotel.rooms.quad.charges;
          booking.single.push({
            roomIndex: i,
            noOfRooms: noOfRooms,
            date: new Date(),
            checkIn: entry,
            checkOut: exit
          });
          req.session.booking = booking;
          console.log("room reserved on index : " + i);
          break;
        } else {
          console.log("index", i, "is reserved");
          const isLastIndex = i + 1 == hotel.rooms.quad.total ? true : false;
          if (isLastIndex) {
            isAllFound = false;
          }
        }
      }
    } else if (quinFit) {
      console.log("checking quintruple rooms");
      let isIndexAvailable;
      console.log("checking for room no: ", counter);
      for (let i = 0; i < hotel.rooms.quin.total; i++) {
        isIndexAvailable = true;
        console.log("room index: ", i);
        hotel.rooms.quin.reservations.forEach((reservation) => {
          if (
            entry >= reservation.checkIn &&
            entry <= reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          } else if (
            exit >= reservation.checkIn &&
            exit <= reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          } else if (
            entry < reservation.checkIn &&
            exit > reservation.checkOut &&
            reservation.roomIndex == i
          ) {
            isIndexAvailable = false;
          }
        });

        if (isIndexAvailable) {
          totalCharges += hotel.rooms.quin.charges;
          booking.single.push({
            roomIndex: i,
            noOfRooms: noOfRooms,
            date: new Date(),
            checkIn: entry,
            checkOut: exit
          });
          req.session.booking = booking;
          console.log("room reserved on index : " + i);
          break;
        } else {
          console.log("index", i, "is reserved");
          const isLastIndex = i + 1 == hotel.rooms.quin.total ? true : false;
          if (isLastIndex) {
            isAllFound = false;
          }
        }
      }
    }
    counter++;
  }

  try {
    
    if (isAllFound) {
      req.session.booking.hotelId = hotel.id;
      req.session.booking.total = totalCharges;

      res.redirect("/Bookings/userDetails");
      
      
    } else {
      const hotels = await HotelsModel.find();
      return res.render("./pages/Hotels/noRoomAvailable", {
        loggedIn: req.session.userLoggedIn,
        user: req.session.user,
        hotels: hotels
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(422).render("./pages/Hotels/roomBooking", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      hotel: hotel,
      flashMessage: "Something Went Wrong.",
      oldInput: {
        checkIn: checkIn,
        checkOut: checkOut,
      },
      // validationErrors: errors.array(),
    });
  }
};

module.exports = {
  hotels,
  hotelGallery,
  hotelRooms,
  roomBooking,
  postRoomCheck,
  findHotels,
  searchHotels,
};
