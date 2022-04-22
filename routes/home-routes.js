const express = require("express");

const {
  // HomePage
  home,

  // Services (Appartments)
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
  searchHotels,
  postRoomBooking,
  findHotels,

  //vehicles
  vehicles,
  vehicleBooking,
  galleryAppRoom,
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

  // About Us
  about,

  // Contact
  contact,
  postMessage,

  // User
  login,
  signup,
  verification,
  forgotPassword,
  userProfile,
  editUserProfile,
  postEditUserProfile,
  userBookings,
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
  payment,
  safepayPayment,
  stripePayment,
  paymentSuccess,
  paymentCancel,
  paymentError,
  jazzCashResponse,
  roomFilter
} = require("../controllers/homeController");
const router = express.Router();
const { body, query } = require("express-validator");
const UsersModel = require("../models/usersModel");
const isAuth = require("../middleware/userAuth");

// HomePage
router.get("/", home);

// router.get("/payment", payment);
router.get("/payment/paymentSafepay", safepayPayment);
router.get("/payment/paymentStripe", stripePayment);
router.get("/payment/success", paymentSuccess);
router.get("/payment/cancel", paymentCancel);
router.get("/payment/error", paymentError);
router.post("/payment/jazzcash", jazzCashResponse)

///////////////////////// Services ///////////////////////////

// Gallery
router.get("/galleryAppRoom", galleryAppRoom);
// Appartments
router.get("/Appartments/availableAppartments/", findAppartments);
router.get("/Appartments/appartments", appartments);
router.get("/Appartments/allappartments", allappartments);
router.get("/Appartments/apartmentBooking/:id", apartmentBooking);
router.get("/Appartments/appartmentGallery", appartmentGallery);
router.get("/Appartments/:location", searchAppartments);
router.get("/Appartments/booking/payment",
[
  query("checkIn", "Please enter Check In Date.").notEmpty(),
  query("checkOut", "Please enter Check Out Date.").custom((val, {req, loc, path}) =>{
    let checkout = new Date(val.replace(/\./g, "/"));
    let checkin = new Date(req.query.checkIn.replace(/\./g, "/"));
    if(checkout <= checkin){
      throw new Error("Please Select a valid checkout date.");
    }else{
      return true;
    }
  }),
  query("adults", "Enter number of Adults").custom(val => val == 'false' ? false : true),
  query("children", "Enter number of Children.").custom(val => val == 'false' ? false : true)
],
postAppartmentBooking);

// Hotels
router.get("/Hotels/roomFilter", roomFilter);
router.get("/Hotels/availableHotels/", findHotels);
router.get("/Hotels/list", hotels);
router.get("/Hotels/hotelGallery/:id", hotelGallery);
router.get("/Hotels/rooms/:id", hotelRooms);
router.get(
  "/hotels/roomBooking/payment",
  [
    query("checkIn", "Please enter Check In Date.").notEmpty(),
    query("checkOut", "Please enter Check Out Date.").custom((val, {req, loc, path}) =>{
      let checkout = new Date(val.replace(/\./g, "/"));
      let checkin = new Date(req.query.checkIn.replace(/\./g, "/"));
      if(checkout <= checkin){
        throw new Error("Please Select a valid checkout date.");
      }else{
        return true;
      }
    }),
    query("adults", "Enter number of Adults").custom(val => val == 'false' ? false : true),
    query("children", "Enter number of Children.").custom(val => val == 'false' ? false : true)
  ],
  postRoomBooking
);
router.get("/Hotels/roomBooking/:hotelId", roomBooking);
router.get("/Hotels/:location", searchHotels);

router.get("/Vehicles/booking",
[
  query("checkIn", "Please enter Check In Date.").notEmpty(),
  query("checkOut", "Please enter Check Out Date.").custom((val, {req, loc, path}) =>{
    let checkout = new Date(val.replace(/\./g, "/"));
    let checkin = new Date(req.query.checkIn.replace(/\./g, "/"));
    if(checkout <= checkin){
      throw new Error("Please Select a valid checkout date.");
    }else{
      return true;
    }
  }),
  query("adults", "Enter number of Adults").custom(val => val == 'false' ? false : true),
  query("children", "Enter number of Children.").custom(val => val == 'false' ? false : true)
],
postVehicleBooking);
router.get("/Vehicles/availableVehicles", findVehicles);
router.get("/Vehicles/list", vehicles);
router.get("/Vehicles/vehicleBooking/:id", vehicleBooking);
router.get("/Vehicles/:location", searchVehicles);


// Tours
router.get("/Tours/tours", tours);
router.get("/Tours/hike", hike);
router.get("/Tours/enrolling",
[
  query("seats", "Enter number of Seats.").notEmpty().custom(val => val == 'undefined' ? false : true)
],
postTourEnrolling);
router.get("/Tours/booking/:id", booking);
router.get("/Tours/gallerytandh", gallerytandh);
router.get("/Tours/:location", searchTour);


// News
router.get("/News/news", news);
router.get("/News/post/:id", exploreNews);

// About Us
router.get("/About/about", about);

// Contact
router.get("/Contact/contact", contact);
router.post("/Contact/feedback", postMessage);

// User
router.get("/User/login", login);
router.get("/User/logout", logout);
router.get("/User/signup", signup);
router.get("/User/verification", verification);
router.get("/User/forgotPassword", forgotPassword);
router.get("/User/profile", userProfile);
router.get("/User/edit", editUserProfile);
router.get("/User/bookings", userBookings)
router.post(
  "/User/edit",
  body("name", "please enter valid name.")
    .notEmpty()
    .custom((value) => {
      if(value.trim().length == 0){
        return false;
      }else{
        return true;
      }
    })
    .trim(),
  body("email", "please enter valid email.")
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
    .trim(),
  body("phoneNo", "please enter valid number.")
  .notEmpty()
  .custom((value) => {
    if(value.trim().length == 0){
      return false;
    }else{
      return true;
    }
  })
  .isNumeric()
  .isLength({min: 11, max: 11})
  .trim(),
  postEditUserProfile
);
router.post('/User/subscribe', subscribe);
router.post(
  "/User/forgotPassword",
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
    .trim(),
  sendMail
);
router.get("/User/passwordReset", passwordReset);
router.post("/User/passwordReset", resetPassword);
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
      .isLength({ min: 10, max: 13 })
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

router.get("/user/mailSent", (req, res, next) =>
  res.render("./pages/User/emailSent", { layout: false })
);

// Terms And Conditions
router.get("/TermsConditions/termsAndCondition", termsAndCondition);

// FAQ's
router.get("/FAQs/faqs", faqs);
router.post("/query", postQuery)

module.exports = {
  routes: router,
};
