const { render } = require('ejs')
const express = require('express')
const Hotels = require('../models/Hotel')
const Appartments = require('../models/Appartment')
const Users = require('../models/SystemUsers')

const {
  addArea,
  listAreas,
  editArea,
  postAddArea,
  postEditArea,
  postDeleteArea,
} = require('../controllers/admin/Areas')

const {
  hotelClients,
  hotelList,
  viewHotel,
  editHotel,
  hotelApproved,
  hotelUnapproved,
  addGalleryHotel,
  addHotelImages,
  hotelBookings,
  addRoomImages,
  galleryList,
  viewHotelImages,
  viewRoomImages,
  postAddHotel,
  postEditHotel,
  postAddHotelGallery,
  postUpdateHotelGallery,
  postAddRoomGallery,
  postUpdateRoomGallery,
  postDeleteGalleryImage,
  postDeleteRoomGalleryImage,
  postDeleteHotel,
} = require('../controllers/admin/Hotels')

const {
  appartmentsHouses,
  editAppartmentHouse,
  appartmentList,
  editGalleryAppartments,
  appartmentBookingsList,
  addGallery,
  addGalleryHouses,
  editGalleryHouses,
  postAddAppartment,
  postEditAppartment,
  postAddAppartmentGallery,
  postDeleteAppartmentGalleryImage,
  postDeleteAppartment,
} = require('../controllers/admin/Appartments')

const {
  addHouse,
  editHouse,
  houseBookings,
  housesGallery,
  addHouseGallery,
  postAddHouse,
  postEditHouse,
  postAddHouseGallery,
  postDeleteHouse,
  postDeleteHouseGalleryImage,
  housesList,
  updateHouseGallery,
} = require('../controllers/admin/Houses.js')

const {
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
} = require('../controllers/admin/Vehicles')

const {
  addUpdates,
  updateList,
  editBlog,
  deleteBlog,
  postAddUpdate,
  postEditUpdate,
  postDeleteUpdate,
} = require('../controllers/admin/Updates')

const {
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
} = require('../controllers/admin/Tours')

const {
  // Login
  login,
  postLogin,
  logout,

  // Dashboard
  indexView,

  // Customers
  customersList,
  viewCustomer,
  editMembership,
  delCustomer,

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

  //Messages
  msgList,
  viewMessage,

  // Users
  addUser,
  userList,
  editUser,
  postAddUser,
  postEditUser,
  postDeleteUser,
} = require('../controllers/admin/Users')
const router = express.Router()
const isAuth = require('../middleware/isAuth')
const { body } = require('express-validator')
const Appartment = require('../models/Appartment')

// Login
router.get('/admin/login', login)
router.post(
  '/admin/postLogin',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail()
      .trim(),
    body('password', 'Password has to be valid.').trim(),
  ],
  postLogin
)
router.get('/logout', logout)

// Dashboard
router.get('/admin', isAuth, indexView)

// Areas
router.get('/admin/Areas/addAreas', isAuth, addArea)
router.get('/admin/Areas/areaList', isAuth, listAreas)
router.get('/admin/Areas/editArea/:id', isAuth, editArea)
router.post(
  '/admin/Areas/addAreas',
  body('areaName', 'Please enter valid Location.')
    .notEmpty()
    .custom(val => {
      console.log(val.trim().length)
      if (val.trim().length === 0) {
        throw new Error()
      } else {
        return true
      }
    })
    .isLength({ min: 2, max: 200 })
    .trim()
    .escape(),
  isAuth,
  postAddArea
)
router.post(
  '/admin/Areas/editArea/',
  body('areaName', 'Please enter valid Location.')
    .notEmpty()
    .custom(val => {
      console.log(val.trim().length)
      if (val.trim().length === 0) {
        throw new Error()
      } else {
        return true
      }
    })
    .isLength({ min: 2, max: 200 })
    .trim()
    .escape(),
  isAuth,
  postEditArea
)
router.post('/admin/Areas/deleteArea', isAuth, postDeleteArea)

// Customers
router.get('/admin/Customers/customer', isAuth, customersList)
router.get('/admin/Customers/viewCustomer/:id', isAuth, viewCustomer)
router.get('/admin/Customers/editMembership', isAuth, editMembership)
router.post('/admin/Customers/deleteCustomer', isAuth, delCustomer)

