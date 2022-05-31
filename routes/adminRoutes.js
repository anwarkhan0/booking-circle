const { render } = require("ejs");
const express = require("express");
const Hotels = require("../models/Hotel");
const Appartments = require("../models/Appartment");
const Users = require("../models/SystemUsers");

const {
  // Login
  login,
  postLogin,
  logout,

  // Dashboard
  indexView,

  // Areas
  addArea,
  listAreas,
  editArea,
  postAddArea,
  postEditArea,
  postDeleteArea,

  // Customers
  customersList,
  viewCustomer,
  editMembership,
  delCustomer,

  // Hotels Clients
  hotelClients,
  hotelList,
  viewHotel,
  editHotel,
  hotelApproved,
  hotelUnapproved,
  addGalleryHotel,
  addHotelImages,
  galleryList,
  viewHotelImages,
  postAddHotel,
  postEditHotel,
  postAddHotelGallery,
  postDeleteGalleryImage,
  postDeleteHotel,

  // Appartments / Houses
  appartmentsHouses,
  appartmentHouseList,
  editAppartmentHouse,
  appartmentList,
  editGalleryAppartments,
  housesList,
  appartmentBookingsList,
  addGallery,
  addGalleryHouses,
  editGalleryHouses,
  postAddAppartment,
  postEditAppartment,
  postAddAppartmentGallery,
  postDeleteAppartmentGalleryImage,
  postDeleteAppartment,
  addHouse,
  editHouse,
  postAddHouse,
  postEditHouse,

  // Rooms
  addRoom,
  roomList,
  editRoom,
  roomBookings,
  addRoomGallery,
  editRoomGallery,
  postAddRoom,
  postEditRoom,
  postAddRoomGallery,
  postDeleteRoomGalleryImage,
  postDeleteRoom,

  // Vehicle Category
  addCategory,
  categoryList,
  editCategory,
  postAddVehicleCategory,
  postEditVehicleCategory,

  // Vehicle
  addVehicle,
  vehicleList,
  vehiclesBookinglist,
  editVehicle,
  addVehicleGallery,
  editVehicleGallery,
  postAddVehicle,
  postEditVehicle,
  postAddVehicleGallery,
  postDeleteVehiclesGalleryImage,
  postDeleteVehicle,

  // Updates / Blog
  addUpdates,
  updateList,
  editBlog,
  deleteBlog,
  postAddUpdate,
  postEditUpdate,
  postDeleteUpdate,

  // Tours Plans & Hiking
  addTour,
  tourList,
  viewTour,
  editTour,
  tourGallery,
  addTourGallery,
  postAddTourGallery,
  postDeleteTourGalleryImage,
  postAddTour,
  postEditTour,
  postDeleteTour,

  // Bundles and Offers
  addBundle,
  bundleList,

  // Slider Images
  addImagesSlider,
  sliderImages,
  postAddSliderImages,
  postDeleteSliderGalleryImage,

  // Customer Feedback
  feedback,
  viewFeedbackQuery,

  // Users
  addUser,
  userList,
  editUser,
  postAddUser,
  postEditUser,
  postDeleteUser,
} = require("../controllers/adminController");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const { body } = require("express-validator");
const Appartment = require("../models/Appartment");

