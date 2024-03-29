const { delImg } = require("../../util/file");
const fs = require('fs');
const path = require('path');
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const moment = require('moment');

//models
const Areas = require("../../models/Location");
const Hotels = require("../../models/Hotel");

// add hotel view
const hotelClients = (req, res, next) => {
  Areas.find()
    .then((areas) => {
      res.render("../Admin/views/pages/Hotels/addHotel", {
        user: req.session.user,
        areas: areas,
        pageTitle: "add hotel",
        path: "/Hotels/add-hotel",
        oldInput: {
          name: "",
          contact: "",
          parking: "",
          area: "",
          roomService: "",
          wifi: "",
          hotWater: "",
          address: "",
          ownerName: "",
          ownerCNIC: "",
          ownerContact: "",
          loginEmail: "",
          loginPassword: "",
          single: {
            total: "",
            charges: "",
            videoUrl: "",
            size: "",
            occupancy: "",
            bedSize: "",
            description: "",
            features: "",
          },
          twin: {
            total: "",
            charges: "",
            videoUrl: "",
            size: "",
            occupancy: "",
            bed1Size: "",
            bed2Size: "",
            description: "",
            features: "",
          },
          triple: {
            total: "",
            charges: "",
            videoUrl: "",
            size: "",
            occupancy: "",
            bed1Size: "",
            bed2Size: "",
            bed3Size: "",
            description: "",
            features: "",
          },
          quad: {
            total: "",
            charges: "",
            videoUrl: "",
            size: "",
            view: "",
            occupancy: "",
            bed1Size: "",
            bed2Size: "",
            bed3Size: "",
            bed4Size: "",
            description: "",
            features: "",
          },
          quin: {
            total: '',
            charges: '',
            size: '',
            view: '',
            occupancy: '',
            bed1Size: '',
            bed2Size: '',
            bed3Size: '',
            bed4Size: '',
            bed5Size: ''
          }
        },
        flashMessage: req.flash("message"),
      });
    })
    .catch((err) => console.log(err));
};

const hotelList = (req, res, next) => {
  Hotels.find()
    .then((hotels) => {
      res.render("../Admin/views/pages/Hotels/hotelsList", {
        user: req.session.user,
        hotels: hotels,
        pageTitle: "Hotels List",
        path: "/Hotels/hotels-list",
        flashMessage: req.flash("message"),
      });
    })
    .catch((err) => console.log(err));
};

const viewHotel = (req, res, next) => {
  const hotelId = req.params.id;
  Hotels.findById(hotelId)
    .then((hotel) => {
      res.render("../Admin/views/pages/Hotels/viewHotel", {
        user: req.session.user,
        user: req.session.user,
        hotel: hotel,
        pageTitle: "Hotels List",
        path: "/Hotels/hotel-view",
      });
    })
    .catch((err) => console.log(err));
};

const editHotel = async (req, res, next) => {
  const hotelId = req.params.id;
  try {
    const hotel = await Hotels.findById(hotelId);
    if (!hotel) {
      req.flash("message", "Could not find the Hotel");
      return res.redirect("/");
    }
    const areas = await Areas.find();

    res.render("../Admin/views/pages/Hotels/editHotel", {
      user: req.session.user,
      user: req.session.user,
      pageTitle: "Edit Tour",
      path: "/admin/Hotels/editHotel",
      areas: areas,
      hotel: hotel,
      flashMessage: req.flash("message"),
    });
  } catch (err) {
    console.log(err);
  }
};

const hotelBookings = async (req, res, next) => {
  const hotels = await Hotels.find();
  let allBookings;
  hotels.forEach(hotel => {
    allBookings = [...hotel.rooms.single.reservations, ...hotel.rooms.twin.reservations, ...hotel.rooms.triple.reservations, ...hotel.rooms.quad.reservations, ...hotel.rooms.quin.reservations];
  })

  const seen = {};
  // bookings after removing duplicates
  const bookings = allBookings.filter(booking => {
    if (seen.hasOwnProperty(booking.date)) {
      return false
    } else {
      seen[booking.date] = booking;
      return true;
    }
  })

  res.render("../Admin/views/pages/Hotels/bookings", {
    user: req.session.user,
    user: req.session.user,
    user: req.session.user,
    reservations: bookings,
    moment: moment,
    pageTitle: "Hotels Reservations",
    path: "/Hotels/hotels-reservations",
  });
}

const hotelApproved = (req, res, next) => {
  Hotels.find({ approvedStatus: true })
    .then((hotels) => {
      if (!hotels) {
        redirect("/");
      }
      res.render("../Admin/views/pages/Hotels/approvedHotels", {
        user: req.session.user,
        user: req.session.user,
        hotels: hotels,
        pageTitle: "Approved Hotels",
        path: "/Hotels/approved-hotels",
      });
    })
    .catch((err) => console.log(err));
};

