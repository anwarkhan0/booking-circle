const bcrypt = require("bcrypt");
const { validationResult, check } = require("express-validator");
const Safepay = require("safepay");

const HomeModel = require("../models/homeModel");
const AreasModel = require("../Admin/models/Location");
const AppartmentModel = require("../Admin/models/Appartment");
const HotelsModel = require("../Admin/models/Hotel");
const VehiclesModel = require("../Admin/models/Vehicles");
const ToursModel = require("../Admin/models/Tour");
const NewsModel = require("../Admin/models/Updates");
const UsersModel = require("../models/usersModel");
const FeedbackModel = require("../Admin/models/Feedback");
const { json } = require("express");

// HomePage
const home = async (req, res, next) => {
  const areas = await HomeModel.fetchAreas();
  res.render("./pages/HomePage/home", {
    loggedIn: req.session.userLoggedIn,
    areas: areas,
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
    areas: areas,
    appartments: appartments,
  });
};
const apartmentBooking = async (req, res, next) => {
  const appartId = req.params.id;
  const appartment = await AppartmentModel.findById(appartId);

  res.render("./pages/Appartments/apartmentBooking", {
    loggedIn: req.session.userLoggedIn,
    appartment: appartment,
  });
};

const searchAppartments = async (req, res, next) => {
  const location = req.params.location;
  const appartments = await AppartmentModel.find({ area: location });
  res.render("./pages/Appartments/searchResult", {
    loggedIn: req.session.userLoggedIn,
    appartments: appartments,
  });
};

const findAppartments = async (req, res, next) => {
  let checkIn = req.query.checkIn.replace(/\./g, "/");
  // let checkOut = req.query.checkOut.replace(/\./g, "/");
  const location = req.query.area;
  const adults = req.query.adults;

  const queryParams = {};
  if (location) {
    queryParams.area = location;
  }

  //areas
  const areas = await AreasModel.find();
  //hotels
  const appartments = await AppartmentModel.find(queryParams);

  let filteredAppartments = [];
  if (checkIn && adults != "false") {
    console.log('checkin and adults')

    for (let i = 0; i < appartments.length; i++) {
      let availibilityFlag = false;
      //convert the date to iso format for comparison
      checkIn = new Date(checkIn);
      let reservations = appartments[i].reservations;

      //if hotels Rooms have no reservations
      if (reservations.length === 0) {
        filteredAppartments.push(appartments[i]);
        continue;
      }

      for (let k = 0; k < reservations.length; k++) {
        //if checkIn remains greater than checkout for all reservations then the appartment is available
        if (checkIn > reservations[k].checkOut) {
          availibilityFlag = true;
        } else {
          availibilityFlag = false;
        }
      }

      if (availibilityFlag) {
        filteredAppartments.push(appartments[i]);
      }
    }

  } else if (checkIn) {
    console.log('just checkin')

    for (let i = 0; i < appartments.length; i++) {
      let availibilityFlag = false;
      //convert the date to iso format for comparison
      checkIn = new Date(checkIn);

      let reservations = appartments[i].reservations;

      //if hotels Rooms have no reservations
      if (reservations.length === 0) {
        filteredAppartments.push(appartments[i]);
        continue;
      }

      for (let k = 0; k < reservations.length; k++) {
        //if checkIn remains greater than checkout for all reservations then the room is available
        if (checkIn > reservations[k].checkOut) {
          availibilityFlag = true;
        } else {
          availibilityFlag = false;
        }
      }

      if (availibilityFlag) {
        filteredAppartments.push(appartments[i]);
      }
    }

  } else if (adults != "false") {
    console.log('just adults')

    for (let i = 0; i < appartments.length; i++) {
      let availibilityFlag = true;
      // if (adults <= appartments[i].occupency) {
      //   availibilityFlag = true;
      // }

      if (availibilityFlag) {
        filteredAppartments.push(appartments[i]);
      }
    }

  }else{

    filteredAppartments = [...appartments];

  }

  res.render("./pages/Appartments/allappartments", {
    loggedIn: req.session.userLoggedIn,
    areas: areas,
    appartments: filteredAppartments,
  });

};