// Hotels Clients
router.get('/admin/Hotels/addHotel', isAuth, hotelClients)
router.get('/admin/Hotels/hotelsList', isAuth, hotelList)
router.get('/admin/Hotels/Bookings', isAuth, hotelBookings)
router.get('/admin/Hotels/viewHotel/:id', isAuth, viewHotel)
router.get('/admin/Hotels/editHotel/:id', isAuth, editHotel)
router.get('/admin/Hotels/Galleries', isAuth, galleryList)
router.get('/admin/Hotels/addHotelGallery', isAuth, addHotelImages)
router.get('/admin/Hotels/addRoomsGallery', isAuth, addRoomImages)
router.get('/admin/Hotels/viewHotelImages/:id', isAuth, viewHotelImages)
router.get('/admin/Hotels/roomGallery/:id', isAuth, viewRoomImages)

router.post(
  '/admin/Hotels/addHotel',
  [
    body('name', 'Please enter valid Hotel Name.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 3, max: 200 })
      .trim(),
    body('contact', 'Please enter valid Hotel contact number.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 10, max: 11 })
      .trim(),
    body('area', 'Please enter valid Hotel Location.')
      .notEmpty()
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body('address', 'Please enter valid Hotel Address.')
      .notEmpty()
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body('ownerName', 'Please enter valid Owner Name.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body('ownerCNIC', 'Please enter valid 13-digit CNIC Number.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 13, max: 13 })
      .trim(),
    body('ownerContact', 'Please enter valid owner contact Number.')
      .notEmpty()
      .isNumeric()
      .isLength({ min: 10, max: 11 })
      .trim(),
    body('loginEmail')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return Hotels.findOne({ owner: { email: value } }).then(userHotel => {
          if (userHotel) {
            return Promise.reject(
              'Hotel associated with E-Mail already exists.'
            )
          }
        })
      })
      .normalizeEmail()
      .toLowerCase(),
    body(
      'loginPassword',
      'Please enter a password with only numbers and text and at least 8 characters.'
    )
      .notEmpty()
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
  ],
  isAuth,
  postAddHotel
)

