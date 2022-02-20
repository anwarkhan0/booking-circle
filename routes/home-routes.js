const express = require('express');

const {
    // HomePage
    home,

    // Services (Appartments)
    appartments, allappartments, apartmentBooking, appartmentGallery, postAppartmentBooking, searchAppartments, findAppartments,
    
    //hotels
    hotels, hotelGallery, hotelRooms,  roomBooking, searchHotels, postRoomBooking, findHotels,
    
    //vehicles
    vehicles, vehicleBooking, galleryAppRoom, postVehicleBooking, searchVehicles, findVehicles,

    // Tours
    tours, hike, booking, gallerytandh, postTourEnrolling, searchTour,

    // News
    news, exploreNews,

    // About Us
    about,

    // Contact
    contact, postFeedback,

    // User
    login, signup, verification, forgotPassword, passwordReset, postSignUp, postLogin, logout, sendMail, resetPassword,

    // Terms And Conditions
    termsAndCondition,

    // FAQ's
    faqs,

    //payment
    payment,
    postPayment,
    paymentSuccess,
    paymentCancel

} = require('../controllers/homeController');
const router = express.Router();
const { body } = require("express-validator");
const UsersModel = require('../models/usersModel');
const isAuth = require('../middleware/userAuth');

// HomePage
router.get('/', home)

router.get('/payment', payment)
router.post('/payment', postPayment)
router.get('/payment/success', paymentSuccess)
router.get('/paymentCancel', paymentCancel)

///////////////////////// Services ///////////////////////////
// Appartments
router.get('/Appartments/availableAppartments/', findAppartments)
router.get('/Appartments/appartments', appartments)
router.get('/Appartments/allappartments', allappartments)
router.get('/Appartments/apartmentBooking/:id', apartmentBooking)
router.get('/Appartments/appartmentGallery', appartmentGallery)
router.get('/Appartments/:location', searchAppartments)
router.post('/Appartments/apartmentBooking', postAppartmentBooking)

router.get('/Hotels/availableHotels/', findHotels)
router.get('/Hotels/list', hotels)
router.get('/Hotels/hotelGallery/:id', hotelGallery)
router.get('/Hotels/rooms/:id', hotelRooms)
router.get('/Hotels/roomBooking/:hotelId', roomBooking)
router.post('/hotels/roomBooking', postRoomBooking)
router.get('/Hotels/:location', searchHotels)

router.get('/Vehicles/availableVehicles/', findVehicles)
router.get('/Vehicles/list', vehicles)
router.get('/Vehicles/vehicleBooking/:id', vehicleBooking)
router.get('/Appartments/galleryAppRoom', galleryAppRoom)
router.get('/Vehicles/:location', searchVehicles)
router.post('/Vehicles/booking', postVehicleBooking)


// Tours
router.get('/Tours/tours', tours)
router.get('/Tours/hike', hike)
router.get('/Tours/booking/:id', booking)
router.get('/Tours/gallerytandh', gallerytandh)
router.get('/Tours/:location', searchTour)
router.post('/Tours/enrolling', postTourEnrolling)

// News
router.get('/News/news', news)
router.get('/News/post/:id', exploreNews)

// About Us
router.get('/About/about', about)

// Contact
router.get('/Contact/contact', contact)
router.post('/Contact/feedback', postFeedback)

// User
router.get('/User/login', login)
router.get('/User/logout', logout)
router.get('/User/signup', signup)
router.get('/User/verification', verification)
router.get('/User/forgotPassword', forgotPassword)
router.post('/User/forgotPassword',
  body("email")
    .isEmail()
    .custom((value, { req }) => {
      return UsersModel.findOne({ email: value }).then((user) => {
        if (!user) {
          return Promise.reject(
            "E-Mail does not exist Please enter a valid one."
          );
        }
      });
    })
    .normalizeEmail()
    .trim()
    , sendMail)
router.get('/User/passwordReset', passwordReset)
router.post('/User/passwordReset', resetPassword)
router.post(
  "/signUp",
  [
    body("name", "Please enter valid name.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          return false;
        } else {
          return true;
        }
      })
      .trim()
      .escape(),
    body("phoneNo", "Please enter valid phone number.")
      .isLength({ min: 10, max: 13})
      .trim(),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return UsersModel.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 8 characters."
    )
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
  ],
  postSignUp
);

router.post(
  "/user/postLogin",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail()
      .trim(),
    body("password", "Password has to be valid.").trim(),
  ],
  postLogin
);

router.get('/user/mailSent', (req, res, next)=> res.render('./pages/User/emailSent', {layout: false}));

// Terms And Conditions
router.get('/TermsConditions/termsAndCondition', termsAndCondition)

// FAQ's
router.get('/FAQs/faqs', faqs)


module.exports = {
    routes: router
}