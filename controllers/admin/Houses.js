const { delImg, delMultImages } = require("../../util/file");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

//models
const Areas = require("../../models/Location");
const Houses = require("../../models/House");

const addHouse = (req, res, next) => {
    Areas.find()
      .then((areas) => {
        res.render("../Admin/views/pages/Houses/addHouse", {
          areas: areas,
          pageTitle: "add House",
          path: "/Houses/add-House",
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
  
  const editHouse = async (req, res, next) => {
  
    const id = req.params.id;
    try {
      const areas = await Areas.find();
      const house = await Houses.findById(id);
        res.render("../Admin/views/pages/Houses/edit", {
          flashMessage: '',
          areas: areas,
          house: house
        });
    } catch (err) {
      console.log(err);
      req.flash('message', 'something went wrong.')
      res.redirect('/admin');
    }
    
  };
  
  const housesList = (req, res, next) => {
    Houses.find()
      .then((houses) => {
        res.render("../Admin/views/pages/Houses/list", {
          houses: houses
        });
      })
      .catch((err) => {
        console.log(err);
        res.flash('message', 'something went wrong')
        res.redirect('/admin')
      })
  };
  
  const addHouseGallery = (req, res, next)=>{
    const id = req.params.id;
    res.render("../Admin/views/pages/Houses/addGallery", { houseId: id});
  }
  
  const housesGallery = (req, res, next) => {
    const houseId = req.params.id;
    Houses.findById(houseId)
      .then((appartment) => {
        if (!appartment) {
          res.redirect("/Appartments/addGallery/" + houseId);
        } else {
          res.render("../Admin/views/pages/Houses/gallery", {
            gallery: appartment.gallery,
            houseId: appartment.id,
            flashMessage: req.flash("message"),
          });
        }
      })
      .catch((err) => console.log(err));
  };
  // Post Houses
  const postAddHouse = async (req, res, next) => {
    const name = req.body.HouseName;
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
        path: "/Houses/addHouse",
        pageTitle: "House",
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
    
    const house = new Houses({
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
      await house.save();
      // console.log(result);
      console.log("House added");
      req.flash("message", "House Added Successfully");
      res.redirect("/admin/Appartments/appartmentHouseList");
    } catch (err) {
      console.log(err);
      res.redirect('/admin')
    }
  };
  
  const postEditHouse = async (req, res, next) => {
  
    const houseId = req.body.houseId;
    const name = req.body.houseName;
    const price = req.body.price;
    const contact = req.body.contact;
    const parking = req.body.parking;
    const area = req.body.area;
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
        .render("../Admin/views/pages/Houses/edit", {
          areas: areas,
          flashMessage: errors.array()[0].msg,
          house: {
            id: houseId,
            name: name,
            price: price,
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
  
    let salt=null;
    let hashedPassword=null;
    if (loginPassword.length > 0) {
  
      // generate salt to hash password
      salt = await bcrypt.genSalt(16);
      // now we set user password to hashed password
      hashedPassword = await bcrypt.hash(loginPassword, salt);
  
    } else {
      hashedPassword = oldLoginPassword;
    }
  
    try {
      const house = await Houses.findById(houseId);
      house.name = name;
      house.price = price;
      house.contact = contact;
      house.parking = parking;
      house.area = area;
      house.address = address;
      house.ownerName = ownerName;
      house.ownerCNIC = ownerCNIC;
      house.ownerContact = ownerContact;
      house.loginEmail = loginEmail;
      house.loginPassword = hashedPassword;
      house.availibilityStatus = availibilityStatus;
      house.description = description;
      house.features = features;
      house.videoUrl = videoUrl;
      await house.save();
      console.log("UPDATED house!");
      req.flash("message", "House Data Updated Successfully");
      res.redirect("/admin/Houses/list");
    } catch (err) {
      console.log(err);
      req.flash('message', 'Something went wrong.');
      res.redirect('/admin')
    }
  };
  
  const postDeleteHouse = async (req, res) => {
    const appartId = req.body.id;
    try {
      const appartment = await Houses.findById(appartId);
      const gallery = appartment.gallery;
      if (delMultImages(gallery)) {
        await Houses.findByIdAndDelete(appartId);
        res.sendStatus(200);
        console.log("appartment deleted Successfully.");
      }else{
        throw 'Something went wrong while deleting file.'
      }
      
    } catch (err) {
      console.log(err);
      res.sendStatus(204);
    }
  };
  
  const postAddHouseGallery = async (req, res, next) => {
    const uploads = req.files;
    const appartId = req.body.houseId;
    const gallery = [];
  
    for (let i = 0; i < uploads.length; i++) {
      gallery.push(uploads[i].filename);
    }
  
    try {
      const appartment = await Houses.findById(appartId);
      if (appartment.gallery.length === 0) {
        appartment.gallery = gallery;
        appartment.save();
        console.log("added gallery to House");
        req.flash("message", "Gallery added To House Successfully");
        res.redirect("/admin/Houses/Gallery/" + appartId);
      } else {
        updatedGallery = appartment.gallery.concat(gallery);
        appartment.gallery = updatedGallery;
        appartment.save();
        console.log("gallery updated");
        req.flash("message", "House Gallery Updated Successfully");
        res.redirect("/admin/Houses/Gallery/" + appartId);
      }
    } catch (err) {
      console.log(err);
      req.flash('message', 'Something went wrong.');
      res.redirect('/admin');
    }
  };
  
  const postDeleteHouseGalleryImage = (req, res) => {
    //recieve the gallery id and the image name
    const image = req.body.image;
    const appartId = req.body.id;
  
    Houses.findById(appartId)
      .then((appartment) => {
        gallery = appartment.gallery;
        //removing the selected image from array
        gallery.splice(gallery.indexOf(image), 1);
        appartment.gallery = gallery;
        return appartment.save();
      })
      .then((result) => {
        if(delImg(image)){
          console.log("UPDATED Gallery!");
          res.redirect("/admin/Houses/Gallery/" + appartId);
        }else{
          throw 'Something went wrong while deleting file.'
        }
        
      })
      .catch((err) => {
        console.log(err);
        req.flash('message', err);
        res.redirect('/admin')
      });
  };

  module.exports = {
    addHouse,
    editHouse,
    housesGallery,
    addHouseGallery,
    postAddHouse,
    postEditHouse,
    postAddHouseGallery,
    postDeleteHouse,
    postDeleteHouseGalleryImage,
    housesList
  }