router.post(
  '/admin/Hotels/editHotel',
  [
    body('name', 'Please enter valid Hotel Name.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body('contact', 'Please enter valid Hotel contact number.')
      .isLength({ min: 10, max: 11 })
      .isNumeric()
      .trim(),
    body('area', 'Please enter valid Hotel Location.')
      .notEmpty()
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body('address', 'Please enter valid Hotel Address.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body('ownerName', 'Please enter valid Owner Name.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body('ownerCNIC', 'Please enter valid 13-digit CNIC Number.')
      .isLength({ min: 13, max: 13 })
      .trim(),
    body('ownerContact', 'Please enter valid owner contact Number.')
      .isLength({ min: 10, max: 11 })
      .isNumeric()
      .trim(),
    body('loginEmail')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail()
      .toLowerCase(),
    body(
      'loginPassword',
      'Please enter a password with only numbers and text and at least 8 characters.'
    )
      .custom(val => {
        if (val.length > 0) {
          return body('loginPassword')
            .notEmpty()
            .isLength({ min: 8 })
            .isAlphanumeric()
            .trim()
        } else {
          return true
        }
      })
      .trim(),
  ],
  isAuth,
  postEditHotel
)
router.post('/admin/Hotels/addHotelGallery', isAuth, postAddHotelGallery)
router.post('/admin/Hotels/addRoomsGallery', isAuth, postAddRoomGallery)
router.post('/admin/Hotels/updateGallery', isAuth, postUpdateHotelGallery)
router.post('/admin/Hotels/Rooms/updateGallery', isAuth, postUpdateRoomGallery)
router.post('/admin/Hotels/DeleteGalleryImage', isAuth, postDeleteGalleryImage)
router.post(
  '/admin/Hotels/Rooms/DeleteGalleryImage',
  isAuth,
  postDeleteRoomGalleryImage
)
router.post('/admin/Hotels/deleteHotel', isAuth, postDeleteHotel)

// Appartments
router.get('/admin/Appartments/addAppartment', isAuth, appartmentsHouses)
router.get(
  '/admin/Appartments/editAppartmentHouse/:id',
  isAuth,
  editAppartmentHouse
)
router.get('/admin/Appartments/addGallery/:id', isAuth, addGallery)
router.get('/admin/Appartments/editGallery/:id', isAuth, editGalleryAppartments)
router.get('/admin/Appartments/appartmentList', isAuth, appartmentList)
router.get('/admin/Appartments/bookings', isAuth, appartmentBookingsList)
router.get('/admin/Appartments/addGalleryHouses', isAuth, addGalleryHouses)
router.get('/admin/Appartments/editGalleryHouses', isAuth, editGalleryHouses)
// post requests routes for appartment
router.post(
  '/admin/Appartments/addAppartment',
  [
    body('appartName', 'Please enter valid Appartment Name.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body('charges', 'Please enter valid charges value.').isNumeric().trim(),
    body('contact', 'Please enter valid Appartment Contact number.')
      .isLength({ min: 10, max: 11 })
      .isNumeric(),
    body('area', 'Please enter valid location.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 2, max: 200 })
      .escape(),
    body('address', 'Please enter valid address.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 2, max: 300 })
      .trim()
      .escape(),
    body('videoUrl', 'Please enter valid URL.').isURL(),
    body('description', 'Please enter valid description')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .trim()
      .escape(),
    body('features', 'Please enter valid features')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .trim()
      .escape(),
    body('ownerName', 'Please enter valid Owner Name.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body('ownerCNIC', 'Please enter valid 13-digit CNIC Number.')
      .isLength({ min: 13, max: 13 })
      .trim(),
    body('ownerContact', 'Please enter valid owner contact Number.')
      .isLength({ min: 10, max: 11 })
      .isNumeric()
      .trim(),
    body('loginEmail')
      .isEmail()
      .custom((value, { req }) => {
        return Appartments.findOne({ loginEmail: value }).then(appartment => {
          if (appartment) {
            return Promise.reject(
              'Appartment associated with E-Mail exists already, please pick a different one.'
            )
          }
        })
      })
      .withMessage('Please enter a valid email.')
      .normalizeEmail()
      .toLowerCase(),
    body(
      'loginPassword',
      'Please enter a password with only numbers and text and at least 8 characters.'
    )
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
  ],
  isAuth,
  postAddAppartment
)

router.post(
  '/admin/Appartments/editAppartmentHouse',
  [
    body('appartName', 'Please enter valid Appartment Name.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body('charges', 'Please enter valid charges value.').isNumeric().trim(),
    body('contact', 'Please enter valid Appartment Contact number.')
      .isLength({ min: 10, max: 11 })
      .isNumeric(),
    body('area', 'Please enter valid location.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 2, max: 200 })
      .escape(),
    body('address', 'Please enter valid address.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 2, max: 300 })
      .trim()
      .escape(),
    body('videoUrl', 'Please enter valid URL.').isURL(),
    body('description', 'Please enter valid description')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .trim()
      .escape(),
    body('features', 'Please enter valid features')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .trim()
      .escape(),
    body('ownerName', 'Please enter valid Owner Name.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body('ownerCNIC', 'Please enter valid 13-digit CNIC Number.')
      .isLength({ min: 13, max: 13 })
      .trim(),
    body('ownerContact', 'Please enter valid owner contact Number.')
      .isLength({ min: 10, max: 11 })
      .isNumeric()
      .trim(),
    body('loginEmail')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail()
      .toLowerCase(),
  ],
  isAuth,
  postEditAppartment
)
router.post('/admin/Appartments/addGallery', isAuth, postAddAppartmentGallery)
router.post(
  '/admin/Appartments/deleteGalleryImage',
  isAuth,
  postDeleteAppartmentGalleryImage
)
router.post('/admin/Appartments/deleteAppartment', isAuth, postDeleteAppartment)

// Houses
router.get('/admin/Houses/addHouse', isAuth, addHouse)
router.get('/admin/Houses/edit/:id', isAuth, editHouse)
router.get('/admin/Houses/bookings', houseBookings)
router.get('/admin/Houses/addGallery/:id', isAuth, addHouseGallery)
router.get('/admin/Houses/list', isAuth, housesList)
router.get('/admin/houses/gallery/:id', isAuth, housesGallery)
router.post(
  '/admin/Houses/addHouse',
  [
    body('HouseName', 'Please enter valid Name.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body('price', 'Please enter valid price.').isNumeric().trim(),
    body('contact', 'Please enter valid Contact number.')
      .isLength({ min: 10, max: 11 })
      .isNumeric(),
    body('parking', 'Please enter valid parking value.').isBoolean(),
    body('area', 'Please enter valid location.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 2, max: 200 })
      .escape(),
    body('address', 'Please enter valid address.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 2, max: 300 })
      .trim()
      .escape(),
    body('videoUrl', 'Please enter valid URL.').isURL(),
    body('description', 'Please enter valid description')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .trim()
      .escape(),
    body('features', 'Please enter valid features')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .trim()
      .escape(),
    body('ownerName', 'Please enter valid Owner Name.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body('ownerCNIC', 'Please enter valid 13-digit CNIC Number.')
      .isLength({ min: 13, max: 13 })
      .trim(),
    body('ownerContact', 'Please enter valid owner contact Number.')
      .isLength({ min: 10, max: 11 })
      .isNumeric()
      .trim(),
    body('loginEmail')
      .isEmail()
      .custom((value, { req }) => {
        return Appartments.findOne({ loginEmail: value }).then(appartment => {
          if (appartment) {
            return Promise.reject(
              'Appartment associated with E-Mail exists already, please pick a different one.'
            )
          }
        })
      })
      .withMessage('Please enter a valid email.')
      .normalizeEmail()
      .toLowerCase(),
    body(
      'loginPassword',
      'Please enter a password with only numbers and text and at least 8 characters.'
    )
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
  ],
  isAuth,
  postAddHouse
)
router.post(
  '/admin/Houses/edit',
  [
    body('houseName', 'Please enter valid Name.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body('price', 'Please enter valid price.').isNumeric().trim(),
    body('contact', 'Please enter valid Contact number.')
      .isLength({ min: 10, max: 11 })
      .isNumeric(),
    body('parking', 'Please enter valid parking value.').isBoolean(),
    body('area', 'Please enter valid location.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 2, max: 200 })
      .escape(),
    body('address', 'Please enter valid address.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 2, max: 300 })
      .trim()
      .escape(),
    body('videoUrl', 'Please enter valid URL.').isURL(),
    body('description', 'Please enter valid description')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .trim()
      .escape(),
    body('features', 'Please enter valid features')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .trim()
      .escape(),
    body('ownerName', 'Please enter valid Owner Name.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          throw new Error()
        } else {
          return true
        }
      })
      .isLength({ min: 2, max: 200 })
      .trim()
      .escape(),
    body('ownerCNIC', 'Please enter valid 13-digit CNIC Number.')
      .isLength({ min: 13, max: 13 })
      .trim(),
    body('ownerContact', 'Please enter valid owner contact Number.')
      .isLength({ min: 10, max: 11 })
      .isNumeric()
      .trim(),
    body('loginEmail')
      .isEmail()
      .custom((value, { req }) => {
        return Appartments.findOne({ loginEmail: value }).then(appartment => {
          if (appartment) {
            return Promise.reject(
              'Appartment associated with E-Mail exists already, please pick a different one.'
            )
          }
        })
      })
      .withMessage('Please enter a valid email.')
      .normalizeEmail()
      .toLowerCase(),
  ],
  isAuth,
  postEditHouse
)
router.post('/admin/Houses/addGallery', isAuth, postAddHouseGallery)
router.post('/admin/Houses/updateGallery', isAuth, updateHouseGallery)
router.post('/admin/houses/deleteHouse', isAuth, postDeleteHouse)
router.post(
  '/admin/houses/DeleteGalleryImage',
  isAuth,
  postDeleteHouseGalleryImage
)

// Vehicle Category
router.get('/admin/VehiclesCategory/addCategory', isAuth, addCategory)
router.get('/admin/VehiclesCategory/categoryList', isAuth, categoryList)
router.get('/admin/VehiclesCategory/editCategory/:id', isAuth, editCategory)
router.post(
  '/admin/VehiclesCategory/addCategory',
  body('name', 'Please enter valid input')
    .notEmpty()
    .custom(val => {
      if (val.trim().length === 0) {
        return false
      } else {
        return true
      }
    })
    .isLength({ min: 2 })
    .trim()
    .escape(),
  isAuth,
  postAddVehicleCategory
)
router.post(
  '/admin/VehiclesCategory/editCategory',
  body('name', 'Please enter valid input')
    .notEmpty()
    .custom(val => {
      if (val.trim().length === 0) {
        return false
      } else {
        return true
      }
    })
    .isLength({ min: 2 })
    .trim()
    .escape(),
  isAuth,
  postEditVehicleCategory
)

// Vehicle
router.get('/admin/Vehicles/addVehicles', isAuth, addVehicle)
router.get('/admin/Vehicles/vehicleList', isAuth, vehicleList)
router.get('/admin/Vehicles/bookings', vehiclesBookinglist)
router.get('/admin/Vehicles/editVehicle/:id', isAuth, editVehicle)
router.get('/admin/Vehicles/addVehicleGallery/:id', isAuth, addVehicleGallery)
router.get('/admin/Vehicles/editVehicleGallery/:id', isAuth, editVehicleGallery)
// post request routes for vehicles
router.post(
  '/admin/Vehicles/addVehicle',
  [
    body('category', 'invalid category').notEmpty().isJSON(),
    body('vehicleNo', 'Please enter valid vehicle Number.')
      .notEmpty()
      .isLength({ min: 2 })
      .trim()
      .escape(),
    body('model', 'Please enter valid model.')
      .notEmpty()
      .isLength({ min: 2 })
      .trim()
      .isNumeric()
      .escape(),
    body('seats', 'Please enter valid seats value.')
      .notEmpty()
      .isLength({ min: 1 })
      .trim()
      .isNumeric()
      .escape(),
    body('serviceArea', 'Please enter valid Service area.')
      .notEmpty()
      .isLength({ min: 2 })
      .trim()
      .escape(),
    body('videoUrl', 'Invalid URL.').notEmpty().isURL(),
    body('description', 'Please enter valid description.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          return false
        } else {
          return true
        }
      })
      .isLength({ min: 4 })
      .trim()
      .escape(),
    body('features', 'Please enter valid features.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          return false
        } else {
          return true
        }
      })
      .isLength({ min: 4 })
      .trim()
      .escape(),
    body('ownerName', 'Please enter valid Owner Name.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          return false
        } else {
          return true
        }
      })
      .isLength({ min: 4 })
      .trim()
      .escape(),
    body('ownerCNIC', 'Please enter valid 13-digit CNIC Number without dashes.')
      .isLength({ min: 13, max: 13 })
      .trim(),
    body('ownerContact', 'Please enter valid owner contact Number.')
      .isLength({ min: 10, max: 11 })
      .trim(),
    body('ownerAddress', 'Please enter valid Owner Name.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          return false
        } else {
          return true
        }
      })
      .isLength({ min: 4 })
      .trim()
      .escape(),
  ],
  isAuth,
  postAddVehicle
)
router.post(
  '/admin/Vehicles/editVehicle',
  [
    body('category', 'invalid category').notEmpty().isJSON(),
    body('vehicleNo', 'Please enter valid vehicle Number.')
      .notEmpty()
      .isLength({ min: 2 })
      .trim()
      .escape(),
    body('model', 'Please enter valid model.')
      .notEmpty()
      .isLength({ min: 2 })
      .trim()
      .isNumeric()
      .escape(),
    body('seats', 'Please enter valid seats value.')
      .notEmpty()
      .isLength({ min: 1 })
      .trim()
      .isNumeric()
      .escape(),
    body('videoUrl', 'Invalid URL.').notEmpty().isURL(),
    body('description', 'Please enter valid description.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          return false
        } else {
          return true
        }
      })
      .isLength({ min: 4 })
      .trim()
      .escape(),
    body('features', 'Please enter valid features.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          return false
        } else {
          return true
        }
      })
      .isLength({ min: 4 })
      .trim()
      .escape(),
    body('ownerName', 'Please enter valid Owner Name.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          return false
        } else {
          return true
        }
      })
      .isLength({ min: 4 })
      .trim()
      .escape(),
    body('ownerCNIC', 'Please enter valid 13-digit CNIC Number without dashes.')
      .isLength({ min: 13, max: 13 })
      .trim(),
    body('ownerContact', 'Please enter valid owner contact Number.')
      .isLength({ min: 10, max: 11 })
      .trim(),
    body('ownerAddress', 'Please enter valid Owner Name.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          return false
        } else {
          return true
        }
      })
      .isLength({ min: 4 })
      .trim()
      .escape(),
  ],
  isAuth,
  postEditVehicle
)
router.post('/admin/Vehicles/addGallery', isAuth, postAddVehicleGallery)
router.post(
  '/admin/Vehicles/deleteImage',
  isAuth,
  postDeleteVehiclesGalleryImage
)
router.post('/admin/Vehicles/deleteVehicle', isAuth, postDeleteVehicle)

