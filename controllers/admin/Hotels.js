const { delImg } = require("../../util/file");
const fs = require('fs');
const path = require('path');
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

//models
const Areas = require("../../models/Location");
const Hotels = require("../../models/Hotel");

const hotelClients = (req, res, next) => {
  Areas.find()
    .then((areas) => {
      res.render("../Admin/views/pages/Hotels/addHotel", {
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
            view: "",
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
            view: "",
            occupancy: "",
            bedSize: "",
            description: "",
            features: "",
          },
          triple: {
            total: "",
            charges: "",
            videoUrl: "",
            size: "",
            view: "",
            occupancy: "",
            bedSize: "",
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
            bedSize: "",
            description: "",
            features: "",
          },
          quin: {
            total: '',
            charges: '',
            size: '',
            view: '',
            occupancy: '',
            bedSize: ''
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

const hotelBookings = async (req, res, next)=>{
  const hotels = await Hotels.find();
  res.render("../Admin/views/pages/Hotels/bookings", {
    hotels: hotels,
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
    title: "Selet Hotel Pictures",
    url: "/admin/Hotels/addHotelGallery",
    hotelId: hotelId,
  });
};

const addRoomImages = (req, res, next) => {
  const hotelId = req.query.hotelId;
  res.render("../Admin/views/pages/Hotels/addImages", {
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
  const singleRmView = req.body.singleRmView ? Number(req.body.singleRmView) : "";
  const singleRmOccupancy = req.body.singleRmOccupancy
    ? Number(req.body.singleRmOccupancy)
    : "";
  const singleRmBedSize = req.body.singleRmBedSize ? req.body.singleRmBedSize : "";

  const twinRooms = req.body.twinRmNo ? Number(req.body.twinRmNo) : "";
  const twinRmCharges = req.body.twinRmCharges
    ? Number(req.body.twinRmCharges)
    : "";
  const twinRmSize = req.body.twinRmSize ? req.body.twinRmSize : "";
  const twinRmView = req.body.twinRmView ? Number(req.body.twinRmView) : "";
  const twinRmOccupancy = req.body.twinRmOccupancy
    ? Number(req.body.twinRmOccupancy)
    : "";
  const twinRmBedSize = req.body.twinRmBedSize ? req.body.twinRmBedSize : "";

  const tripleRooms = req.body.tripleRmNo ? Number(req.body.tripleRmNo) : "";
  const tripleRmCharges = req.body.tripleRmCharges
    ? Number(req.body.tripleRmCharges)
    : "";
  const tripleRmSize = req.body.tripleRmSize ? req.body.tripleRmSize : "";
  const tripleRmView = req.body.tripleRmView
    ? Number(req.body.tripleRmView)
    : "";
  const tripleRmOccupancy = req.body.tripleRmOccupancy
    ? Number(req.body.tripleRmOccupancy)
    : "";
  const tripleRmBedSize = req.body.tripleRmBedSize
    ? req.body.tripleRmBedSize
    : "";

  const quadRooms = req.body.quadRmNo ? Number(req.body.quadRmNo) : "";
  const quadRmCharges = req.body.quadRmCharges
    ? Number(req.body.quadRmCharges)
    : "";
  const quadRmSize = req.body.quadRmSize ? req.body.quadRmSize : "";
  const quadRmView = req.body.quadRmView ? Number(req.body.quadRmView) : "";
  const quadRmOccupancy = req.body.quadRmOccupancy
    ? Number(req.body.quadRmOccupancy)
    : "";
  const quadRmBedSize = req.body.quadRmBedSize ? req.body.quadRmBedSize : "";

  const quinRooms = req.body.quinRmNo ? Number(req.body.quinRmNo) : "";
  const quinRmCharges = req.body.quinRmCharges
    ? Number(req.body.quinRmCharges)
    : "";
  const quinRmSize = req.body.quinRmSize ? req.body.quinRmSize : "";
  const quinRmView = req.body.quinRmView ? Number(req.body.quinRmView) : "";
  const quinRmOccupancy = req.body.quinRmOccupancy
    ? Number(req.body.quinRmOccupancy)
    : "";
  const quinRmBedSize = req.body.quinRmBedSize ? req.body.quinRmBedSize : "";

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
      path: "/Hotesl/addHotel",
      pageTitle: "Hotel",
      areas: areas,
      flashMessage: errors.array()[0].msg,
      oldInput: {
        name: name,
        contact: contact,
        parking: parking,
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
          view: singleRmView,
          occupancy: singleRmOccupancy,
          bedSize: singleRmBedSize
        },
        twin: {
          total: twinRooms,
          charges: twinRmCharges,
          size: twinRmSize,
          view: twinRmView,
          occupancy: twinRmOccupancy,
          bedSize: twinRmBedSize
        },
        triple: {
          total: tripleRooms,
          charges: tripleRmCharges,
          size: tripleRmSize,
          view: tripleRmView,
          occupancy: tripleRmOccupancy,
          bedSize: tripleRmBedSize
        },
        quad: {
          total: quadRooms,
          charges: quadRmCharges,
          size: quadRmSize,
          view: quadRmView,
          occupancy: quadRmOccupancy,
          bedSize: quadRmBedSize
        },
        quin: {
          total: quinRooms,
          charges: quinRmCharges,
          size: quinRmSize,
          view: quinRmView,
          occupancy: quinRmOccupancy,
          bedSize: quinRmBedSize
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
        charges: singleRmCharges,
        size: singleRmSize,
        view: singleRmView,
        occupancy: singleRmOccupancy,
        bedSize: singleRmBedSize
      },
      twin: {
        total: twinRooms,
        charges: twinRmCharges,
        size: twinRmSize,
        view: twinRmView,
        occupancy: twinRmOccupancy,
        bedSize: twinRmBedSize
      },
      triple: {
        total: tripleRooms,
        charges: tripleRmCharges,
        size: tripleRmSize,
        view: tripleRmView,
        occupancy: tripleRmOccupancy,
        bedSize: tripleRmBedSize
      },
      quad: {
        total: quadRooms,
        charges: quadRmCharges,
        size: quadRmSize,
        view: quadRmView,
        occupancy: quadRmOccupancy,
        bedSize: quadRmBedSize
      },
      quin: {
        total: quinRooms,
        charges: quinRmCharges,
        size: quinRmSize,
        view: quinRmView,
        occupancy: quinRmOccupancy,
        bedSize: quinRmBedSize
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
      path: "/admin/Hotesl/addHotel",
      pageTitle: "Hotel",
      areas: areas,
      flashMessage: "Something went wrong please try again.",
      oldInput: {
        name: name,
        contact: contact,
        parking: parking,
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
          view: singleRmView,
          occupancy: singleRmOccupancy,
          bedSize: singleRmBedSize
        },
        twin: {
          total: twinRooms,
          charges: twinRmCharges,
          size: twinRmSize,
          view: twinRmView,
          occupancy: twinRmOccupancy,
          bedSize: twinRmBedSize
        },
        triple: {
          total: tripleRooms,
          charges: tripleRmCharges,
          size: tripleRmSize,
          view: tripleRmView,
          occupancy: tripleRmOccupancy,
          bedSize: tripleRmBedSize
        },
        quad: {
          total: quadRooms,
          charges: quadRmCharges,
          size: quadRmSize,
          view: quadRmView,
          occupancy: quadRmOccupancy,
          bedSize: quadRmBedSize
        },
        quin: {
          total: quinRooms,
          charges: quinRmCharges,
          size: quinRmSize,
          view: quinRmView,
          occupancy: quinRmOccupancy,
          bedSize: quinRmBedSize
        },
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
  const singleRmView = req.body.singleRmView ? Number(req.body.singleRmView) : "";
  const singleRmOccupancy = req.body.singleRmOccupancy
    ? Number(req.body.singleRmOccupancy)
    : "";
  const singleRmBedSize = req.body.singleRmBedSize ? req.body.singleRmBedSize : "";
  

  const twinRooms = req.body.twinRmNo ? Number(req.body.twinRmNo) : "";
  const twinRmCharges = req.body.twinRmCharges
    ? Number(req.body.twinRmCharges)
    : "";
  const twinRmSize = req.body.twinRmSize ? req.body.twinRmSize : "";
  const twinRmView = req.body.twinRmView ? Number(req.body.twinRmView) : "";
  const twinRmOccupancy = req.body.twinRmOccupancy
    ? Number(req.body.twinRmOccupancy)
    : "";
  const twinRmBedSize = req.body.twinRmBedSize ? req.body.twinRmBedSize : "";

  const tripleRooms = req.body.tripleRmNo ? Number(req.body.tripleRmNo) : "";
  const tripleRmCharges = req.body.tripleRmCharges
    ? Number(req.body.tripleRmCharges)
    : "";
  const tripleRmSize = req.body.tripleRmSize ? req.body.tripleRmSize : "";
  const tripleRmView = req.body.tripleRmView
    ? Number(req.body.tripleRmView)
    : "";
  const tripleRmOccupancy = req.body.tripleRmOccupancy
    ? Number(req.body.tripleRmOccupancy)
    : "";
  const tripleRmBedSize = req.body.tripleRmBedSize
    ? req.body.tripleRmBedSize
    : "";

  const quinRooms = req.body.quinRmNo ? Number(req.body.quinRmNo) : "";
  const quinRmCharges = req.body.quinRmCharges
    ? Number(req.body.quinRmCharges)
    : "";
  const quinRmSize = req.body.quinRmSize ? req.body.quinRmSize : "";
  const quinRmView = req.body.quinRmView ? Number(req.body.quinRmView) : "";
  const quinRmOccupancy = req.body.quinRmOccupancy
    ? Number(req.body.quinRmOccupancy)
    : "";
  const quinRmBedSize = req.body.quinRmBedSize ? req.body.quinRmBedSize : "";


  const quadRooms = req.body.quadRmNo ? Number(req.body.quadRmNo) : "";
  const quadRmCharges = req.body.quadRmCharges
    ? Number(req.body.quadRmCharges)
    : "";
  const quadRmSize = req.body.quadRmSize ? req.body.quadRmSize : "";
  const quadRmView = req.body.quadRmView ? Number(req.body.quadRmView) : "";
  const quadRmOccupancy = req.body.quadRmOccupancy
    ? Number(req.body.quadRmOccupancy)
    : "";
  const quadRmBedSize = req.body.quadRmBedSize ? req.body.quadRmBedSize : "";


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
            view: singleRmView,
            occupancy: singleRmOccupancy,
            bedSize: singleRmBedSize,
          },
          twin: {
            total: twinRooms,
            charges: twinRmCharges,
            size: twinRmSize,
            view: twinRmView,
            occupancy: twinRmOccupancy,
            bedSize: twinRmBedSize,
          },
          triple: {
            total: tripleRooms,
            charges: tripleRmCharges,
            size: tripleRmSize,
            view: tripleRmView,
            occupancy: tripleRmOccupancy,
            bedSize: tripleRmBedSize,
          },
          quad: {
            total: quadRooms,
            charges: quadRmCharges,
            size: quadRmSize,
            view: quadRmView,
            occupancy: quadRmOccupancy,
            bedSize: quadRmBedSize,
          },
          quin: {
            total: quinRooms,
            charges: quinRmCharges,
            size: quinRmSize,
            view: quinRmView,
            occupancy: quinRmOccupancy,
            bedSize: quinRmBedSize
          }
        },
        owner : {
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
    const hotel = await Hotels.findOneAndUpdate({id: hotelId});
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
      charges: singleRmCharges,
      size: singleRmSize,
      view: singleRmView,
      occupancy: singleRmOccupancy,
      bedSize: singleRmBedSize,
    };
    hotel.rooms.twin = {
      total: twinRooms,
      charges: twinRmCharges,
      size: twinRmSize,
      view: twinRmView,
      occupancy: twinRmOccupancy,
      bedSize: twinRmBedSize,
    };
    hotel.rooms.triple = {
      total: tripleRooms,
      charges: tripleRmCharges,
      size: tripleRmSize,
      view: tripleRmView,
      occupancy: tripleRmOccupancy,
      bedSize: tripleRmBedSize,
    };
    hotel.rooms.quad = {
      total: quadRooms,
      charges: quadRmCharges,
      size: quadRmSize,
      view: quadRmView,
      occupancy: quadRmOccupancy,
      bedSize: quadRmBedSize,
    };
    hotel.rooms.quin = {
      total: quinRooms,
      charges: quinRmCharges,
      size: quinRmSize,
      view: quinRmView,
      occupancy: quinRmOccupancy,
      bedSize: quinRmBedSize
    };

    await hotel.save();
    console.log("UPDATED Hotel!");
    req.flash("message", "Hotel Data Updated Successfully.");
    res.redirect("/admin/Hotels/hotelsList");
  } catch (err) {
    console.log(err);
    res.status(422).render("../Admin/views/pages/Hotels/editHotel", {
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
            view: singleRmView,
            occupancy: singleRmOccupancy,
            bedSize: singleRmBedSize,
          },
          twin: {
            total: twinRooms,
            charges: twinRmCharges,
            size: twinRmSize,
            view: twinRmView,
            occupancy: twinRmOccupancy,
            bedSize: twinRmBedSize,
          },
          triple: {
            total: tripleRooms,
            charges: tripleRmCharges,
            size: tripleRmSize,
            view: tripleRmView,
            occupancy: tripleRmOccupancy,
            bedSize: tripleRmBedSize,
          },
          quad: {
            total: quadRooms,
            charges: quadRmCharges,
            size: quadRmSize,
            view: quadRmView,
            occupancy: quadRmOccupancy,
            bedSize: quadRmBedSize,
          },
          quin: {
            total: quinRooms,
            charges: quinRmCharges,
            size: quinRmSize,
            view: quinRmView,
            occupancy: quinRmOccupancy,
            bedSize: quinRmBedSize
          }
        },
        owner : {
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
    gallery.push( image.filename );
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

const postUpdateHotelGallery = async (req, res)=>{
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

  uploads.forEach((image, i) =>{
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

  uploads.forEach((image, i) =>{
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

    hotel.gallery.forEach( image => {
      const imgPath = path.join(__dirname + '../../../files/uploads/' + image);
      fs.unlink(imgPath, err =>{
        if(err) throw err;
      })
    })

    hotel.rooms.gallery.forEach( image => {
      const imgPath = path.join(__dirname + '../../../files/uploads/' + image);
      fs.unlink(imgPath, err =>{
        if(err) throw err;
      })
    })
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

    if (delImg(image)) {
      await hotel.save();
      console.log("UPDATED Gallery!");
      res.sendStatus(200);
    } else {
      throw "Something went wrong while deleting the file.";
    }
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

    if (delImg(image)) {
      await hotel.save();
      console.log("UPDATED Gallery!");
      res.sendStatus(200);
    } else {
      throw "Something went wrong while deleting the file.";
    }
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
