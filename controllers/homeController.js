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
const Feedback = require("../models/Feedback");

// HomePage
const home = async (req, res, next) => {
  const areas = await HomeModel.fetchAreas();
  let sliderGall = await sliderGallery.findOne();
  if(!sliderGall){
    sliderGall = {
      images: []
    }
  }

  const hotels = await HotelsModel.find();
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

  const feedbacks = await Feedbacks.find({publish: true});

  res.render("./pages/HomePage/home", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    sliderGallery: sliderGall,
    areas: areas,
    hotels: ourHotelsIn,
    appartments: ourtAppartmentsIn,
    tours: ourToursIn,
    vehicles: ourVehiclesIn,
    feedbacks: feedbacks
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



// Tours

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
  // const unescape = require('unescape');
  const id = req.params.id;
  try {
    const post = await NewsModel.findById(id);
    // const description = unescape(post.description);
    res.render("./pages/News/exploreNews", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      title: post.heading,
      author: post.author,
      description: post.description,
      thumbnail: post.media
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
    const message = new MessageModel({
      name: name,
      email: email,
      message: message,
    });
    await message.save();
    console.log("message added");
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(204);
  }
};

const postFeedback = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.feedback;

  try {
    const feedback = new Feedback({
      name: name,
      email: email,
      feedback: message,
    });
    await feedback.save();
    console.log("message added");
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(204);
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
    if(err) console.log(err);
    console.log('user loggout')
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
  const ejs = require('ejs');
  try {
    res.render("./pages/User/passwordReset", {
      userId: id,
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      ejs: ejs
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

  try {
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
    const msg = "Your otp is: " + otp;

    await fetch(
      `https://outreach.pk/api/sendsms.php/sendsms/url?id=rchbookingring&pass=booking1122&mask=bookingring&to=${phoneNumber}&lang=English&msg=${msg}&type=json`
    );

    // generate salt to hash password
    const salt = await bcrypt.genSalt(16);
    // now we set user password to hashed password
    const hashedPassword = await bcrypt.hash(password, salt);

    // const nodemailer = require("nodemailer");
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: "jacksparrow0340@gmail.com",
    //     pass: "",
    //   },
    // });

    // const mailOptions = {
    //   from: process.env.EMAIL,
    //   to: email,
    //   subject: "Email Confirmation",
    //   html: `<p><a href="https://fathomless-castle-70650.herokuapp.com/">click</a>here to verify your email account.</p>`,
    // };

    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     throw error;
    //   }
    // });

    req.session.userRegistration = {
      name: name,
      phoneNo: phoneNumber,
      email: email,
      password: hashedPassword,
      otp: otp,
    };
    res.render("./pages/User/otp", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      num: phoneNumber,
    });
  } catch (err) {
    console.log(err);
    return res.status(422).render("../views/pages/User/signup", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      flashMessage: "Oops! Something went wrong try again.",
      oldInput: {
        name: name,
        phoneNo: contact,
        email: email,
        password: password,
        cnfmPassword: cnfmPassword,
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

  try {
    const hotels = await HotelsModel.find();
    const filteredHotels = hotels.filter((hotel) => {
      let flag = false;
      hotel.rooms.forEach((room) => {
        room.reservations.forEach((reservation) => {
          String(reservation.user._id) === String(req.session.user._id)
            ? (flag = true)
            : "";
        });
      });
      return flag;
    });

    const appartments = await AppartmentModel.find();
    const filteredAppartments = appartments.filter((appartment) => {
      let flag = false;
      appartment.reservations.forEach((reservation) => {
        String(reservation.user._id) === String(req.session.user._id)
          ? (flag = true)
          : "";
      });
      return flag;
    });

    const vehicles = await VehiclesModel.find();
    const filteredVehicles = vehicles.filter((vehicle) => {
      let flag = false;
      vehicle.reservations.forEach((reservation) => {
        String(reservation.user._id) === String(req.session.user._id)
          ? (flag = true)
          : "";
      });
      return flag;
    });

    const tours = await ToursModel.find();
    const filteredTours = tours.filter((tour) => {
      let flag = false;
      tour.reservations.forEach((reservation) => {
        String(reservation.user._id) === String(req.session.user._id)
          ? (flag = true)
          : "";
      });
      return flag;
    });

    res.render("./pages/User/bookings", {
      loggedIn: true,
      user: req.session.user,
      filteredHotels: filteredHotels,
      filteredAppartments: filteredAppartments,
      filteredVehicles: filteredVehicles,
      filteredTours: filteredTours,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
  
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


const paymentCancel = (req, res, next) => {
  res.render("./pages/Payment/cancel", {
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


module.exports = {
  // HomePage
  home,
  galleryAppRoom,

  // News
  news,
  exploreNews,

  // About
  about,

  // Contact
  contact,
  postMessage,
  postFeedback,

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
  paymentCancel,
  paymentError,
  jazzCashResponse,

};