// Updates / Blog
router.get('/admin/Updates/addUpdates', isAuth, addUpdates)
router.get('/admin/Updates/updateList', isAuth, updateList)
router.get('/admin/Updates/editUpdate/:id', isAuth, editBlog)
router.get('/admin/Updates/deleteBlog', isAuth, deleteBlog)
router.post(
  '/admin/Updates/addUpdate',
  [
    body('heading', 'Please enter valid heading.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          return false
        } else {
          return true
        }
      })
      .trim()
      .escape(),
    body('author', 'invalid value for author.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          return false
        } else {
          return true
        }
      })
      .isLength({ min: 2 })
      .trim()
      .escape(),
    body('desc', 'Please enter description.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          return false
        } else {
          return true
        }
      })
      .isLength({ min: 2 }),
  ],
  isAuth,
  postAddUpdate
)
router.post(
  '/admin/Updates/editUpdate',
  [
    body('heading', 'Please enter valid heading.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          return false
        } else {
          return true
        }
      })
      .trim()
      .escape(),
    body('author', 'invalid value for author.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          return false
        } else {
          return true
        }
      })
      .isLength({ min: 2 })
      .trim()
      .escape(),
    body('desc', 'Please enter description.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          return false
        } else {
          return true
        }
      })
      .isLength({ min: 2 })
      .trim(),
  ],
  isAuth,
  postEditUpdate
)
router.post('/admin/Updates/deleteUpdate', isAuth, postDeleteUpdate)