const postAppartmentBooking = async (req, res, next) => {
  const appartmentId = req.body.appartmentId;
  const checkIn = req.body.checkIn.replace(/\./g, "/");;
  const checkOut = req.body.checkOut.replace(/\./g, "/");;
  const adults = req.body.adults;
  const children = req.body.children;

  try {
    const appartment = await AppartmentModel.findById(appartmentId);
    appartment.reservations.push({
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
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

const appartmentGallery = (req, res, next) =>
  res.render("./pages/Appartments/appartmentGallery", {
    loggedIn: req.session.userLoggedIn,
  });

// hotels
const hotels = async (req, res, next) => {
  //areas
  const areas = await AreasModel.find();
  //hotels
  const hotels = await HotelsModel.find();
  res.render("./pages/Hotels/hotels", {
    loggedIn: req.session.userLoggedIn,
    hotels: hotels,
    areas: areas,
  });
};

const searchHotels = async (req, res, next) => {
  const location = req.params.location;
  const hotels = await HotelsModel.find({ area: location });
  res.render("./pages/Hotels/searchResult", {
    loggedIn: req.session.userLoggedIn,
    hotels: hotels,
  });
};

const findHotels = async (req, res, next) => {
  let checkIn = req.query.checkIn.replace(/\./g, "/");
  // let checkOut = req.query.checkOut.replace(/\./g, "/");
  const location = req.query.area;
  const adults = req.query.adults;

  const queryParams = {};
  if (location) {
    queryParams.area = location;
  }

  //areas
  const areas = await AreasModel.find();
  //hotels
  const hotels = await HotelsModel.find(queryParams);

  let filteredHotels = [];
  if (checkIn && adults != "false") {
    console.log('checkin and adults')

    for (let i = 0; i < hotels.length; i++) {
      let availibilityFlag = false;
      //convert the date to iso format for comparison
      checkIn = new Date(checkIn);
      for (let j = 0; j < hotels[i].rooms.length; j++) {
        let reservations = hotels[i].rooms[j].reservations;

        //if hotels Rooms have no reservations
        if (reservations.length === 0) {
          filteredHotels.push(hotels[i]);
          continue;
        }

        for (let k = 0; k < reservations.length; k++) {
          //if checkIn remains greater than checkout for all reservations then the room is available
          if (
            checkIn > reservations[k].checkOut &&
            adults <= hotels[i].rooms[j].occupency
          ) {
            availibilityFlag = true;
          } else {
            availibilityFlag = false;
          }
        }
      }

      if (availibilityFlag) {
        filteredHotels.push(hotels[i]);
      }
    }

  } else if (checkIn) {
    console.log('just checkin')

    for (let i = 0; i < hotels.length; i++) {

      let availibilityFlag = false;
      //convert the date to iso format for comparison
      checkIn = new Date(checkIn);
      for (let j = 0; j < hotels[i].rooms.length; j++) {
        let reservations = hotels[i].rooms[j].reservations;

        //if hotels Rooms have no reservations
        if (reservations.length === 0) {
          filteredHotels.push(hotels[i]);
          continue;
        }

        for (let k = 0; k < reservations.length; k++) {
          //if checkIn remains greater than checkout for all reservations then the room is available
          if (checkIn > reservations[k].checkOut) {
            availibilityFlag = true;
          } else {
            availibilityFlag = false;
          }
        }
      }

      if (availibilityFlag) {
        filteredHotels.push(hotels[i]);
      }

    }

  } else if (adults != "false") {
    console.log('just adults')

    for (let i = 0; i < hotels.length; i++) {

      let availibilityFlag = false;
      for (let j = 0; j < hotels[i].rooms.length; j++) {
        if (adults <= hotels[i].rooms[j].occupency) {
          availibilityFlag = true;
        }
      }
      if (availibilityFlag) {
        filteredHotels.push(hotels[i]);
      }
    }

  }else{

    filteredHotels = [...hotels];

  }

  res.render("./pages/Hotels/hotels", {
    loggedIn: req.session.userLoggedIn,
    hotels: filteredHotels,
    areas: areas,
  });

};

const hotelGallery = async (req, res, next) => {
  const hotelId = req.params.id;
  const hotel = await HotelsModel.findById(hotelId);
  res.render("./pages/Hotels/hotelGallery", {
    loggedIn: req.session.userLoggedIn,
    hotel: hotel,
  });
};
const hotelRooms = async (req, res, next) => {
  const hotelId = req.params.id;
  const hotel = await HotelsModel.findById(hotelId);
  const rooms = hotel.rooms;

  res.render("./pages/Hotels/hotelRooms", {
    loggedIn: req.session.userLoggedIn,
    hotelId: hotel.id,
    rooms: rooms,
  });
};

// vehicles
const vehicles = async (req, res, next) => {
  //areas
  const areas = await AreasModel.find();
  //vehicles
  const vehicles = await VehiclesModel.find();
  res.render("./pages/Vehicles/vehicles", {
    loggedIn: req.session.userLoggedIn,
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
    areas: areas,
    vehicle: vehicle,
  });
};

const searchVehicles = async (req, res, next) => {
  const location = req.params.location;
  const vehicles = await VehiclesModel.find();
  res.render("./pages/Vehicles/searchResult", {
    loggedIn: req.session.userLoggedIn,
    vehicles: vehicles,
  });
};

const findVehicles = async (req, res, next) => {
  const location = req.query.area;
  const adults = req.query.adults;

  const queryParams = {};
  if(location && adults != 'false'){
    queryParams.area = location;
    queryParams.seats = adults;
  }else if (location) {
    queryParams.area = location;
  }else if(adults != 'false'){
    queryParams.seats = adults;
  }

  //areas
  const areas = await AreasModel.find();
  //hotels
  const vehicles = await VehiclesModel.find(queryParams);

  res.render("./pages/Vehicles/vehicles", {
    loggedIn: req.session.userLoggedIn,
    areas: areas,
    vehicles: vehicles,
  });

};

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

const galleryAppRoom = (req, res, next) =>
  res.render("./pages/Appartments/galleryAppRoom", {
    loggedIn: req.session.userLoggedIn,
  });

const roomBooking = async (req, res, next) => {
  const hotelId = req.params.hotelId;
  const roomIndex = req.query.i;

  const hotel = await HotelsModel.findById(hotelId);
  const room = hotel.rooms[roomIndex];
  res.render("./pages/Hotels/roomBooking", {
    loggedIn: req.session.userLoggedIn,
    hotelId: hotelId,
    room: room,
  });
};

const postRoomBooking = async (req, res, next) => {
  const hotelId = req.body.hotelId;
  const roomId = req.body.roomId;
  const checkIn = req.body.checkIn.replace(/\./g, "/");
  const checkOut = req.body.checkOut.replace(/\./g, "/");
  const adults = req.body.adults;
  const children = req.body.children;

  const hotel = await HotelsModel.findById(hotelId);
  for (let i = 0; i < hotel.rooms.length; i++) {
    if (hotel.rooms[i].id === roomId) {
      hotel.rooms[i].reservations.push({
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        adults: adults,
        children: children,
      });
    }
  }
  try {
    await hotel.save();
    console.log("room booked");
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

// Tours
const tours = async (req, res, next) => {
  const areas = await AreasModel.find();
  const data = await ToursModel.find();
  let tours = [];
  let hikes = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].tourType === "tour") {
      tours.push(data[i]);
    } else {
      hikes.push(data[i]);
    }
  }
  res.render("./pages/Tours/tours", {
    loggedIn: req.session.userLoggedIn,
    areas: areas,
    tours: tours,
    hikes: hikes,
  });
};

const searchTour = async (req, res, next) => {
  const location = req.params.location;
  const tours = await ToursModel.find({ toPlace: location });
  res.render("./pages/Tours/searchResult", {
    loggedIn: req.session.userLoggedIn,
    tours: tours,
  });
};

const hike = (req, res, next) => res.render("./pages/Tours/hike");
const booking = async (req, res, next) => {
  const id = req.params.id;
  const tour = await ToursModel.findById(id);
  res.render("./pages/Tours/booking", {
    loggedIn: req.session.userLoggedIn,
    tour: tour,
  });
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

const gallerytandh = (req, res, next) =>
  res.render("./pages/Tours/gallerytandh", {
    loggedIn: req.session.userLoggedIn,
  });

// News
const news = async (req, res, next) => {
  const news = await NewsModel.find();
  res.render("./pages/News/news", {
    loggedIn: req.session.userLoggedIn,
    news: news,
  });
};
const exploreNews = async (req, res, next) => {
  const id = req.params.id;
  try {
    const post = await NewsModel.findById(id);
    res.render("./pages/News/exploreNews", {
      loggedIn: req.session.userLoggedIn,
      post: post,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

// About Us
const about = (req, res, next) =>
  res.render("./pages/About/about", { loggedIn: req.session.userLoggedIn });

// Contact
const contact = (req, res, next) => {
  res.render("./pages/Contact/contact", { loggedIn: req.session.userLoggedIn });
};

const postFeedback = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  try {
    const feedback = new FeedbackModel({
      name: name,
      email: email,
      message: message,
    });
    await feedback.save();
    console.log("feedback added");
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

// User
const login = (req, res, next) => {
  const message = req.flash("message");
  res.render("./pages/User/login", {
    loggedIn: req.session.userLoggedIn,
    flashMessage: message,
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
    flashMessage: "",
    oldInput: {
      name: "",
      phoneNo: "",
      email: "",
      password: "",
    },
  });
};
const verification = (req, res, next) =>
  res.render("./pages/User/verification", {
    loggedIn: req.session.userLoggedIn,
  });
const forgotPassword = (req, res, next) =>
  res.render("./pages/User/forgotPassword", {
    loggedIn: req.session.userLoggedIn,
    flashMessage: '',
    email: ''
  });

const sendMail = async (req, res, next) => {

  const userEmail = req.body.email;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render("./pages/User/forgotPassword", {
      loggedIn: req.session.userLoggedIn,
      flashMessage: errors.errors[0].msg,
      email: userEmail
    });
  }else{
    const nodemailer = require("nodemailer");

    const user = await UsersModel.findOne({email: userEmail});
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
        res.redirect('/User/forgotPassword')
      } else {
        console.log("Email sent: " + info.response);
        res.redirect('/user/mailSent')
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

const passwordReset = async (req, res, next) =>{
  const id = req.query.u;
  try {
    res.render("./pages/User/passwordReset", {
      userId: id,
      loggedIn: req.session.userLoggedIn,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/User/forgotPassword");
  }
  
}

//post request for password reset
const resetPassword = async (req, res, next)=>{
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
    console.log('password reset succesffully');
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/User/forgotPassword");
  }
}
 

//postLogin
const postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("../views/pages/User/login", {
      loggedIn: req.session.userLoggedIn,
      flashMessage: errors.errors[0].msg,
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
              res.redirect("/");
            });
          }

          res.status(422).render("../views/pages/User/login", {
            loggedIn: req.session.userLoggedIn,
            flashMessage: "invalid Password.",
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
        flashMessage: "invalid Email.",
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

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("../views/pages/User/signup", {
      loggedIn: req.session.userLoggedIn,
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
    res.redirect("/User/login");
  } catch (err) {
    console.log(err);
  }
};

// Terms And Conditions
const termsAndCondition = (req, res, next) =>
  res.render("./pages/TermsConditions/termsAndCondition", {
    loggedIn: req.session.userLoggedIn,
  });

// FAQ's
const faqs = (req, res, next) =>
  res.render("./pages/FAQs/faqs", { loggedIn: req.session.userLoggedIn });

const payment = (req, res, next)=>{
  res.render('./pages/Payment/checkout', {layout: false, loggedIn: req.session.userLoggedIn});
}

const safepayPayment = async (req, res) => {
  // const amount = req.body.amount;
  
  const config = {
    environment: "sandbox",
    sandbox: {
      baseUrl: "https://sandbox.api.getsafepay.com",
      apiKey: process.env.SAFEPAY_API_KEY,
      apiSecret: process.env.SAFEPAY_SECRET_KEY,
    }
    // production: {
    //   baseUrl: "https://api.getsafepay.com",
    //   apiKey: process.env.API_KEY,
    //   apiSecret: process.env.API_SECRET,
    // },
  };

  let sfpy = new Safepay(config);

  console.log(sfpy)

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
      console.log(data)
      return sfpy.checkout.create({
        tracker: data.data.token,
        orderId: "1234",
        source: "custom",
        cancelUrl: `${process.env.BASE_URL}/cancel`,
        redirectUrl: `${process.env.BASE_URL}/paymentComplete`,
      });
    })
    .then((url) => {
      console.log(url);
      res.redirect(url);
    })
    .catch((error) => {
      console.error(error);
      res.redirect('/')
    });

};

const stripePayment = async (req, res) => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  const product = await stripe.products.create({ name: "Service" });
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: 2000,
    currency: "usd",
  });

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

    cancel_url: `${process.env.BASE_URL}/`,
  });

  res.redirect(303, session.url);
};

const paymentSuccess = (req, res, next)=>{
  res.render('./pages/Payment/success',  {layout: false, loggedIn: req.session.userLoggedIn});
}

const paymentCancel = (req, res, next)=>{
  res.render('./pages/Payment/cancel',  {layout: false, loggedIn: req.session.userLoggedIn});
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
  postFeedback,

  // User
  login,
  signup,
  verification,
  forgotPassword,
  passwordReset,
  postSignUp,
  postLogin,
  logout,
  sendMail,
  resetPassword,

  // Terms And Conditions
  termsAndCondition,

  // FAQ's
  faqs,

  //payment
  payment,
  safepayPayment,
  stripePayment,
  paymentSuccess,
  paymentCancel
};
