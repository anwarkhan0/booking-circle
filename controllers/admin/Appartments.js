const { delImg, delMultImages } = require("../../util/file");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

//models
const Areas = require("../../models/Location");
const Appartments = require("../../models/Appartment");
const appartmentsHouses = (req, res, next) => {
  Areas.find()
    .then((areas) => {
      res.render("../Admin/views/pages/Appartments/addAppartment", {
        areas: areas,
        pageTitle: "add appartment",
        path: "/Appartments/add-appartment",
        oldInput: {
          name: "",
          price: "",
          contact: "",
          parking: "",
          area: "",
          appartmentType: "",
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
        aparts: appartments,
        pageTitle: "Appartments List",
        path: "/Appartments/appartment-list",
      });
    })
    .catch((err) => console.log(err));
};

const appartmentBookingsList = (req, res, next) => {
  Appartments.find()
    .then((appartments) => {
      res.render("../Admin/views/pages/Appartments/bookingsList", {
        appartments: appartments,
        flashMessage: req.flash("message"),
      });
    })
    .catch((err) => console.log(err));
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
  const price = req.body.price;
  const contact = req.body.contact;
  const parking = req.body.parking;
  const area = req.body.area;
  const appartType = req.body.appartType;
  const address = req.body.address;
  const ownerName = req.body.ownerName;
  const ownerCNIC = req.body.ownerCNIC;
  const ownerContact = req.body.ownerContact;
  const loginEmail = req.body.loginEmail;
  const loginPassword = req.body.loginPassword;
  const description = req.body.description;
  const features = req.body.features;
  const videoUrl = req.body.videoUrl;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const areas = await Areas.find();
    return res.status(422).render("../views/pages/Appartments/addAppartment", {
      path: "/Appartments/addAppartment",
      pageTitle: "Appartment",
      areas: areas,
      flashMessage: errors.array()[0].msg,
      oldInput: {
        name: name,
        price: price,
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

  // generate salt to hash password
  const salt = await bcrypt.genSalt(16);
  // now we set user password to hashed password
  const hashedPassword = await bcrypt.hash(loginPassword, salt);

  const appartment = new Appartments({
    name: name,
    contact: contact,
    price: price,
    contact: contact,
    parking: parking,
    area: area,
    appartmentType: appartType,
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
    req.flash("message", "Appartment Added Successfully");
    res.redirect("/admin/Appartments/appartmentHouseList");
  } catch (err) {
    console.log(err);
  }
};

const postEditAppartment = async (req, res, next) => {
  const appartId = req.body.appartId;
  const name = req.body.appartName;
  const price = req.body.price;
  const contact = req.body.contact;
  const parking = req.body.parking;
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
  if (!errors.isEmpty()) {
    const areas = await Areas.find();
    return res
      .status(422)
      .render("../Admin/views/pages/Appartments/editAppartmentHouse", {
        areas: areas,
        flashMessage: errors.array()[0].msg,
        appart: {
          id: appartId,
          name: name,
          price: price,
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
    appart.price = price;
    appart.contact = contact;
    appart.parking = parking;
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
    res.redirect("/admin/Appartments/appartmentList");
  } catch (err) {
    console.log(err);
  }
};

const postDeleteAppartment = async (req, res) => {
  const appartId = req.body.id;
  try {
    const appartment = await Appartments.findById(appartId);
    const gallery = appartment.gallery;
    if (delMultImages(gallery)) {
      await Appartments.findByIdAndDelete(appartId);
      res.sendStatus(200);
      console.log("appartment deleted Successfully.");
    } else {
      throw "Something went wrong while deleting file.";
    }
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
      req.flash("message", "Gallery added To Appartment Successfully");
      res.redirect("/admin/Appartments/editGallery/" + appartId);
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

const postDeleteAppartmentGalleryImage = (req, res) => {
  //recieve the gallery id and the image name
  const image = req.body.image;
  const appartId = req.body.id;

  Appartments.findById(appartId)
    .then((appartment) => {
      gallery = appartment.gallery;
      //removing the selected image from array
      gallery.splice(gallery.indexOf(image), 1);
      appartment.gallery = gallery;
      return appartment.save();
    })
    .then((result) => {
      if (delImg(image)) {
        console.log("UPDATED Gallery!");
        res.redirect("/admin/Appartments/editGallery/" + appartId);
      } else {
        throw "Something went wrong while deleting file.";
      }
    })
    .catch((err) => console.log(err));
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