const hotelUnapproved = (req, res, next) => {
  Hotels.find({ approvedStatus: false })
    .then((hotels) => {
      if (!hotels) {
        redirect("/");
      }
      res.render("../Admin/views/pages/Hotels/unapprovedHotels", {
        user: req.session.user,
        user: req.session.user,
        hotels: hotels,
        pageTitle: "Approved Hotels",
        path: "/Hotels/approved-hotels",
      });
    })
    .catch((err) => console.log(err));
};

const addGalleryHotel = (req, res, next) => {
  Hotels.find()
    .then((hotels) => {
      if (!hotels) {
        res.redirect("/");
      }
      res.render("../Admin/views/pages/Hotels/addHotelGallery", {
        user: req.session.user,
        user: req.session.user,
        hotels: hotels,
        pageTitle: "Add Gallery",
        path: "/Hotels/add-gallery",
      });
    })
    .catch((err) => console.log(err));
};

const addHotelImages = (req, res, next) => {
  const hotelId = req.query.hotelId;
  res.render("../Admin/views/pages/Hotels/addImages", {
    user: req.session.user,
    user: req.session.user,
    title: "Selet Hotel Pictures",
    url: "/admin/Hotels/addHotelGallery",
    hotelId: hotelId,
  });
};

const addRoomImages = (req, res, next) => {
  const hotelId = req.query.hotelId;
  res.render("../Admin/views/pages/Hotels/addImages", {
    user: req.session.user,
    user: req.session.user,
    title: "Selet Room Pictures",
    url: "/admin/Hotels/addRoomsGallery",
    hotelId: hotelId,
  });
};

const galleryList = (req, res, next) => {
  Hotels.find()
    .then((hotels) => {
      if (!hotels) {
        res.redirect("/");
      }
      res.render("../Admin/views/pages/Hotels/galleryList", {
        user: req.session.user,
        user: req.session.user,
        hotels: hotels,
        pageTitle: "Gallery List",
        path: "/Hotels/gallery-list",
      });
    })
    .catch((err) => console.log(err));
};

const viewHotelImages = (req, res, next) => {
  const hotelId = req.params.id;
  Hotels.findById(hotelId)
    .then((hotel) => {
      if (!hotel) {
        res.redirect("/");
      }
      res.render("../Admin/views/pages/Hotels/viewHotelImages", {
        user: req.session.user,
        user: req.session.user,
        hotelId: hotel.id,
        hotel: hotel.name,
        gallery: hotel.gallery,
        pageTitle: "Gallery List",
        path: "/Hotels/gallery-list",
        flashMessage: req.flash("message"),
      });
    })
    .catch((err) => console.log(err));
};

const viewRoomImages = (req, res, next) => {
  const hotelId = req.params.id;
  Hotels.findById(hotelId)
    .then((hotel) => {
      if (!hotel) {
        res.redirect("/");
      }
      res.render("../Admin/views/pages/Hotels/roomGalleryView", {
        user: req.session.user,
        user: req.session.user,
        hotelId: hotel.id,
        hotel: hotel.name,
        gallery: hotel.rooms.gallery,
        pageTitle: "Gallery List",
        path: "/Hotels/gallery-list",
        flashMessage: req.flash("message"),
      });
    })
    .catch((err) => console.log(err));
};

