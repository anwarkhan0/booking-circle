const { delImg, delMultImages } = require("../../util/file");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const path = require('path');
const fs = require('fs');
const moment = require('moment');

//models
const Areas = require("../../models/Location");
const Appartments = require("../../models/Appartment");
const appartmentsHouses = (req, res, next) => {
  Areas.find()
    .then((areas) => {
      res.render("../Admin/views/pages/Appartments/addAppartment", {
        user: req.session.user,
        areas: areas,
        pageTitle: "add appartment",
        path: "/Appartments/add-appartment",
        oldInput: {
          name: "",
          charges: "",
          contact: "",
          occupancy: "",
          parking: "",
          occupancy: '',
          wifi: '',
          secuirity: '',
          kitchen: '',
          tv: '',
          cleaning: '',
          pets: '',
          livingArea: '',
          view: '',
          area: "",
          address: "",
          ownerName: "",
          ownerCNIC: "",
          ownerContact: "",
          loginEmail: "",
          loginPassword: "",
          description: "",
          features: "",
          videoUrl: "",
        },
        flashMessage: req.flash("message"),
      });
    })
    .catch((err) => console.log(err));
};

const editAppartmentHouse = async (req, res, next) => {
  const appartId = req.params.id;

  try {
    const appart = await Appartments.findById(appartId);

    if (!appart) {
      return res.redirect("/");
    }

    const areas = await Areas.find();
    res.render("../Admin/views/pages/Appartments/editAppartmentHouse", {
      user: req.session.user,
      pageTitle: "Edit Appartment/House",
      path: "/Appartment/edit-Appartment",
      areas: areas,
      appart: appart,
      flashMessage: req.flash("message"),
    });
  } catch (err) {
    console.log(err);
  }
};

const addGallery = (req, res, next) => {
  const appartId = req.params.id;
  res.render("../Admin/views/pages/Appartments/addGalleryAppartments", {
    user: req.session.user,
    appartId: appartId,
  });
};

const editGalleryAppartments = (req, res, next) => {
  const appartId = req.params.id;
  Appartments.findById(appartId)
    .then((appartment) => {
      if (!appartment) {
        res.redirect("/Appartments/addGallery/" + appartId);
      } else {
        res.render("../Admin/views/pages/Appartments/editGalleryAppartments", {
          user: req.session.user,
          gallery: appartment.gallery,
          appartmentId: appartment.id,
          pageTitle: "Gallery List",
          path: "/Hotels/gallery-list",
          flashMessage: req.flash("message"),
        });
      }
    })
    .catch((err) => console.log(err));
};

const appartmentList = (req, res, next) => {
  Appartments.find()
    .then((appartments) => {
      res.render("../Admin/views/pages/Appartments/appartmentList", {
        user: req.session.user,
        aparts: appartments,
        pageTitle: "Appartments List",
        path: "/Appartments/appartment-list",
      });
    })
    .catch((err) => console.log(err));
};

const appartmentBookingsList = async (req, res, next) => {

  try {
    const appartments = await Appartments.find();
    res.render("../Admin/views/pages/Appartments/bookingsList", {
      user: req.session.user,
      moment: moment,
      appartments: appartments,
      flashMessage: req.flash("message"),
    })
  } catch (err) {
    console.log(err);
    req.flash('message', 'Something went wrong.')
    res.redirect('/admin')
  }
 
};

const addGalleryHouses = (req, res, next) => {
  res.render("../Admin/views/pages/Appartments/addGalleryHouses");
};

const editGalleryHouses = (req, res, next) => {
  res.render("../Admin/views/pages/Appartments/editGalleryHouses");
};