// Login
router.get("/admin/login", login);
router.post(
  "/admin/postLogin",
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
router.get("/logout", logout);

// Dashboard
router.get("/admin", isAuth, indexView);

// Areas
router.get("/admin/Areas/addAreas", isAuth, addArea);
router.get("/admin/Areas/areaList", isAuth, listAreas);
router.get("/admin/Areas/editArea/:id", isAuth, editArea);
router.post(
  "/admin/Areas/addAreas",
  body("areaName", "Please enter valid Location.")
    .notEmpty()
    .custom((val) => {
      console.log(val.trim().length)
      if (val.trim().length === 0) {
        throw new Error();
      }else{
        return true;
      }
    })
    .isLength({ min: 2, max: 200 })
    .trim()
    .escape(),
  isAuth,
  postAddArea
);
router.post(
  "/admin/Areas/editArea/",
  body("areaName", "Please enter valid Location.")
    .notEmpty()
    .custom((val) => {
      console.log(val.trim().length)
      if (val.trim().length === 0) {
        throw new Error();
      }else{
        return true;
      }
    })
    .isLength({ min: 2, max: 200 })
    .trim()
    .escape(),
  isAuth,
  postEditArea
);
router.post("/admin/Areas/deleteArea", isAuth, postDeleteArea);

// Customers
router.get("/admin/Customers/customer", isAuth, customersList);
router.get("/admin/Customers/viewCustomer/:id", isAuth, viewCustomer);
router.get("/admin/Customers/editMembership", isAuth, editMembership);
router.post("/admin/Customers/deleteCustomer", isAuth, delCustomer);

// Hotels Clients
router.get("/admin/Hotels/addHotel", isAuth, hotelClients);
router.get("/admin/Hotels/hotelsList", isAuth, hotelList);
router.get("/admin/Hotels/viewHotel/:id", isAuth, viewHotel);
router.get("/admin/Hotels/editHotel/:id", isAuth, editHotel);
router.get("/admin/Hotels/approvedHotels", isAuth, hotelApproved);
router.get("/admin/Hotels/unapprovedHotels", isAuth, hotelUnapproved);
router.get("/admin/Hotels/addHotelGallery", isAuth, addGalleryHotel);
router.get("/admin/Hotels/addHotelImages", isAuth, addHotelImages);
router.get("/admin/Hotels/galleryList", isAuth, galleryList);
router.get("/admin/Hotels/viewHotelImages/:id", isAuth, viewHotelImages);
router.post(
  "/admin/Hotels/addHotel",
  [
    body("hotelName", "Please enter valid Hotel Name.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .isLength({ min: 3, max: 200 })
      .trim()
      .escape(),
    body("contact", "Please enter valid Hotel contact number.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .isLength({ min: 10, max: 11 })
      .trim(),
    body("parking", "Please enter valid value for parking.").isBoolean(),
    body("area", "Please enter valid Hotel Location.")
      .notEmpty()
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body(
      "roomService",
      "Please enter valid value for room Service."
    ).isBoolean(),
    body("address", "Please enter valid Hotel Address.")
      .notEmpty()
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body("ownerName", "Please enter valid Owner Name.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body("ownerCNIC", "Please enter valid 13-digit CNIC Number.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .isLength({ min: 13, max: 13 })
      .trim(),
    body("ownerContact", "Please enter valid owner contact Number.")
      .notEmpty()
      .isNumeric()
      .isLength({ min: 10, max: 11 })
      .trim(),
    body("loginEmail")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return Hotels.findOne({ loginEmail: value }).then((userHotel) => {
          if (userHotel) {
            return Promise.reject(
              "Hotel associated with E-Mail exists already, please pick a different one."
            );
          }
        });
      })
      .normalizeEmail()
      .toLowerCase(),
    body(
      "loginPassword",
      "Please enter a password with only numbers and text and at least 8 characters."
    )
      .notEmpty()
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
  ],
  isAuth,
  postAddHotel
);

router.post(
  "/admin/Hotels/editHotel/",
  [
    body("hotelName", "Please enter valid Hotel Name.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        }else{
          return true;
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body("contact", "Please enter valid Hotel contact number.")
      .isLength({ min: 10, max: 11 })
      .isNumeric()
      .trim(),
    body("parking", "Please enter valid value for parking.").isBoolean(),
    body("area", "Please enter valid Hotel Location.")
      .notEmpty()
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body(
      "roomServices",
      "Please enter valid value for room Service."
    ).isBoolean(),
    body("address", "Please enter valid Hotel Address.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        }else{
          return true;
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body("ownerName", "Please enter valid Owner Name.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        }else{
          return true;
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body("ownerCNIC", "Please enter valid 13-digit CNIC Number.")
      .isLength({ min: 13, max: 13 })
      .trim(),
    body("ownerContact", "Please enter valid owner contact Number.")
      .isLength({ min: 10, max: 11 })
      .isNumeric()
      .trim(),
    body("loginEmail")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail()
      .toLowerCase(),
    body(
      "loginPassword",
      "Please enter a password with only numbers and text and at least 8 characters."
    )
    .custom(val =>{
      if(val.length> 0){
        return body("loginPassword")
          .notEmpty()
          .isLength({ min: 8 })
          .isAlphanumeric()
          .trim();
      }else{
        return true;
      }
    })
  ],
  isAuth,
  postEditHotel
);
router.post("/admin/Hotels/addHotelGallery", isAuth, postAddHotelGallery);
router.post("/admin/Hotels/DeleteGalleryImage", postDeleteGalleryImage);
router.post("/admin/Hotels/deleteHotel", isAuth, postDeleteHotel);

// Appartments 
router.get("/admin/Appartments/addAppartment", isAuth, appartmentsHouses);
router.get("/admin/Appartments/appartmentHouseList", isAuth, appartmentHouseList);
router.get("/admin/Appartments/editAppartmentHouse/:id", isAuth, editAppartmentHouse);
router.get("/admin/Appartments/addGallery/:id", isAuth, addGallery);
router.get("/admin/Appartments/editGallery/:id", isAuth, editGalleryAppartments);
router.get("/admin/Appartments/appartmentList", isAuth, appartmentList);
router.get("/admin/Appartments/bookings", isAuth, appartmentBookingsList);
router.get("/admin/Appartments/addGalleryHouses", isAuth, addGalleryHouses);
router.get("/admin/Appartments/editGalleryHouses", isAuth, editGalleryHouses);
// post requests routes for appartment
router.post(
  "/admin/Appartments/addAppartment",
  [
    body("appartName", "Please enter valid Appartment Name.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body("price", "Please enter valid price.").isNumeric().trim(),
    body("contact", "Please enter valid Appartment Contact number.")
      .isLength({ min: 10, max: 11 })
      .isNumeric(),
    body("parking", "Please enter valid parking value.").isBoolean(),
    body("area", "Please enter valid location.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .isLength({ min: 2, max: 200 })
      .escape(),
    body("appartType", "Please enter valid appartment type.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .isLength({ min: 2, max: 50 })
      .trim()
      .escape(),
    body("address", "Please enter valid address.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .isLength({ min: 2, max: 300 })
      .trim()
      .escape(),
    body("videoUrl", "Please enter valid URL.")
    .isURL(),
    body("description", "Please enter valid description")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .trim()
      .escape(),
    body("features", "Please enter valid features")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .trim()
      .escape(),
    body("ownerName", "Please enter valid Owner Name.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body("ownerCNIC", "Please enter valid 13-digit CNIC Number.")
      .isLength({ min: 13, max: 13 })
      .trim(),
    body("ownerContact", "Please enter valid owner contact Number.")
      .isLength({ min: 10, max: 11 })
      .isNumeric()
      .trim(),
    body("loginEmail")
      .isEmail()
      .custom((value, { req }) => {
        return Appartments.findOne({ loginEmail: value }).then((appartment) => {
          if (appartment) {
            return Promise.reject(
              "Appartment associated with E-Mail exists already, please pick a different one."
            );
          }
        });
      })
      .withMessage("Please enter a valid email.")
      .normalizeEmail()
      .toLowerCase(),
    body(
      "loginPassword",
      "Please enter a password with only numbers and text and at least 8 characters."
    )
    .isLength({ min: 8 })
    .isAlphanumeric()
    .trim(),
  ],
  isAuth,
  postAddAppartment
);

router.post(
  "/admin/Appartments/editAppartmentHouse",
  [
    body("appartName", "Please enter valid Appartment Name.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body("price", "Please enter valid price.").isNumeric().trim(),
    body("contact", "Please enter valid Appartment Contact number.")
      .isLength({ min: 10, max: 11 })
      .isNumeric(),
    body("parking", "Please enter valid parking value.").isBoolean(),
    body("area", "Please enter valid location.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .isLength({ min: 2, max: 200 })
      .escape(),
    body("appartType", "Please enter valid appartment type.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .isLength({ min: 3, max: 50 })
      .trim()
      .escape(),
    body("address", "Please enter valid address.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .isLength({ min: 2, max: 300 })
      .trim()
      .escape(),
    body("videoUrl", "Please enter valid URL.")
    .isURL(),
    body("description", "Please enter valid description")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .trim()
      .escape(),
    body("features", "Please enter valid features")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .trim()
      .escape(),
    body("ownerName", "Please enter valid Owner Name.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body("ownerCNIC", "Please enter valid 13-digit CNIC Number.")
      .isLength({ min: 13, max: 13 })
      .trim(),
    body("ownerContact", "Please enter valid owner contact Number.")
      .isLength({ min: 10, max: 11 })
      .isNumeric()
      .trim(),
    body("loginEmail")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail()
      .toLowerCase(),
    body(
      "loginPassword",
      "Please enter a password with only numbers and text and at least 8 characters."
    )
    .custom(val =>{
      if(val.length> 0){
        return body("loginPassword")
          .isLength({ min: 8 })
          .isAlphanumeric()
          .trim();
      }else{
        return true;
      }
    }),
  ],
  isAuth,
  postEditAppartment
);
router.post("/admin/Appartments/addGallery", isAuth, postAddAppartmentGallery);
router.post(
  "/admin/Appartments/deleteGalleryImage",
  isAuth,
  postDeleteAppartmentGalleryImage
);
router.post("/admin/Appartments/deleteAppartment", isAuth, postDeleteAppartment);

// Houses
router.get('/admin/Houses/addHouse',isAuth, addHouse);
router.get('/admin/Houses/edit/:id', isAuth, editHouse);
router.get("/admin/Houses/list", isAuth, housesList);
router.post(
  "/admin/Houses/addHouse",
  [
    body("HouseName", "Please enter valid Name.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body("price", "Please enter valid price.").isNumeric().trim(),
    body("contact", "Please enter valid Contact number.")
      .isLength({ min: 10, max: 11 })
      .isNumeric(),
    body("parking", "Please enter valid parking value.").isBoolean(),
    body("area", "Please enter valid location.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .isLength({ min: 2, max: 200 })
      .escape(),
    body("address", "Please enter valid address.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .isLength({ min: 2, max: 300 })
      .trim()
      .escape(),
    body("videoUrl", "Please enter valid URL.")
    .isURL(),
    body("description", "Please enter valid description")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .trim()
      .escape(),
    body("features", "Please enter valid features")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .trim()
      .escape(),
    body("ownerName", "Please enter valid Owner Name.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body("ownerCNIC", "Please enter valid 13-digit CNIC Number.")
      .isLength({ min: 13, max: 13 })
      .trim(),
    body("ownerContact", "Please enter valid owner contact Number.")
      .isLength({ min: 10, max: 11 })
      .isNumeric()
      .trim(),
    body("loginEmail")
      .isEmail()
      .custom((value, { req }) => {
        return Appartments.findOne({ loginEmail: value }).then((appartment) => {
          if (appartment) {
            return Promise.reject(
              "Appartment associated with E-Mail exists already, please pick a different one."
            );
          }
        });
      })
      .withMessage("Please enter a valid email.")
      .normalizeEmail()
      .toLowerCase(),
    body(
      "loginPassword",
      "Please enter a password with only numbers and text and at least 8 characters."
    )
    .isLength({ min: 8 })
    .isAlphanumeric()
    .trim(),
  ],
  isAuth,
  postAddHouse
);
router.post(
  "/admin/Houses/edit",
  [
    body("houseName", "Please enter valid Name.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body("price", "Please enter valid price.").isNumeric().trim(),
    body("contact", "Please enter valid Contact number.")
      .isLength({ min: 10, max: 11 })
      .isNumeric(),
    body("parking", "Please enter valid parking value.").isBoolean(),
    body("area", "Please enter valid location.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .isLength({ min: 2, max: 200 })
      .escape(),
    body("address", "Please enter valid address.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .isLength({ min: 2, max: 300 })
      .trim()
      .escape(),
    body("videoUrl", "Please enter valid URL.")
    .isURL(),
    body("description", "Please enter valid description")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .trim()
      .escape(),
    body("features", "Please enter valid features")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .trim()
      .escape(),
    body("ownerName", "Please enter valid Owner Name.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body("ownerCNIC", "Please enter valid 13-digit CNIC Number.")
      .isLength({ min: 13, max: 13 })
      .trim(),
    body("ownerContact", "Please enter valid owner contact Number.")
      .isLength({ min: 10, max: 11 })
      .isNumeric()
      .trim(),
    body("loginEmail")
      .isEmail()
      .custom((value, { req }) => {
        return Appartments.findOne({ loginEmail: value }).then((appartment) => {
          if (appartment) {
            return Promise.reject(
              "Appartment associated with E-Mail exists already, please pick a different one."
            );
          }
        });
      })
      .withMessage("Please enter a valid email.")
      .normalizeEmail()
      .toLowerCase()
  ],
  isAuth,
  postEditHouse
);

// Rooms
router.get("/admin/Rooms/addRoom", isAuth, addRoom);
router.get("/admin/Rooms/roomList", isAuth, roomList);
router.get('/admin/Rooms/bookings', roomBookings);
router.get("/admin/Rooms/editRoom/:id", isAuth, editRoom);
router.get("/admin/Rooms/addGallery/:id", isAuth, addRoomGallery);
router.get("/admin/Rooms/editGallery/:id", isAuth, editRoomGallery);
//post requests for rooms
router.post(
  "/admin/Rooms/addRoom",
  [
    body("hotel", "invalid hotel input").notEmpty().trim(),
    body("beds", "invalid beds input").isNumeric(),
    body("hotWater", "invalid Hot water input").isBoolean(),
    body("heater", "invalid heater input").isBoolean(),
    body("balcony", "invalid balcony input").isBoolean(),
    body("status", "invalid status input").isBoolean(),
    body("location", "Please enter valid location")
      .notEmpty()
      .custom((val) => {
        if (val.length === 0) {
          return false;
        } else {
          return true;
        }
      })
      .isLength({ min: 3, max: 200 })
      .trim()
      .escape(),
    body("charges", "Please enter valid charges")
      .notEmpty()
      .isLength({ min: 1 })
      .isNumeric()
      .trim(),
    body("roomNo", "Please valid Room No.")
      .isNumeric()
      .isLength({ min: 1 })
      .trim(),
    body("size", "Please enter valid size.")
      .notEmpty()
      .custom((val) => {
        if (val.length === 0) {
          return false;
        } else {
          return true;
        }
      })
      .notEmpty()
      .isLength({ min: 3 })
      .trim()
      .escape(),
    body("occupency", "Please valid occupency.")
      .notEmpty()
      .custom((val) => {
        if (val.length === 0) {
          return false;
        } else {
          return true;
        }
      })
      .isLength({ min: 1 })
      .trim()
      .escape(),
    body("bedSize", "invalid bed Size.").notEmpty(),
    body("videoUrl", "invalid video URL.").isURL(),
    body("description", "Please enter valid description.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length===0) {
          return false;
        } else {
          return true;
        }
      })
      .isLength({ min: 3 })
      .trim()
      .escape(),
    body("features", "Please enter valid description.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length===0) {
          return false;
        } else {
          return true;
        }
      })
      .isLength({ min: 3 })
      .trim()
      .escape(),
  ],
  isAuth,
  postAddRoom
);
router.post("/admin/Rooms/editRoom",
[
  body("hotel", "invalid hotel input").notEmpty().trim(),
  body("beds", "invalid beds input").isNumeric(),
  body("hotWater", "invalid Hot water input").isBoolean(),
  body("heater", "invalid heater input").isBoolean(),
  body("balcony", "invalid balcony input").isBoolean(),
  body("status", "invalid status input").isBoolean(),
  body("location", "Please enter valid location")
    .notEmpty()
    .custom((val) => {
      if (val.length === 0) {
        return false;
      } else {
        return true;
      }
    })
    .isLength({ min: 3, max: 200 })
    .trim()
    .escape(),
  body("charges", "Please enter valid charges")
    .notEmpty()
    .isLength({ min: 1 })
    .isNumeric()
    .trim(),
  body("roomNo", "Please valid Room No.")
    .isNumeric()
    .isLength({ min: 1 })
    .trim(),
  body("size", "Please enter valid size.")
    .notEmpty()
    .custom((val) => {
      if (val.length === 0) {
        return false;
      } else {
        return true;
      }
    })
    .notEmpty()
    .isLength({ min: 3 })
    .trim()
    .escape(),
  body("occupency", "Please valid occupency.")
    .notEmpty()
    .custom((val) => {
      if (val.length === 0) {
        return false;
      } else {
        return true;
      }
    })
    .isLength({ min: 1 })
    .trim()
    .escape(),
  body("bedSize", "invalid bed Size.").notEmpty(),
  body("videoUrl", "invalid video URL.").isURL(),
  body("description", "Please enter valid description.")
    .notEmpty()
    .custom((val) => {
      if (val.trim().length===0) {
        return false;
      } else {
        return true;
      }
    })
    .isLength({ min: 3 })
    .trim()
    .escape(),
  body("features", "Please enter valid description.")
    .notEmpty()
    .custom((val) => {
      if (val.trim().length===0) {
        return false;
      } else {
        return true;
      }
    })
    .isLength({ min: 3 })
    .trim()
    .escape(),
],
isAuth, postEditRoom);
router.post("/admin/Rooms/deleteRoom", isAuth, postDeleteRoom);
router.post("/admin/Rooms/addGallery", isAuth, postAddRoomGallery);
router.post("/admin/Rooms/deleteImage/", isAuth, postDeleteRoomGalleryImage);

// Vehicle Category
router.get("/admin/VehiclesCategory/addCategory", isAuth, addCategory);
router.get("/admin/VehiclesCategory/categoryList", isAuth, categoryList);
router.get("/admin/VehiclesCategory/editCategory/:id", isAuth, editCategory);
router.post(
  "/admin/VehiclesCategory/addCategory",
  body("name", "Please enter valid input")
    .notEmpty()
    .custom((val) => {
      if (val.trim().length === 0) {
        return false;
      } else {
        return true;
      }
    })
    .isLength({ min: 2 })
    .trim()
    .escape(),
  isAuth,
  postAddVehicleCategory
);
router.post(
  "/admin/VehiclesCategory/editCategory",
  body("name", "Please enter valid input")
    .notEmpty()
    .custom((val) => {
      if (val.trim().length === 0) {
        return false;
      } else {
        return true;
      }
    })
    .isLength({ min: 2 })
    .trim()
    .escape(),
  isAuth,
  postEditVehicleCategory
);

// Vehicle
router.get("/admin/Vehicles/addVehicles", isAuth, addVehicle);
router.get("/admin/Vehicles/vehicleList", isAuth, vehicleList);
router.get("/admin/Vehicles/bookings", vehiclesBookinglist);
router.get("/admin/Vehicles/editVehicle/:id", isAuth, editVehicle);
router.get("/admin/Vehicles/addVehicleGallery/:id", isAuth, addVehicleGallery);
router.get("/admin/Vehicles/editVehicleGallery/:id", isAuth, editVehicleGallery);
// post request routes for vehicles
router.post(
"/admin/Vehicles/addVehicle",
[
  body("category", "invalid category")
  .notEmpty()
  .isJSON(),
  body("vehicleNo", "Please enter valid vehicle Number.")
  .notEmpty()
  .isLength({min: 2})
  .trim()
  .escape(),
  body("model", "Please enter valid model.")
  .notEmpty()
  .isLength({min: 2})
  .trim()
  .isNumeric()
  .escape(),
  body("status", "Invalid input status input.")
  .notEmpty()
  .isBoolean(),
  body("seats", "Please enter valid seats value.")
  .notEmpty()
  .isLength({min: 1})
  .trim()
  .isNumeric()
  .escape(),
  body("videoUrl", "Invalid URL.")
  .notEmpty()
  .isURL(),
  body("description", "Please enter valid description.")
  .notEmpty()
  .custom(val =>{
    if(val.trim().length===0){
      return false;
    }else{
      return true;
    }
  })
  .isLength({min: 4})
  .trim()
  .escape(),
  body("features", "Please enter valid features.")
  .notEmpty()
  .custom(val =>{
    if(val.trim().length===0){
      return false;
    }else{
      return true;
    }
  })
  .isLength({min: 4})
  .trim()
  .escape(),
  body("ownerName", "Please enter valid Owner Name.")
  .notEmpty()
  .custom(val =>{
    if(val.trim().length===0){
      return false;
    }else{
      return true;
    }
  })
  .isLength({min: 4})
  .trim()
  .escape(),
  body("ownerCNIC", "Please enter valid 13-digit CNIC Number without dashes.")
    .isLength({ min: 13, max: 13 })
    .trim(),
  body("ownerContact", "Please enter valid owner contact Number.")
    .isLength({ min: 10, max: 11 })
    .trim(),
    body("ownerAddress", "Please enter valid Owner Name.")
    .notEmpty()
    .custom(val =>{
      if(val.trim().length===0){
        return false;
      }else{
        return true;
      }
    })
    .isLength({min: 4})
    .trim()
    .escape(),
],
  isAuth,
  postAddVehicle
);
router.post(
  "/admin/Vehicles/editVehicle",
  [
    body("category", "invalid category")
    .notEmpty()
    .isJSON(),
    body("vehicleNo", "Please enter valid vehicle Number.")
    .notEmpty()
    .isLength({min: 2})
    .trim()
    .escape(),
    body("model", "Please enter valid model.")
    .notEmpty()
    .isLength({min: 2})
    .trim()
    .isNumeric()
    .escape(),
    body("status", "Invalid input status input.")
    .notEmpty()
    .isBoolean(),
    body("seats", "Please enter valid seats value.")
    .notEmpty()
    .isLength({min: 1})
    .trim()
    .isNumeric()
    .escape(),
    body("videoUrl", "Invalid URL.")
    .notEmpty()
    .isURL(),
    body("description", "Please enter valid description.")
    .notEmpty()
    .custom(val =>{
      if(val.trim().length===0){
        return false;
      }else{
        return true;
      }
    })
    .isLength({min: 4})
    .trim()
    .escape(),
    body("features", "Please enter valid features.")
    .notEmpty()
    .custom(val =>{
      if(val.trim().length===0){
        return false;
      }else{
        return true;
      }
    })
    .isLength({min: 4})
    .trim()
    .escape(),
    body("ownerName", "Please enter valid Owner Name.")
    .notEmpty()
    .custom(val =>{
      if(val.trim().length===0){
        return false;
      }else{
        return true;
      }
    })
    .isLength({min: 4})
    .trim()
    .escape(),
    body("ownerCNIC", "Please enter valid 13-digit CNIC Number without dashes.")
      .isLength({ min: 13, max: 13 })
      .trim(),
    body("ownerContact", "Please enter valid owner contact Number.")
      .isLength({ min: 10, max: 11 })
      .trim(),
      body("ownerAddress", "Please enter valid Owner Name.")
      .notEmpty()
      .custom(val =>{
        if(val.trim().length===0){
          return false;
        }else{
          return true;
        }
      })
      .isLength({min: 4})
      .trim()
      .escape(),
  ],
  isAuth,
  postEditVehicle
);
router.post("/admin/Vehicles/addGallery", isAuth, postAddVehicleGallery);
router.post("/admin/Vehicles/deleteImage", isAuth, postDeleteVehiclesGalleryImage);
router.post("/admin/Vehicles/deleteVehicle", isAuth, postDeleteVehicle);

// Updates / Blog
router.get("/admin/Updates/addUpdates", isAuth, addUpdates);
router.get("/admin/Updates/updateList", isAuth, updateList);
router.get("/admin/Updates/editUpdate/:id", isAuth, editBlog);
router.get("/admin/Updates/deleteBlog", isAuth, deleteBlog);
router.post(
  "/admin/Updates/addUpdate",
  [
    body("heading", "Please enter valid heading.")
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
    body("author", "invalid value for author.")
    .notEmpty()
    .custom(val =>{
      if(val.trim().length===0){
        return false;
      }else{
        return true;
      }
    })
    .isLength({min: 2})
    .trim()
    .escape(),
    body("desc", "Please enter description.")
    .notEmpty()
    .custom(val =>{
      if(val.trim().length===0){
        return false;
      }else{
        return true;
      }
    })
    .isLength({min: 2})
  ],
  isAuth,
  postAddUpdate
);
router.post("/admin/Updates/editUpdate",
[
  body("heading", "Please enter valid heading.")
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
  body("author", "invalid value for author.")
  .notEmpty()
  .custom(val =>{
    if(val.trim().length===0){
      return false;
    }else{
      return true;
    }
  })
  .isLength({min: 2})
  .trim()
  .escape(),
  body("desc", "Please enter description.")
  .notEmpty()
  .custom(val =>{
    if(val.trim().length===0){
      return false;
    }else{
      return true;
    }
  })
  .isLength({min: 2})
  .trim(),
],
isAuth, postEditUpdate);
router.post("/admin/Updates/deleteUpdate", isAuth, postDeleteUpdate);

// Tours Plans & Hiking
router.get("/admin/Tours/addTours", isAuth, addTour);
router.get("/admin/Tours/toursList", isAuth, tourList);
router.get("/admin/Tours/addGallery/:id",isAuth, addTourGallery);
router.get("/admin/Tours/viewTour/:id", isAuth, viewTour);
router.get("/admin/Tours/editTour/:id", isAuth, editTour);
router.get("/admin/Tours/gallery/:id",isAuth, tourGallery);
router.post("/admin/Tours/addTourGallery", postAddTourGallery);
router.post("/admin/Tours/deleteTour", isAuth, postDeleteTour);
router.post("/admin/Tours/deleteImage",isAuth, postDeleteTourGalleryImage);

router.post("/admin/Tours/addTours",
[
  body("tourType", "Invalid value for tour/hike.")
  .notEmpty(),
  body("startDate", "invalid start date value.")
  .isDate(),
  body("endDate", "Invalid end date value.")
  .isDate(),
  body("fromPlace", "Invalid entry for from place.")
  .notEmpty()
  .isJSON(),
  body("toPlace", "Invalid entry to place.")
  .notEmpty()
  .isJSON(),
  body("pickupLoc", "Invalid entry for pick up location.")
  .notEmpty()
  .isJSON(),
  body("dropoffLoc", "Invalid entry for drop off location.")
  .notEmpty()
  .isJSON(),
  body("stayHotel", "Invalid entry for stay hotel.")
  .notEmpty()
  .isJSON(),
  body("videoUrl", "Invalid URL.")
  .isURL(),
  body("days", "Invalid entry for days")
  .notEmpty()
  .isNumeric(),
  body("nights", "Invalid entry for nights.")
  .notEmpty()
  .isNumeric(),
  body("seats", "Invalid entry for seats.")
  .notEmpty()
  .isNumeric(),
  body("charges", "Invalid entry for charges.")
  .notEmpty()
  .isNumeric(),
  body("desc", "Please Provide valid description.")
  .notEmpty()
  .custom(val =>{
    if(val.trim().length===0){
      return false;
    }else{
      return true;
    }
  })
  .trim()
  .escape()
],
isAuth, postAddTour);
router.post("/admin/Tours/editTour/", isAuth, postEditTour);

// Bundles and Offers
router.get("/admin/BundleOffers/addBundle", isAuth, addBundle);
router.get("/admin/BundleOffers/bundlesList", isAuth, bundleList);

// Slider Images
router.get("/admin/SliderImages/addSliderImages/:id", isAuth, addImagesSlider);
router.get("/admin/SliderImages/sliderImagesList", isAuth, sliderImages);
router.post("/admin/SliderImages/addImages", isAuth, postAddSliderImages);
router.post("/admin/SliderGallery/deleteImage", isAuth, postDeleteSliderGalleryImage);

// Feedback
router.get("/admin/Feedback/customerFeedback", isAuth, feedback);
router.get("/admin/Feedback/viewFeedbackQuery/:id", isAuth, viewFeedbackQuery);

// Users
router.get("/admin/Users/addUser", isAuth, addUser);
router.get("/admin/Users/usersList", isAuth, userList);
router.get("/admin/Users/editUser/:id", isAuth, editUser);
router.post(
  "/admin/Users/addUser",
  [
    body("name", "Please enter valid user name.")
    .notEmpty()
    .custom(val =>{
      if(val.trim().length===0){
        return false;
      }else{
        return true;
      }
    })
    .trim()
    .escape(),
    body("contact", "Please enter valid contact number.")
    .notEmpty()
    .isLength({min: 10, max: 11})
    .isNumeric()
    .trim(),
    body("cnic", "Please enter valid 13-digit number without dashes.")
    .notEmpty()
    .isLength({min: 13, max: 13})
    .trim(),
    body("gender", "Invalid value for gender.")
    .notEmpty()
    .trim(),
    body("location", "Invalid value for location.")
    .notEmpty()
    .isJSON(),
    body("address", "Please enter valid address.")
    .notEmpty()
    .custom(val =>{
      if(val.trim().length===0){
        return false;
      }else{
        return true;
      }
    })
    .isLength({min: 1, max: 300})
    .trim(),
    body("type", "Invalid value for user type.")
    .notEmpty(),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return Users.findOne({ loginEmail: value }).then((user) => {
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
    body("contact", "Please enter valid contact number.")
      .isLength({ min: 10, max: 11 })
      .trim(),
    body("cnic", "Please enter valid 13-digit CNIC Number.")
      .isLength({ min: 13, max: 13 })
      .trim(),
  ],
  isAuth,
  postAddUser
);
router.post(
  "/admin/Users/editUser",
  [
    body("name", "Please enter valid user name.")
    .notEmpty()
    .custom(val =>{
      if(val.trim().length===0){
        return false;
      }else{
        return true;
      }
    })
    .trim()
    .escape(),
    body("contact", "Please enter valid contact number.")
    .notEmpty()
    .isLength({min: 10, max: 11})
    .isNumeric()
    .trim(),
    body("cnic", "Please enter valid 13-digit number without dashes.")
    .notEmpty()
    .isLength({min: 13, max: 13})
    .trim(),
    body("gender", "Invalid value for gender.")
    .notEmpty()
    .trim(),
    body("location", "Invalid value for location.")
    .notEmpty()
    .isJSON(),
    body("address", "Please enter valid address.")
    .notEmpty()
    .custom(val =>{
      if(val.trim().length===0){
        return false;
      }else{
        return true;
      }
    })
    .isLength({min: 1, max: 300})
    .trim(),
    body("type", "Invalid value for user type.")
    .notEmpty(),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      // .custom((value, { req }) => {
      //   return Hotels.findOne({ loginEmail: value }).then((userHotel) => {
      //     if (userHotel) {
      //       return Promise.reject(
      //         "E-Mail exists already, please pick a different one."
      //       );
      //     }
      //   });
      // })
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 8 characters."
    )
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
    body("contact", "Please enter valid contact number.")
      .isLength({ min: 10, max: 11 })
      .trim(),
    body("cnic", "Please enter valid 13-digit CNIC Number.")
      .isLength({ min: 13, max: 13 })
      .trim(),
  ],
  isAuth,
  postEditUser
);
router.post("/admin/Users/deleteUser", isAuth, postDeleteUser);

module.exports = {
  routes: router,
};