//Hotel post Requests
const postAddHotel = async (req, res, next) => {
  //Hotel Details
  const name = req.body.name;
  const contact = req.body.contact;
  const address = req.body.address;
  const videoUrl = req.body.videoUrl;
  const location = req.body.area;
  const stars = Number(req.body.stars);
  const hotWater = req.body.hotWater ? true : false;
  const heater = req.body.heater ? true : false;
  const wifi = req.body.wifi ? true : false;
  const roomService = req.body.roomService ? true : false;
  const parking = req.body.parking ? true : false;

  const description = req.body.description;
  const features = req.body.features;

  // Rooms Details
  const singleRooms = req.body.singleRmNo ? Number(req.body.singleRmNo) : "";
  const singleRmCharges = req.body.singleRmCharges
    ? Number(req.body.singleRmCharges)
    : "";
  const singleRmSize = req.body.singleRmSize ? req.body.singleRmSize : "";
  const singleRmOccupancy = req.body.singleRmOccupancy
    ? Number(req.body.singleRmOccupancy)
    : "";
  const singleRmBedSize = req.body.singleRmBedSize ? req.body.singleRmBedSize : "";

  const twinRooms = req.body.twinRmNo ? Number(req.body.twinRmNo) : "";
  const twinRmCharges = req.body.twinRmCharges
    ? Number(req.body.twinRmCharges)
    : "";
  const twinRmSize = req.body.twinRmSize ? req.body.twinRmSize : "";
  const twinRmOccupancy = req.body.twinRmOccupancy
    ? Number(req.body.twinRmOccupancy)
    : "";
  const twinRmBed1Size = req.body.twinRmBed1Size ? req.body.twinRmBed1Size : "";
  const twinRmBed2Size = req.body.twinRmBed2Size ? req.body.twinRmBed2Size : "";

  const tripleRooms = req.body.tripleRmNo ? Number(req.body.tripleRmNo) : "";
  const tripleRmCharges = req.body.tripleRmCharges
    ? Number(req.body.tripleRmCharges)
    : "";
  const tripleRmSize = req.body.tripleRmSize ? req.body.tripleRmSize : "";
  const tripleRmOccupancy = req.body.tripleRmOccupancy
    ? Number(req.body.tripleRmOccupancy)
    : "";
  const tripleRmBed1Size = req.body.tripleRmBed1Size
    ? req.body.tripleRmBed1Size
    : "";
  const tripleRmBed2Size = req.body.tripleRmBed2Size
    ? req.body.tripleRmBed2Size
    : "";
  const tripleRmBed3Size = req.body.tripleRmBed3Size
    ? req.body.tripleRmBed3Size
    : "";

  const quadRooms = req.body.quadRmNo ? Number(req.body.quadRmNo) : "";
  const quadRmCharges = req.body.quadRmCharges
    ? Number(req.body.quadRmCharges)
    : "";
  const quadRmSize = req.body.quadRmSize ? req.body.quadRmSize : "";
  const quadRmOccupancy = req.body.quadRmOccupancy
    ? Number(req.body.quadRmOccupancy)
    : "";
  const quadRmBed1Size = req.body.quadRmBed1Size ? req.body.quadRmBed1Size : "";
  const quadRmBed2Size = req.body.quadRmBed2Size ? req.body.quadRmBed2Size : "";
  const quadRmBed3Size = req.body.quadRmBed3Size ? req.body.quadRmBed3Size : "";
  const quadRmBed4Size = req.body.quadRmBed4Size ? req.body.quadRmBed4Size : "";

  const quinRooms = req.body.quinRmNo ? Number(req.body.quinRmNo) : "";
  const quinRmCharges = req.body.quinRmCharges
    ? Number(req.body.quinRmCharges)
    : "";
  const quinRmSize = req.body.quinRmSize ? req.body.quinRmSize : "";
  const quinRmOccupancy = req.body.quinRmOccupancy
    ? Number(req.body.quinRmOccupancy)
    : "";
  const quinRmBed1Size = req.body.quinRmBed1Size ? req.body.quinRmBed1Size : "";
  const quinRmBed2Size = req.body.quinRmBed2Size ? req.body.quinRmBed2Size : "";
  const quinRmBed3Size = req.body.quinRmBed3Size ? req.body.quinRmBed3Size : "";
  const quinRmBed4Size = req.body.quinRmBed4Size ? req.body.quinRmBed4Size : "";
  const quinRmBed5Size = req.body.quinRmBed5Size ? req.body.quinRmBed5Size : "";

  // owner info
  const ownerName = req.body.ownerName;
  const ownerCNIC = req.body.ownerCNIC;
  const ownerContact = req.body.ownerContact;
  const loginEmail = req.body.loginEmail;
  const loginPassword = req.body.loginPassword;

  // generate salt to hash password
  const salt = await bcrypt.genSalt(16);
  // now we set user password to hashed password
  const hashedPassword = await bcrypt.hash(loginPassword, salt);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const areas = await Areas.find();
    return res.status(422).render("../Admin/views/pages/Hotels/addHotel", {
      user: req.session.user,
      path: "/Hotesl/addHotel",
      pageTitle: "Hotel",
      areas: areas,
      flashMessage: errors.array()[0].msg,
      oldInput: {
        name: name,
        contact: contact,
        parking: parking,
        hotWater: hotWater,
        heater: heater,
        wifi: wifi,
        location: location,
        roomService: roomService,
        address: address,
        videoUrl: videoUrl,
        ownerName: ownerName,
        ownerCNIC: ownerCNIC,
        ownerContact: ownerContact,
        loginEmail: loginEmail,
        loginPassword: loginPassword,
        description: description,
        features: features,
        single: {
          total: singleRooms,
          charges: singleRmCharges,
          size: singleRmSize,
          occupancy: singleRmOccupancy,
          bedSize: singleRmBedSize
        },
        twin: {
          total: twinRooms,
          charges: twinRmCharges,
          size: twinRmSize,
          occupancy: twinRmOccupancy,
          bed1Size: twinRmBed1Size,
          bed2Size: twinRmBed2Size
        },
        triple: {
          total: tripleRooms,
          charges: tripleRmCharges,
          size: tripleRmSize,
          occupancy: tripleRmOccupancy,
          bed1Size: tripleRmBed1Size,
          bed2Size: tripleRmBed2Size,
          bed3Size: tripleRmBed3Size
        },
        quad: {
          total: quadRooms,
          charges: quadRmCharges,
          size: quadRmSize,
          occupancy: quadRmOccupancy,
          bed1Size: quadRmBed1Size,
          bed2Size: quadRmBed2Size,
          bed3Size: quadRmBed3Size,
          bed4Size: quadRmBed4Size
        },
        quin: {
          total: quinRooms,
          charges: quinRmCharges,
          size: quinRmSize,
          occupancy: quinRmOccupancy,
          bed1Size: quinRmBed1Size,
          bed2Size: quinRmBed2Size,
          bed3Size: quinRmBed3Size,
          bed4Size: quinRmBed4Size,
          bed5Size: quinRmBed5Size
        }
      },
      validationErrors: errors.array(),
    });
  }

  const hotel = new Hotels({
    name: name,
    contact: contact,
    address: address,
    location: location,
    videoUrl: videoUrl,
    stars: stars,
    parking: parking,
    roomService: roomService,
    wifi: wifi,
    hotWater: hotWater,
    heater: heater,
    description: description,
    features: features,
    owner: {
      name: ownerName,
      cnic: ownerCNIC,
      contact: ownerContact,
      email: loginEmail,
      password: hashedPassword,
    },
    rooms: {
      single: {
        total: singleRooms,
        available: singleRooms,
        charges: singleRmCharges,
        size: singleRmSize,
        occupancy: singleRmOccupancy,
        bedSize: singleRmBedSize
      },
      twin: {
        total: twinRooms,
        available: twinRooms,
        charges: twinRmCharges,
        size: twinRmSize,
        occupancy: twinRmOccupancy,
        bed1Size: twinRmBed1Size,
        bed2Size: twinRmBed2Size
      },
      triple: {
        total: tripleRooms,
        available: tripleRooms,
        charges: tripleRmCharges,
        size: tripleRmSize,
        occupancy: tripleRmOccupancy,
        bed1Size: tripleRmBed1Size,
        bed2Size: tripleRmBed2Size,
        bed3Size: tripleRmBed3Size,
      },
      quad: {
        total: quadRooms,
        available: quadRooms,
        charges: quadRmCharges,
        size: quadRmSize,
        occupancy: quadRmOccupancy,
        bed1Size: quadRmBed1Size,
        bed2Size: quadRmBed2Size,
        bed3Size: quadRmBed3Size,
        bed4Size: quadRmBed4Size
      },
      quin: {
        total: quinRooms,
        available: quinRooms,
        charges: quinRmCharges,
        size: quinRmSize,
        occupancy: quinRmOccupancy,
        bed1Size: quinRmBed1Size,
        bed2Size: quinRmBed2Size,
        bed3Size: quinRmBed3Size,
        bed4Size: quinRmBed5Size,
        bed5Size: quinRmBed5Size
      }
    },
  });

  try {
    await hotel.save();
    // console.log(result);
    console.log("Added Hotel");
    req.flash("message", "Hotel Data Added Successfully.");
    res.redirect("/admin/Hotels/addHotelGallery?hotelId=" + hotel.id);
  } catch (err) {
    console.log(err);
    const areas = await Areas.find();
    return res.status(422).render("../Admin/views/pages/Hotels/addHotel", {
      user: req.session.user,
      path: "/admin/Hotesl/addHotel",
      pageTitle: "Hotel",
      areas: areas,
      flashMessage: "Something went wrong please try again.",
      oldInput: {
        name: name,
        contact: contact,
        parking: parking,
        hotWater: hotWater,
        heater: heater,
        wifi: wifi,
        location: location,
        roomService: roomService,
        address: address,
        videoUrl: videoUrl,
        ownerName: ownerName,
        ownerCNIC: ownerCNIC,
        ownerContact: ownerContact,
        loginEmail: loginEmail,
        loginPassword: loginPassword,
        description: description,
        features: features,
        single: {
          total: singleRooms,
          charges: singleRmCharges,
          size: singleRmSize,
          occupancy: singleRmOccupancy,
          bedSize: singleRmBedSize
        },
        twin: {
          total: twinRooms,
          charges: twinRmCharges,
          size: twinRmSize,
          occupancy: twinRmOccupancy,
          bed1Size: twinRmBed1Size,
          bed2Size: twinRmBed2Size
        },
        triple: {
          total: tripleRooms,
          charges: tripleRmCharges,
          size: tripleRmSize,
          occupancy: tripleRmOccupancy,
          bed1Size: tripleRmBed1Size,
          bed2Size: tripleRmBed2Size,
          bed3Size: tripleRmBed3Size
        },
        quad: {
          total: quadRooms,
          charges: quadRmCharges,
          size: quadRmSize,
          occupancy: quadRmOccupancy,
          bed1Size: quadRmBed1Size,
          bed2Size: quadRmBed2Size,
          bed3Size: quadRmBed3Size,
          bed4Size: quadRmBed4Size
        },
        quin: {
          total: quinRooms,
          charges: quinRmCharges,
          size: quinRmSize,
          occupancy: quinRmOccupancy,
          bed1Size: quinRmBed1Size,
          bed2Size: quinRmBed2Size,
          bed3Size: quinRmBed3Size,
          bed4Size: quinRmBed4Size,
          bed5Size: quinRmBed5Size
        }
      }
    });
  }
};

