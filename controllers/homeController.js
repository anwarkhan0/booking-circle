const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const HomeModel = require('../models/homeModel');
const AreasModel = require('../Admin/models/Location');
const AppartmentModel = require('../Admin/models/Appartment');
const HotelsModel = require('../Admin/models/Hotel');
const VehiclesModel = require('../Admin/models/Vehicles');
const ToursModel = require('../Admin/models/Tour');
const NewsModel = require('../Admin/models/Updates');
const UsersModel = require('../models/usersModel');
const FeedbackModel = require('../Admin/models/Feedback');
const { json } = require("express");

// HomePage
const home = async (req, res, next) => {
    const areas = await HomeModel.fetchAreas();
    res.render('./pages/HomePage/home', {
        areas: areas
    });
}

//Appartments
const appartments = (req, res, next) => res.render('./pages/Appartments/appartments');
const allappartments = async (req, res, next) => {
    //areas
    const areas = await AreasModel.find();
    //fetch appartments
    const appartments = await AppartmentModel.find();
    res.render('./pages/Appartments/allappartments', {
        areas: areas,
        appartments: appartments
    });
}
const apartmentBooking = async (req, res, next) => {
  const appartId = req.params.id;
  const appartment = await AppartmentModel.findById(appartId);

  res.render('./pages/Appartments/apartmentBooking', {
    appartment: appartment
  });
}

const searchAppartments = async (req, res, next)=>{
  const location = req.params.location;
  const appartments = await AppartmentModel.find({area: location})
  res.render('./pages/Appartments/searchResult', {
    appartments: appartments
  })
}

const postAppartmentBooking = async (req, res, next) => {

  const appartmentId = req.body.appartmentId;
  const checkIn = req.body.checkIn;
  const checkOut = req.body.checkOut;
  const adults = req.body.adults;
  const children = req.body.children;

  try {
    const appartment = await AppartmentModel.findById(appartmentId);
    appartment.reservations.push({
      checkIn: checkIn,
      checkOut: checkOut,
      adults: adults,
      children: children,
    });
    await appartment.save();
    console.log("appartment booked");
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
  }

};

const appartmentGallery = (req, res, next) => res.render('./pages/Appartments/appartmentGallery');

// hotels
const hotels = async (req, res, next) => {
    //areas
    const areas = await AreasModel.find();
    //hotels
    const hotels = await HotelsModel.find();
    res.render('./pages/Hotels/hotels', {
        hotels: hotels,
        areas: areas
    });
    
}

const searchHotels = async (req, res, next)=>{
  const location = req.params.location;
  const hotels = await HotelsModel.find({area: location})
  res.render('./pages/Hotels/searchResult', {
    hotels: hotels
  })
}

const hotelGallery = async (req, res, next) => {
  const hotelId = req.params.id;
  const hotel = await HotelsModel.findById(hotelId);
  res.render('./pages/Hotels/hotelGallery', {
    hotel: hotel
  });
}
const hotelRooms = async (req, res, next) => {
  const hotelId = req.params.id;
  const hotel = await HotelsModel.findById(hotelId);
  const rooms = hotel.rooms;

  res.render('./pages/Hotels/hotelRooms',{
    hotelId: hotel.id,
    rooms: rooms
  });
}

// vehicles
const vehicles = async (req, res, next) => {
    //areas
    const areas = await AreasModel.find();
    //vehicles
    const vehicles = await VehiclesModel.find();
    res.render('./pages/Vehicles/vehicles', {
        areas: areas,
        vehicles: vehicles
    });
}
const vehicleBooking = async (req, res, next) => {
  const id = req.params.id;
  const areas = await AreasModel.find();
  const vehicle = await VehiclesModel.findById(id);
  res.render('./pages/Vehicles/vehicleBooking', {
    areas: areas,
    vehicle: vehicle
  });
}

const searchVehicles = async (req, res, next)=>{
  const location = req.params.location;
  const vehicles = await VehiclesModel.find()
  res.render('./pages/Vehicles/searchResult', {
    vehicles: vehicles
  })
}

const postVehicleBooking = async (req, res, next) => {

  const vehicleId = req.body.vehicleId;
  const checkIn = req.body.checkIn;
  const checkOut = req.body.checkOut;
  const location = req.body.location;
  const adults = req.body.adults;
  const children = req.body.children;

  try {
    const vehicle = await VehiclesModel.findById(vehicleId);
    vehicle.reservations.push({
      checkIn: checkIn,
      checkOut: checkOut,
      location: location,
      adults: adults,
      children: children,
    });
    await vehicle.save();
    console.log("vehicle booked");
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
  }

};

const galleryAppRoom = (req, res, next) => res.render('./pages/Appartments/galleryAppRoom');

const roomBooking = async (req, res, next) => {
  const hotelId = req.params.hotelId;
  const roomIndex = req.query.i;

  const hotel = await HotelsModel.findById(hotelId);
  const room = hotel.rooms[roomIndex];
  res.render('./pages/Hotels/roomBooking', {
    hotelId: hotelId,
    room: room
  });
}

