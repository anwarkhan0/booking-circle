const { delImg, delMultImages } = require("../../util/file");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const moment = require('moment');

//models
const Areas = require("../../models/Location");
const Houses = require("../../models/House");

const addHouse = (req, res, next) => {
    Areas.find()
      .then((areas) => {
        res.render("../Admin/views/pages/Houses/addHouse", {
          user: req.session.user,
          areas: areas,
          pageTitle: "add House",
          path: "/Houses/add-House",
          oldInput: {
            name: "",
            price: "",
            contact: "",
            parking: "",
            area: "",
            bedRooms: bedRooms,
            baths: '',
            wifi: '',
            kitchen: '',
            secuirity: '',
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
          user: req.session.user,
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
          user: req.session.user,
          houses: houses
        });
      })
      .catch((err) => {
        console.log(err);
        res.flash('message', 'something went wrong')
        res.redirect('/admin')
      })
  };

  const houseBookings = async (req, res)=>{
    const houses = await Houses.find();
    res.render("../Admin/views/pages/Houses/bookings", {
      user: req.session.user,
      houses: houses,
      moment: moment,
      flashMessage: req.flash("message"),
    });
  }
  
  const addHouseGallery = (req, res, next)=>{
    const id = req.params.id;
    res.render("../Admin/views/pages/Houses/addGallery", { user: req.session.user, houseId: id});
  }
  
  const housesGallery = (req, res, next) => {
    const houseId = req.params.id;
    Houses.findById(houseId)
      .then((appartment) => {
        if (!appartment) {
          res.redirect("/Appartments/addGallery/" + houseId);
        } else {
          res.render("../Admin/views/pages/Houses/gallery", {
            user: req.session.user,
            gallery: appartment.gallery,
            houseId: appartment.id,
            house: appartment.name,
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
    const bedRooms = Number(req.body.bedRooms);
    const baths = Number(req.body.baths);
    const area = req.body.area;
    const wifi = req.body.wifi ? true : false;
    const parking = req.body.parking ? true : false;
    const kitchen = req.body.kitchen ? true : false;
    const secuirity = req.body.secuirity ? true : false;
    const location = req.body.location;
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
    const areas = await Areas.find();
    if (!errors.isEmpty()) {
      
      return res.status(422).render("../Admin/views/pages/Houses/addHouse", {
        user: req.session.user,
        path: "/Houses/addHouse",
        pageTitle: "House",
        areas: areas,
        flashMessage: errors.array()[0].msg,
        oldInput: {
          name: name,
          price: price,
          contact: contact,
          bedRooms: bedRooms,
          baths: baths,
          area: area,
          wifi: wifi,
          parking: parking,
          kitchen: kitchen,
          secuirity: secuirity,
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
      charges: price,
      contact: contact,
      bedRooms: bedRooms,
      baths: baths,
      area: area,
      wifi: wifi,
      parking: parking,
      kitchen: kitchen,
      secuirity: secuirity,
      location: location,
      address: address,
      owner: {
        name: ownerName,
        cnic: ownerCNIC,
        contact: ownerContact,
        email: loginEmail,
        password: hashedPassword,
      },
      description: description,
      features: features,
      videoUrl: videoUrl,
    });
  
    try {
      await house.save();
      // console.log(result);
      console.log("House added");
      req.flash("message", "House Added Successfully");
      res.redirect("/admin/Houses/addGallery/" + house.id);
    } catch (err) {
      console.log(err);
      return res.status(422).render("../Admin/views/pages/Houses/addHouse", {
        user: req.session.user,
        path: "/Houses/addHouse",
        pageTitle: "House",
        areas: areas,
        flashMessage: err._message,
        oldInput: {
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
  };
  
  const postEditHouse = async (req, res, next) => {
  
    const houseId = req.body.houseId;
    const name = req.body.houseName;
    const price = req.body.price;
    const contact = req.body.contact;
    const bedRooms = Number(req.body.bedRooms);
    const baths = Number(req.body.baths);
    const area = req.body.area;
    const wifi = req.body.wifi ? true : false;
    const parking = req.body.parking ? true : false;
    const kitchen = req.body.kitchen ? true : false;
    const secuirity = req.body.secuirity ? true : false;
    const location = req.body.location;
    const address = req.body.address;
    const ownerName = req.body.ownerName;
    const ownerCNIC = req.body.ownerCNIC;
    const ownerContact = req.body.ownerContact;
    const loginEmail = req.body.loginEmail;
    const loginPassword = req.body.loginPassword;
    const oldLoginPassword = req.body.oldPassword;
    const description = req.body.description;
    const features = req.body.features;
    const videoUrl = req.body.videoUrl;
  
    const errors = validationResult(req);
    const areas = await Areas.find();
    if (!errors.isEmpty()) {
      
      return res
        .status(422)
        .render("../Admin/views/pages/Houses/edit", {
          user: req.session.user,
          areas: areas,
          flashMessage: errors.array()[0].msg,
          house: {
            id: houseId,
            name: name,
            price: price,
            contact: contact,
            wifi: wifi,
            parking: parking,
            kitchen: kitchen,
            secuirity: secuirity,
            area: area,
            address: address,
            owner : {
              name: ownerName,
              cnic: ownerCNIC,
              contact: ownerContact,
              email: loginEmail,
              password: loginPassword
            },
            description: description,
            features: features,
            videoUrl: videoUrl,
          },
          validationErrors: errors.array(),
        });
    }
  
    
    try {
      let hashedPassword;
      
      if (loginPassword.length > 0) {
        // generate salt to hash password
        const salt = await bcrypt.genSalt(16);
        // now we set user password to hashed password
        hashedPassword = await bcrypt.hash(loginPassword, salt);
      } else {
        hashedPassword = oldLoginPassword;
      }
      const house = await Houses.findById(houseId);
      house.name = name;
      house.charges = price;
      house.contact = contact;
      house.bedRooms = bedRooms;
      house.baths = baths;
      house.area = area;
      house.wifi = wifi;
      house.parking = parking;
      house.kitchen = kitchen;
      house.secuirity = secuirity;
      house.location = location;
      house.address = address;
      house.owner = {
        name: ownerName,
        cnic: ownerCNIC,
        contact: ownerContact,
        email: loginEmail,
        password: hashedPassword
      }
      house.description = description;
      house.features = features;
      house.videoUrl = videoUrl;
      await house.save();
      console.log("UPDATED house!");
      req.flash("message", "House Data Updated Successfully");
      res.redirect("/admin/Houses/list");
    } catch (err) {
      console.log(err);
      return res
        .status(422)
        .render("../Admin/views/pages/Houses/edit", {
          user: req.session.user,
          areas: areas,
          flashMessage: err,
          house: {
            id: houseId,
            name: name,
            price: price,
            contact: contact,
            wifi: wifi,
            parking: parking,
            kitchen: kitchen,
            secuirity: secuirity,
            area: area,
            address: address,
            owner : {
              name: ownerName,
              cnic: ownerCNIC,
              contact: ownerContact,
              email: loginEmail,
              password: loginPassword
            },
            description: description,
            features: features,
            videoUrl: videoUrl,
          }
        });
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
    const houseId = req.body.houseId;
    const gallery = [];
  
    for (let i = 0; i < uploads.length; i++) {
      gallery.push(uploads[i].filename);
    }
    
    try {
      const house = await Houses.findById(houseId);
      house.gallery = gallery;
      await house.save();
      console.log("added gallery to House");
      req.flash("message", "Gallery added To House Successfully");
      res.redirect("/admin/Houses/Gallery/" + house.id);
    } catch (err) {
      console.log(err);
      req.flash("message", err._message);
      res.redirect("/admin/Houses/addGallery/" + houseId);
    }
  };

  const updateHouseGallery = async (req, res) => {
    const uploads = req.files;
    const houseId = req.body.houseId;
    const gallery = [];
  
    for (let i = 0; i < uploads.length; i++) {
      gallery.push(uploads[i].filename);
    }

    try {
      const house = await Houses.findById(houseId);
      const updatedGallery = house.gallery.concat(gallery);
      house.gallery = updatedGallery;
      await house.save();
      console.log("gallery updated");
      req.flash("message", "House Gallery Updated Successfully");
      res.redirect("/admin/Houses/Gallery/" + houseId);
    } catch (err) {
      console.log(err);
      res.redirect("/admin/Houses/Gallery/" + houseId);
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
    houseBookings,
    housesGallery,
    addHouseGallery,
    postAddHouse,
    postEditHouse,
    postAddHouseGallery,
    postDeleteHouse,
    postDeleteHouseGalleryImage,
    housesList,
    updateHouseGallery
  }