const postEditHotel = async (req, res, next) => {
  const hotelId = req.body.hotelId;
  const name = req.body.name;
  const contact = req.body.contact;
  const address = req.body.address;
  const videoUrl = req.body.videoUrl;
  const location = req.body.area;
  const stars = Number(req.body.stars);
  const hotWater = req.body.hotWater ? true : false;
  const heater = req.body.heater ? true : false;
  const wifi = req.body.wifi ? true : false;
  const roomService = req.body.roomService ? true : false;
  const parking = req.body.parking ? true : false;
  const description = req.body.description;
  const features = req.body.features;

  // Rooms Details
  const singleRooms = req.body.singleRmNo ? Number(req.body.singleRmNo) : "";
  const singleRmCharges = req.body.singleRmCharges
    ? Number(req.body.singleRmCharges)
    : "";
  const singleRmSize = req.body.singleRmSize ? req.body.singleRmSize : "";
  const singleRmOccupancy = req.body.singleRmOccupancy
    ? Number(req.body.singleRmOccupancy)
    : "";
  const singleRmBedSize = req.body.singleRmBedSize ? req.body.singleRmBedSize : "";


  const twinRooms = req.body.twinRmNo ? Number(req.body.twinRmNo) : "";
  const twinRmCharges = req.body.twinRmCharges
    ? Number(req.body.twinRmCharges)
    : "";
  const twinRmSize = req.body.twinRmSize ? req.body.twinRmSize : "";
  const twinRmOccupancy = req.body.twinRmOccupancy
    ? Number(req.body.twinRmOccupancy)
    : "";
    const twinRmBed1Size = req.body.twinRmBed1Size ? req.body.twinRmBed1Size : "";
    const twinRmBed2Size = req.body.twinRmBed2Size ? req.body.twinRmBed2Size : "";

  const tripleRooms = req.body.tripleRmNo ? Number(req.body.tripleRmNo) : "";
  const tripleRmCharges = req.body.tripleRmCharges
    ? Number(req.body.tripleRmCharges)
    : "";
  const tripleRmSize = req.body.tripleRmSize ? req.body.tripleRmSize : "";
  const tripleRmOccupancy = req.body.tripleRmOccupancy
    ? Number(req.body.tripleRmOccupancy)
    : "";
    const tripleRmBed1Size = req.body.tripleRmBed1Size
    ? req.body.tripleRmBed1Size
    : "";
  const tripleRmBed2Size = req.body.tripleRmBed2Size
    ? req.body.tripleRmBed2Size
    : "";
  const tripleRmBed3Size = req.body.tripleRmBed3Size
    ? req.body.tripleRmBed3Size
    : "";

  const quinRooms = req.body.quinRmNo ? Number(req.body.quinRmNo) : "";
  const quinRmCharges = req.body.quinRmCharges
    ? Number(req.body.quinRmCharges)
    : "";
  const quinRmSize = req.body.quinRmSize ? req.body.quinRmSize : "";
  const quinRmOccupancy = req.body.quinRmOccupancy
    ? Number(req.body.quinRmOccupancy)
    : "";
    const quinRmBed1Size = req.body.quinRmBed1Size ? req.body.quinRmBed1Size : "";
  const quinRmBed2Size = req.body.quinRmBed2Size ? req.body.quinRmBed2Size : "";
  const quinRmBed3Size = req.body.quinRmBed3Size ? req.body.quinRmBed3Size : "";
  const quinRmBed4Size = req.body.quinRmBed4Size ? req.body.quinRmBed4Size : "";
  const quinRmBed5Size = req.body.quinRmBed5Size ? req.body.quinRmBed5Size : "";


  const quadRooms = req.body.quadRmNo ? Number(req.body.quadRmNo) : "";
  const quadRmCharges = req.body.quadRmCharges
    ? Number(req.body.quadRmCharges)
    : "";
  const quadRmSize = req.body.quadRmSize ? req.body.quadRmSize : "";
  const quadRmOccupancy = req.body.quadRmOccupancy
    ? Number(req.body.quadRmOccupancy)
    : "";
    const quadRmBed1Size = req.body.quadRmBed1Size ? req.body.quadRmBed1Size : "";
    const quadRmBed2Size = req.body.quadRmBed2Size ? req.body.quadRmBed2Size : "";
    const quadRmBed3Size = req.body.quadRmBed3Size ? req.body.quadRmBed3Size : "";
    const quadRmBed4Size = req.body.quadRmBed4Size ? req.body.quadRmBed4Size : "";


  // owner info
  const ownerName = req.body.ownerName;
  const ownerCNIC = req.body.ownerCNIC;
  const ownerContact = req.body.ownerContact;
  const loginEmail = req.body.loginEmail;
  const loginPassword = req.body.loginPassword;
  const oldLoginPassword = req.body.oldPassword;

  const areas = await Areas.find();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("../Admin/views/pages/Hotels/editHotel", {
      user: req.session.user,
      path: "/admin/Hotesl/editHotel",
      pageTitle: "Hotel",
      areas: areas,
      flashMessage: errors.array()[0].msg,
      hotel: {
        id: hotelId,
        name: name,
        contact: contact,
        parking: parking,
        location: location,
        roomService: roomService,
        address: address,
        videoUrl: videoUrl,
        rooms: {
          single: {
            total: singleRooms,
            charges: singleRmCharges,
            size: singleRmSize,
            occupancy: singleRmOccupancy,
            bedSize: singleRmBedSize,
          },
          twin: {
            total: twinRooms,
            charges: twinRmCharges,
            size: twinRmSize,
            occupancy: twinRmOccupancy,
            bed1Size: twinRmBed1Size,
          bed2Size: twinRmBed2Size,
          },
          triple: {
            total: tripleRooms,
            charges: tripleRmCharges,
            size: tripleRmSize,
            occupancy: tripleRmOccupancy,
            bed1Size: tripleRmBed1Size,
          bed2Size: tripleRmBed2Size,
          bed3Size: tripleRmBed3Size,
          },
          quad: {
            total: quadRooms,
            charges: quadRmCharges,
            size: quadRmSize,
            occupancy: quadRmOccupancy,
            bed1Size: quadRmBed1Size,
          bed2Size: quadRmBed2Size,
          bed3Size: quadRmBed3Size,
          bed4Size: quadRmBed4Size,
          },
          quin: {
            total: quinRooms,
            charges: quinRmCharges,
            size: quinRmSize,
            occupancy: quinRmOccupancy,
            bed1Size: quinRmBed1Size,
          bed2Size: quinRmBed2Size,
          bed3Size: quinRmBed3Size,
          bed4Size: quinRmBed4Size,
          bed5Size: quinRmBed5Size
          }
        },
        owner: {
          name: ownerName,
          cnic: ownerCNIC,
          contact: ownerContact,
          email: loginEmail,
          password: loginPassword ? loginPassword : oldLoginPassword,
        }
      },
      validationErrors: errors.array(),
    });
  }


  let salt = null;
  let hashedPassword = null;
  if (loginPassword.length > 0) {
    // generate salt to hash password
    salt = await bcrypt.genSalt(16);
    // now we set user password to hashed password
    hashedPassword = await bcrypt.hash(loginPassword, salt);
  } else {
    hashedPassword = oldLoginPassword;
  }

  try {
    const hotel = await Hotels.findOneAndUpdate({ id: hotelId });
    hotel.name = name;
    hotel.contact = contact;
    hotel.address = address;
    hotel.videoUrl = videoUrl;
    hotel.location = location;
    hotel.stars = stars;
    hotel.parking = parking;
    hotel.roomService = roomService;
    hotel.wifi = wifi;
    hotel.hotWater = hotWater;
    hotel.heater = heater;
    hotel.description = description;
    hotel.features = features;
    hotel.owner = {
      name: ownerName,
      cnic: ownerCNIC,
      contact: ownerContact,
      email: loginEmail,
      password: hashedPassword,
    };
    hotel.rooms.single = {
      total: singleRooms,
      available: singleRooms,
      charges: singleRmCharges,
      size: singleRmSize,
      occupancy: singleRmOccupancy,
      bedSize: singleRmBedSize,
    };
    hotel.rooms.twin = {
      total: twinRooms,
      available: twinRooms,
      charges: twinRmCharges,
      size: twinRmSize,
      occupancy: twinRmOccupancy,
      bed1Size: twinRmBed1Size,
          bed2Size: twinRmBed2Size,
    };
    hotel.rooms.triple = {
      total: tripleRooms,
      available: tripleRooms,
      charges: tripleRmCharges,
      size: tripleRmSize,
      occupancy: tripleRmOccupancy,
      bed1Size: tripleRmBed1Size,
          bed2Size: tripleRmBed2Size,
          bed3Size: tripleRmBed3Size,
    };
    hotel.rooms.quad = {
      total: quadRooms,
      available: quadRooms,
      charges: quadRmCharges,
      size: quadRmSize,
      occupancy: quadRmOccupancy,
      bed1Size: quadRmBed1Size,
      bed2Size: quadRmBed2Size,
      bed3Size: quadRmBed3Size,
      bed4Size: quadRmBed4Size,
    };
    hotel.rooms.quin = {
      total: quinRooms,
      available: quinRooms,
      charges: quinRmCharges,
      size: quinRmSize,
      occupancy: quinRmOccupancy,
      bed1Size: quinRmBed1Size,
          bed2Size: quinRmBed2Size,
          bed3Size: quinRmBed3Size,
          bed4Size: quinRmBed4Size,
          bed5Size: quinRmBed5Size
    };

    await hotel.save();
    console.log("UPDATED Hotel!");
    req.flash("message", "Hotel Data Updated Successfully.");
    res.redirect("/admin/Hotels/hotelsList");
  } catch (err) {
    console.log(err);
    res.status(422).render("../Admin/views/pages/Hotels/editHotel", {
      user: req.session.user,
      path: "/admin/Hotesl/editHotel",
      pageTitle: "Hotel",
      areas: areas,
      flashMessage: 'Something went wrong.',
      hotel: {
        id: hotelId,
        name: name,
        contact: contact,
        parking: parking,
        location: location,
        roomService: roomService,
        address: address,
        ownerName: ownerName,
        ownerCNIC: ownerCNIC,
        ownerContact: ownerContact,
        loginEmail: loginEmail,
        loginPassword: loginPassword,
        description: description,
        features: features,
        rooms: {
          single: {
            total: singleRooms,
            charges: singleRmCharges,
            size: singleRmSize,
            occupancy: singleRmOccupancy,
            bedSize: singleRmBedSize,
          },
          twin: {
            total: twinRooms,
            charges: twinRmCharges,
            size: twinRmSize,
            occupancy: twinRmOccupancy,
            bed1Size: twinRmBed1Size,
          bed2Size: twinRmBed2Size,
          },
          triple: {
            total: tripleRooms,
            charges: tripleRmCharges,
            size: tripleRmSize,
            occupancy: tripleRmOccupancy,
            bed1Size: tripleRmBed1Size,
          bed2Size: tripleRmBed2Size,
          bed3Size: tripleRmBed3Size
          },
          quad: {
            total: quadRooms,
            charges: quadRmCharges,
            size: quadRmSize,
            occupancy: quadRmOccupancy,
            bed1Size: quadRmBed1Size,
          bed2Size: quadRmBed2Size,
          bed3Size: quadRmBed3Size,
          bed4Size: quadRmBed4Size,
          },
          quin: {
            total: quinRooms,
            charges: quinRmCharges,
            size: quinRmSize,
            occupancy: quinRmOccupancy,
            bed1Size: quinRmBed1Size,
          bed2Size: quinRmBed2Size,
          bed3Size: quinRmBed3Size,
          bed4Size: quinRmBed4Size,
          bed5Size: quinRmBed5Size
          }
        },
        owner: {
          name: ownerName,
          cnic: ownerCNIC,
          contact: ownerContact,
          email: loginEmail,
          password: loginPassword ? loginPassword : oldLoginPassword,
        }
      },
      validationErrors: errors.array(),
    });
  }
};