// Tours Plans & Hiking
router.get('/admin/Tours/addTours', isAuth, addTour)
router.get('/admin/Tours/toursList', isAuth, tourList)
router.get('/admin/Tours/addGallery/:id', isAuth, addTourGallery)
router.get('/admin/Tours/viewTour/:id', isAuth, viewTour)
router.get('/admin/Tours/editTour/:id', isAuth, editTour)
router.get('/admin/Tours/gallery/:id', isAuth, tourGallery)
router.post('/admin/Tours/addTourGallery', postAddTourGallery)
router.post('/admin/Tours/deleteTour', isAuth, postDeleteTour)
router.post('/admin/Tours/deleteImage', isAuth, postDeleteTourGalleryImage)

router.post(
  '/admin/Tours/addTours',
  [
    body('tourType', 'Invalid value for tour/hike.').notEmpty(),
    body('startDate', 'invalid start date value.').isDate(),
    body('endDate', 'Invalid end date value.').isDate(),
    body('fromPlace', 'Invalid entry for from place.').notEmpty().isJSON(),
    body('toPlace', 'Invalid entry to place.').notEmpty().isJSON(),
    body('pickupLoc', 'Invalid entry for pick up location.')
      .notEmpty()
      .isJSON(),
    body('dropoffLoc', 'Invalid entry for drop off location.')
      .notEmpty()
      .isJSON(),
    body('stayHotel', 'Invalid entry for stay hotel.').notEmpty().isJSON(),
    body('videoUrl', 'Invalid URL.').isURL(),
    body('days', 'Invalid entry for days').notEmpty().isNumeric(),
    body('nights', 'Invalid entry for nights.').notEmpty().isNumeric(),
    body('seats', 'Invalid entry for seats.').notEmpty().isNumeric(),
    body('charges', 'Invalid entry for charges.').notEmpty().isNumeric(),
    body('desc', 'Please Provide valid description.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          return false
        } else {
          return true
        }
      })
      .trim()
      .escape(),
  ],
  isAuth,
  postAddTour
)
router.post('/admin/Tours/editTour/', isAuth, postEditTour)