const postRoomBooking = async (req, res, next)=>{
  
  const hotelId = req.body.hotelId;
  const roomId = req.body.roomId;
  const checkIn = req.body.checkIn;
  const checkOut = req.body.checkOut;
  const adults = req.body.adults;
  const children = req.body.children;

  const hotel = await HotelsModel.findById(hotelId);
  for(let i= 0; i< hotel.rooms.length; i++){
    if(hotel.rooms[i].id === roomId){
      hotel.rooms[i].reservations.push({
        checkIn: checkIn,
        checkOut: checkOut,
        adults: adults,
        children: children
      })
    }
  }
  try{
    await hotel.save();
    console.log('room booked');
  }catch(err){
    console.log(err)
  }
  
}

// Tours 
const tours = async (req, res, next) => {
    const areas = await AreasModel.find();
    const data = await ToursModel.find();
    let tours = [];
    let hikes = [];
    for(let i= 0; i< data.length; i++){
      if(data[i].tourType === 'tour'){
        tours.push(data[i]);
      }else{
        hikes.push(data[i]);
      }
    }
    res.render('./pages/Tours/tours', {
        areas: areas,
        tours: tours,
        hikes: hikes
    });
}

const searchTour = async (req, res, next)=>{
  const location = req.params.location;
  const tours = await ToursModel.find({toPlace: location})
  res.render('./pages/Tours/searchResult', {
    tours: tours
  })
}

const hike = (req, res, next) => res.render('./pages/Tours/hike');
const booking = async (req, res, next) => {
  const id = req.params.id;
  const tour = await ToursModel.findById(id);
  res.render("./pages/Tours/booking", { tour: tour });
};

const postTourEnrolling = async (req, res, next) => {

  const tourId = req.body.tourId;
  const seats = req.body.seats;

  try {
    const tour = await ToursModel.findById(tourId);
    tour.availableSeats = tour.availableSeats - seats;
    tour.reservations.push({
      name: "john doe",
      seats: seats,
    });
    await tour.save();
    console.log("enrolled in tour");
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
  }

};


const gallerytandh = (req, res, next) => res.render('./pages/Tours/gallerytandh');

// News
const news = async (req, res, next) => {
    const news = await NewsModel.find();
    res.render('./pages/News/news', {news: news});
}
const exploreNews = async (req, res, next) => {
    const id = req.params.id;
    try {
      const post = await NewsModel.findById(id);
      res.render("./pages/News/exploreNews", { post: post });
    } catch (err) {
      console.log(err);
      res.redirect("/");
    }
    
}

// About Us
const about = (req, res, next) => res.render('./pages/About/about');

// Contact 
const contact = (req, res, next) => {
  res.render('./pages/Contact/contact');
}

const postFeedback = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  try{
    const feedback = new FeedbackModel({
      name: name,
      email: email, 
      message: message
    });
    await feedback.save();
    console.log('feedback added');
    res.redirect('/');
  }catch(err){
    console.log(err);
  }
}

// User
const login = (req, res, next) => res.render('./pages/User/login');
const signup = (req, res, next) => {
    res.render('./pages/User/signup', {
        flashMessage: '',
        oldInput: {
            name: '',
            phoneNo: '',
            email: '',
            password: ''
        }
    });
}
const verification = (req, res, next) => res.render('./pages/User/verification');
const forgotPassword = (req, res, next) => res.render('./pages/User/forgotPassword');
const passwordReset = (req, res, next) => res.render('./pages/User/passwordReset');

const postSignUp = async (req, res) => {

    const name = req.body.name;
    const contact = req.body.phoneNo;
    const email = req.body.email;
    const password = req.body.password;
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("../views/pages/User/signup", {
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
    
  // generate salt to hash password
  const salt = await bcrypt.genSalt(16);
  // now we set user password to hashed password
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new UsersModel({
    name: name,
    phoneNo: contact,
    email: email,
    password: hashedPassword,
  });

  try {
    await user.save();
    console.log("Added user");
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
}

// Terms And Conditions
const termsAndCondition = (req, res, next) => res.render('./pages/TermsConditions/termsAndCondition');

// FAQ's
const faqs = (req, res, next) => res.render('./pages/FAQs/faqs');

module.exports = {
    // HomePage
    home,

    // Appartments
    appartments, allappartments, apartmentBooking, appartmentGallery, postAppartmentBooking, searchAppartments,
    
    //hotels
    hotels, hotelGallery, hotelRooms, roomBooking, postRoomBooking,
    
    //vehicles
    vehicles, vehicleBooking, galleryAppRoom, searchHotels, postVehicleBooking, searchVehicles,

    // Tours
    tours, hike, booking, gallerytandh, postTourEnrolling, searchTour,

    // News
    news, exploreNews,

    // About
    about,

    // Contact
    contact, postFeedback,

    // User
    login, signup, verification, forgotPassword, passwordReset, postSignUp,

    // Terms And Conditions
    termsAndCondition,

    // FAQ's
    faqs
}