const postAddHotelGallery = async (req, res, next) => {
  const uploads = req.files;
  const hotelId = req.body.hotelId;
  const gallery = [];

  uploads.forEach(image => {
    gallery.push(image.filename);
  })

  try {
    const hotel = await Hotels.findById(hotelId);
    hotel.gallery = gallery;
    hotel.save();
    console.log("hotel pictures added");
    req.flash("message", "Hotel pictures uploaded Successfully");
    res.redirect("/admin/Hotels/addRoomsGallery?hotelId=" + hotelId);

  } catch (err) {
    console.log(err);
    req.flash("message", "Something went wrong.");
    res.redirect("/admin/Hotels/addHotelGallery?hotelId=" + hotelId);
  }
};

const postUpdateHotelGallery = async (req, res) => {
  const uploads = req.files;
  const hotelId = req.body.hotelId;
  const gallery = [];

  uploads.forEach(image => {
    gallery.push(image.filename);
  })

  try {
    const hotel = await Hotels.findById(hotelId);
    const updatedGallery = hotel.gallery.concat(gallery);
    hotel.gallery = updatedGallery;
    hotel.save();
    console.log("hotel gallery updated");
    req.flash("message", "Hotel Gallery Updated Successfully");
    res.redirect("/admin/Hotels/viewHotelImages/" + hotelId);
  } catch (err) {
    console.log(err);
    req.flash("message", "Something went wrong.");
    res.redirect("/admin/Hotels/viewHotelImages/" + hotelId);
  }
}