// Bundles and Offers
router.get('/admin/BundleOffers/addBundle', isAuth, addBundle)
router.get('/admin/BundleOffers/bundlesList', isAuth, bundleList)

// Slider Images
router.get('/admin/SliderImages/addSliderImages/:id', isAuth, addImagesSlider)
router.get('/admin/SliderImages/sliderImagesList', isAuth, sliderImages)
router.post('/admin/SliderImages/addImages', isAuth, postAddSliderImages)
router.post(
  '/admin/SliderGallery/deleteImage',
  isAuth,
  postDeleteSliderGalleryImage
)

// Feedback
router.get('/admin/Feedback/customerFeedback', isAuth, feedback)
router.get('/admin/Feedback/viewFeedbackQuery/:id', isAuth, viewFeedbackQuery)
router.post('/admin/Feedback/publish', async (req, res) => {
  const Feedbacks = require('../models/Feedback')

  const feedback = await Feedbacks.findById(req.body.feedbackId)
  if (req.body.publish == 'on') {
    feedback.publish = true
  } else {
    feedback.publish = false
  }
  feedback.save()
  res.render('../Admin/views/pages/Feedback/viewFeedbackQuery', {
    feedback: feedback,
  })
})

//Messages
router.get('/admin/Messages', isAuth, msgList)
router.get('/admin/Messages/viewMessage/:id', isAuth, viewMessage)