//Appartments post requests
const postAddAppartment = async (req, res, next) => {
  const name = req.body.appartName;
  const charges = req.body.charges;
  const contact = req.body.contact;
  const occupancy = req.body.occupancy;
  const parking = req.body.parking  ? true : false;
  const wifi = req.body.wifi ? true : false;;
  const secuirity = req.body.secuirity ? true : false;
  const kitchen = req.body.kitchen ? true : false;
  const tv = req.body.tv ? true : false;
  const cleaning = req.body.cleaning ? true : false;
  const pets = req.body.pets ? true : false;
  const livingArea = req.body.livingArea ? true : false;
  const view = req.body.view ? true : false;
  const area = req.body.area;
  const address = req.body.address;
  const ownerName = req.body.ownerName;
  const ownerCNIC = req.body.ownerCNIC;
  const ownerContact = req.body.ownerContact;
  const loginEmail = req.body.loginEmail;
  const loginPassword = req.body.loginPassword;
  const description = req.body.description;
  const features = req.body.features;
  const videoUrl = req.body.videoUrl;

  const areas = await Areas.find();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("../Admin/views/pages/Appartments/addAppartment", {
      user: req.session.user,
      path: "/Appartments/addAppartment",
      pageTitle: "Appartment",
      areas: areas,
      flashMessage: errors.array()[0].msg,
      oldInput: {
        name: name,
        charges: charges,
        contact: contact,
        parking: parking,
        occupancy: occupancy,
        wifi: wifi,
        secuirity: secuirity,
        kitchen: kitchen,
        tv: tv,
        cleaning: cleaning,
        pets: pets,
        livingArea: livingArea,
        view: view,
        area: area,
        address: address,
        ownerName: ownerName,
        ownerCNIC: ownerCNIC,
        ownerContact: ownerContact,
        loginEmail: loginEmail,
        loginPassword: loginPassword,
        description: description,
        features: features,
        videoUrl: videoUrl,
      },
      validationErrors: errors.array(),
    });
  }

  // generate salt to hash password
  const salt = await bcrypt.genSalt(16);
  // now we set user password to hashed password
  const hashedPassword = await bcrypt.hash(loginPassword, salt);

  const appartment = new Appartments({
    name: name,
    contact: contact,
    occupancy: occupancy,
    charges: charges,
    contact: contact,
    parking: parking,
    wifi: wifi,
    secuirity: secuirity,
    kitchen: kitchen,
    tv: tv,
    cleaning: cleaning,
    pets: pets,
    livingArea: livingArea,
    view: view,
    area: area,
    address: address,
    ownerName: ownerName,
    ownerCNIC: ownerCNIC,
    ownerContact: ownerContact,
    loginEmail: loginEmail,
    loginPassword: hashedPassword,
    availibilityStatus: false,
    description: description,
    features: features,
    videoUrl: videoUrl,
  });

  try {
    await appartment.save();
    // console.log(result);
    console.log("appartment added");
    res.redirect("/admin/Appartments/addGallery/" + appartment.id);
  } catch (err) {
    console.log(err);
    return res.status(422).render("../Admin/views/pages/Appartments/addAppartment", {
      user: req.session.user,
      path: "/Appartments/addAppartment",
      pageTitle: "Appartment",
      areas: areas,
      flashMessage: errors.array()[0].msg,
      oldInput: {
        name: name,
        charges: charges,
        contact: contact,
        parking: parking,
        area: area,
        address: address,
        ownerName: ownerName,
        ownerCNIC: ownerCNIC,
        ownerContact: ownerContact,
        loginEmail: loginEmail,
        loginPassword: loginPassword,
        description: description,
        features: features,
        videoUrl: videoUrl,
      },
      validationErrors: errors.array(),
    });
  }
};