const postAddRoomGallery = async (req, res, next) => {
  const uploads = req.files;
  const hotelId = req.body.hotelId;
  const gallery = [];

  uploads.forEach((image, i) => {
    gallery.push(image.filename);
  })

  try {
    const hotel = await Hotels.findById(hotelId);
    hotel.rooms.gallery = gallery;
    hotel.save();
    console.log("room pictures addedd");
    req.flash("message", "Hotel added Successfully");
    res.redirect("/admin");

  } catch (err) {
    console.log(err);
    req.flash("message", "Something went wrong.");
    res.redirect("/admin/Hotels/addRoomsGallery?hotelId=" + hotelId);
  }
};

const postUpdateRoomGallery = async (req, res) => {
  console.log('upadte function')
  const uploads = req.files;
  const hotelId = req.body.hotelId;
  const gallery = [];

  uploads.forEach((image, i) => {
    gallery.push(image.filename);
  })
  try {
    const hotel = await Hotels.findById(hotelId);
    updatedGallery = hotel.rooms.gallery.concat(gallery);
    hotel.rooms.gallery = updatedGallery;
    hotel.save();
    console.log("room gallery updated");
    req.flash("message", "Gallery Updated Successfully");
    res.redirect("/admin/Hotels/roomGallery/" + hotelId);
  } catch (err) {
    console.log(err);
    req.flash("message", "Something went wrong.");
    es.redirect("/admin/Hotels/roomGallery/" + hotelId);
  }
};