// Users
router.get('/admin/Users/addUser', isAuth, addUser)
router.get('/admin/Users/usersList', isAuth, userList)
router.get('/admin/Users/editUser/:id', isAuth, editUser)
router.post(
  '/admin/Users/addUser',
  [
    body('name', 'Please enter valid user name.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          return false
        } else {
          return true
        }
      })
      .trim()
      .escape(),
    body('contact', 'Please enter valid contact number.')
      .notEmpty()
      .isLength({ min: 10, max: 11 })
      .isNumeric()
      .trim(),
    body('cnic', 'Please enter valid 13-digit number without dashes.')
      .notEmpty()
      .isLength({ min: 13, max: 13 })
      .trim(),
    body('city', 'Invalid value for city.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          return false
        } else {
          return true
        }
      })
      .isLength({ min: 1, max: 300 })
      .trim(),
    body('address', 'Please enter valid address.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          return false
        } else {
          return true
        }
      })
      .isLength({ min: 1, max: 300 })
      .trim(),
    body('access', 'Invalid value for user type.').notEmpty(),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return Users.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            )
          }
        })
      })
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 8 characters.'
    )
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
    body('cnfmPassword', 'Passwords must match.').custom((val, { req }) => {
      if (val == req.body.password) {
        return true
      } else {
        return false
      }
    }),
    // matchedData(req, { locations: ['body'] })
    body('contact', 'Please enter valid contact number.')
      .isLength({ min: 10, max: 11 })
      .trim(),
    body('cnic', 'Please enter valid 13-digit CNIC Number.')
      .isLength({ min: 13, max: 13 })
      .trim(),
  ],
  isAuth,
  postAddUser
)
router.post(
  '/admin/Users/editUser',
  [
    body('name', 'Please enter valid user name.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          return false
        } else {
          return true
        }
      })
      .trim()
      .escape(),
    body('contact', 'Please enter valid contact number.')
      .notEmpty()
      .isLength({ min: 10, max: 11 })
      .isNumeric()
      .trim(),
    body('cnic', 'Please enter valid 13-digit number without dashes.')
      .notEmpty()
      .isLength({ min: 13, max: 13 })
      .trim(),
    body('city', 'Invalid value for city.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          return false
        } else {
          return true
        }
      })
      .isLength({ min: 1, max: 300 })
      .trim(),
    body('address', 'Please enter valid address.')
      .notEmpty()
      .custom(val => {
        if (val.trim().length === 0) {
          return false
        } else {
          return true
        }
      })
      .isLength({ min: 1, max: 300 })
      .trim(),
    body('access', 'Invalid value for user type.').notEmpty(),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
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
      'password',
      'Please enter a password with only numbers and text and at least 8 characters.'
    )
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
    body('cnfmPassword', 'Passwords must match.').custom((val, { req }) => {
      if (val == req.body.cnfmPassword) {
        return true
      } else {
        return false
      }
    }),
    body('contact', 'Please enter valid contact number.')
      .isLength({ min: 10, max: 11 })
      .trim(),
    body('cnic', 'Please enter valid 13-digit CNIC Number.')
      .isLength({ min: 13, max: 13 })
      .trim(),
  ],
  isAuth,
  postEditUser
)
router.post('/admin/Users/deleteUser', isAuth, postDeleteUser)

module.exports = {
  routes: router,
}