const postEditAppartment = async (req, res, next) => {
  const appartId = req.body.appartId;
  const name = req.body.appartName;
  const charges = req.body.charges;
  const occupancy = Number(req.body.occupancy);
  const parking = req.body.parking  ? true : false;
  const wifi = req.body.wifi ? true : false;
  const secuirity = req.body.secuirity ? true : false;
  const kitchen = req.body.kitchen ? true : false;
  const tv = req.body.tv ? true : false;
  const cleaning = req.body.cleaning ? true : false;
  const pets = req.body.pets ? true : false;
  const livingArea = req.body.livingArea ? true : false;
  const view = req.body.view ? true : false;
  const contact = req.body.contact;
  const area = req.body.area;
  const appartType = req.body.appartType;
  const address = req.body.address;
  const ownerName = req.body.ownerName;
  const ownerCNIC = req.body.ownerCNIC;
  const ownerContact = req.body.ownerContact;
  const loginEmail = req.body.loginEmail;
  const loginPassword = req.body.loginPassword;
  const oldLoginPassword = req.body.oldLoginPassword;
  const availibilityStatus = req.body.status;
  const description = req.body.description;
  const features = req.body.features;
  const videoUrl = req.body.videoUrl;

  const errors = validationResult(req);
  const areas = await Areas.find();
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .render("../Admin/views/pages/Appartments/editAppartmentHouse", {
        user: req.session.user,
        areas: areas,
        flashMessage: errors.array()[0].msg,
        appart: {
          id: appartId,
          name: name,
          charges: charges,
          contact: contact,
          parking: parking,
          area: area,
          appartmentType: appartType,
          address: address,
          ownerName: ownerName,
          ownerCNIC: ownerCNIC,
          ownerContact: ownerContact,
          loginEmail: loginEmail,
          loginPassword: loginPassword,
          description: description,
          features: features,
          videoUrl: videoUrl,
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
    const appart = await Appartments.findById(appartId);
    appart.name = name;
    appart.charges = charges;
    appart.contact = contact;
    appart.occupancy = occupancy;
    appart.parking = parking;
    appart.wifi = wifi;
    appart.secuirity = secuirity;
    appart.kitchen = kitchen;
    appart.tv = tv;
    appart.cleaning = cleaning;
    appart.pets = pets;
    appart.livingArea = livingArea;
    appart.view = view;
    appart.area = area;
    appart.appartmentType = appartType;
    appart.address = address;
    appart.ownerName = ownerName;
    appart.ownerCNIC = ownerCNIC;
    appart.ownerContact = ownerContact;
    appart.loginEmail = loginEmail;
    appart.loginPassword = hashedPassword;
    appart.availibilityStatus = availibilityStatus;
    appart.description = description;
    appart.features = features;
    appart.videoUrl = videoUrl;
    await appart.save();
    console.log("UPDATED appartment/house!");
    req.flash("message", "Appartment Data Updated Successfully");
    res.redirect("/admin");
  } catch (err) {
    console.log(err);
    return res.render("../Admin/views/pages/Appartments/editAppartmentHouse", {
      user: req.session.user,
      areas: areas,
      flashMessage: err,
      appart: {
        id: appartId,
        name: name,
        charges: charges,
        contact: contact,
        parking: parking,
        area: area,
        address: address,
        ownerName: ownerName,
        ownerCNIC: ownerCNIC,
        ownerContact: ownerContact,
        loginEmail: loginEmail,
        loginPassword: loginPassword,
        description: description,
        features: features,
        videoUrl: videoUrl,
      },
      validationErrors: errors.array(),
    });
  }
};

const postDeleteAppartment = async (req, res) => {
  const appartId = req.body.id;
  try {
    const appartment = await Appartments.findById(appartId);

    if(!appartment.gallery.length == 0){
      appartment.gallery.forEach( image => {
        const imgPath = path.join(__dirname + '../../../files/uploads/' + image);
        fs.unlink(imgPath, err =>{
          if(err) throw err;
        })
      })
    }
    
    await Appartments.findByIdAndDelete(appartId);
    res.sendStatus(200);
    console.log("appartment deleted");
    
  } catch (err) {
    console.log(err);
    res.sendStatus(204);
  }
};

const postAddAppartmentGallery = async (req, res, next) => {
  const uploads = req.files;
  const appartId = req.body.appartId;
  const gallery = [];

  for (let i = 0; i < uploads.length; i++) {
    gallery.push(uploads[i].filename);
  }

  try {
    const appartment = await Appartments.findById(appartId);
    if (appartment.gallery.length === 0) {
      appartment.gallery = gallery;
      appartment.save();
      console.log("added gallery to appartment");
      req.flash("message", "Appartment added successfully.");
      res.redirect("/admin");
    } else {
      updatedGallery = appartment.gallery.concat(gallery);
      appartment.gallery = updatedGallery;
      appartment.save();
      console.log("gallery updated");
      req.flash("message", "Appartment Gallery Updated Successfully");
      res.redirect("/admin/Appartments/editGallery/" + appartId);
    }
  } catch (err) {
    console.log(err);
  }
};

const postDeleteAppartmentGalleryImage = async (req, res) => {
  //recieve the gallery id and the image name
  const image = req.body.image;
  const appartId = req.body.id;

  try {
    const appartment = await Appartments.findById(appartId);
    const gallery = appartment.gallery;
    //removing the selected image from array
    gallery.splice(gallery.indexOf(image), 1);
    appartment.gallery = gallery;
    const imgDir = path.join(__dirname, '../../files/uploads/' + image);
    fs.unlink(imgDir, (err)=> {
      if(err) console.log(err);
    })
    await appartment.save();

    console.log("UPDATED Gallery!");
    res.redirect("/admin/Appartments/editGallery/" + appartId);

  }
  catch (err) {
    console.log(err);
    res.redirect("/admin/Appartments/editGallery/" + appartId);
  }
};

module.exports = {
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
};