const postDeleteHotel = async (req, res) => {

  const hotelId = req.body.id;
  try {
    const hotel = await Hotels.findById(hotelId);

    if (!hotel.gallery.length == 0) {
      hotel.gallery.forEach(image => {
        const imgPath = path.join(__dirname + '../../../files/uploads/' + image);
        fs.unlink(imgPath, err => {
          if (err) throw err;
          console.log('images delted')
        })
      })
    }

    if (!hotel.rooms.gallery.length == 0) {
      hotel.rooms.gallery.forEach(image => {
        const imgPath = path.join(__dirname + '../../../files/uploads/' + image);
        fs.unlink(imgPath, err => {
          if (err) throw err;
          console.log('images deleted')
        })
      })
    }

    await Hotels.findByIdAndDelete(hotelId);
    res.sendStatus(200);
    console.log("hotel deleted");

  } catch (err) {
    console.log(err);
    res.sendStatus(204);
  }
};

const postDeleteGalleryImage = async (req, res) => {
  const image = req.body.image;
  const hotelId = req.body.id;

  try {
    const hotel = await Hotels.findById(hotelId);
    gallery = hotel.gallery;
    //removing the selected image from array
    gallery.splice(gallery.indexOf(image), 1);
    hotel.gallery = gallery;

    imgPath = path.join(__dirname, "../../files/uploads/" + image);
    fs.unlink(imgPath, (err) => {
      if (err) console.log(err);
      console.log('image deleted');
    });

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(204);
  }
};

const postDeleteRoomGalleryImage = async (req, res) => {
  const image = req.body.image;
  const hotelId = req.body.id;

  try {
    const hotel = await Hotels.findById(hotelId);
    gallery = hotel.rooms.gallery;
    //removing the selected image from array
    gallery.splice(gallery.indexOf(image), 1);
    hotel.rooms.gallery = gallery;
    
    const imgPath = path.join(__dirname, '../../files/uploads/' + image);
    fs.unlink(imgPath, (err) => {
      if (err) console.log(err);
      console.log('image deleted');
    });
    
    await hotel.save();
    res.sendStatus(200);

  } catch (err) {
    console.log(err);
    res.sendStatus(204);
  }
};

module.exports = {
  hotelClients,
  hotelList,
  viewHotel,
  editHotel,
  hotelApproved,
  hotelUnapproved,
  addGalleryHotel,
  addHotelImages,
  addRoomImages,
  galleryList,
  viewHotelImages,
  viewRoomImages,
  hotelBookings,

  postAddHotel,
  postEditHotel,
  postAddHotelGallery,
  postUpdateHotelGallery,
  postAddRoomGallery,
  postUpdateRoomGallery,
  postDeleteGalleryImage,
  postDeleteRoomGalleryImage,
  postDeleteHotel,
};
