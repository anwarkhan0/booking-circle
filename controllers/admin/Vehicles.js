const { delImg, delMultImages } = require("../../util/file");
const { validationResult } = require("express-validator");

//models
const Areas = require("../../models/Location");
const Vehicles = require("../../models/Vehicles");
const vehicleCategory = require("../../models/vehicleCategory");
// Vehicle Category (New Data)
const addCategory = (req, res, next) => {
    res.render("../Admin/views/pages/VehiclesCategory/addCategory", {
      user: req.session.user,
      name: '',
      flashMessage: req.flash("message"),
    });
  };
  
  const categoryList = (req, res, next) => {
    vehicleCategory
      .find()
      .then((cats) => {
        if (!cats) {
          res.redirect("/");
        } else {
          res.render("../Admin/views/pages/VehiclesCategory/categoryList", {
            user: req.session.user,
            cats: cats,
            pageTitle: "list category",
            path: "/VehiclesCategory/category-list",
            flashMessage: req.flash("message"),
          });
        }
      })
      .catch((err) => console.log(err));
  };
  
  const editCategory = (req, res, next) => {
    const catId = req.params.id;
    vehicleCategory
      .findById(catId)
      .then((cat) => {
        if (!cat) {
          res.redirect("/");
        } else {
          res.render("../Admin/views/pages/VehiclesCategory/editCategory", {
            user: req.session.user,
            cat: cat,
            pageTitle: "edit category",
            path: "/VehiclesCategory/vehicleCategory",
            flashMessage: req.flash('message')
          });
        }
      })
      .catch((err) => console.log(err));
  };
  
  const postAddVehicleCategory = (req, res) => {
    const name = req.body.name;
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .render("../views/pages/vehiclesCategory/addCategory", {
          user: req.session.user,
          path: "/VehicleCategory/addCategory",
          pageTitle: "Vehicles Category",
          flashMessage: errors.array()[0].msg,
          name: name,
          validationErrors: errors.array(),
        });
    }
  
    const vehicleCat = new vehicleCategory({
      name: name,
    });
    vehicleCat
      .save()
      .then((result) => {
        // console.log(result);
        console.log("Added category");
        req.flash("message", "Vehicle Category Added Successfully");
        res.redirect("/admin/Vehicles/addVehicles");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  const postEditVehicleCategory = (req, res) => {
    const catId = req.body.id;
    const name = req.body.name;
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .render("../views/pages/vehiclesCategory/editCategory", {
          user: req.session.user,
          path: "/VehicleCategory/addCategory",
          pageTitle: "Vehicles Category",
          flashMessage: errors.array()[0].msg,
          cat: {
            id: catId,
            name: name
          },
          validationErrors: errors.array(),
        });
    }
  
    vehicleCategory
      .findById(catId)
      .then((cat) => {
        cat.name = name;
        return cat.save();
      })
      .then((result) => {
        console.log("cat updated");
        req.flash("message", "Categroy Modified Successfully");
        res.redirect("/VehiclesCategory/categoryList");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  // Vehicle
  const addVehicle = async (req, res, next) => {
    try {
      const areas = await Areas.find();
      const cats = await vehicleCategory.find();
      if (cats.length === 0) {
        console.log("could't find categories");
        res.redirect("/admin/VehiclesCategory/addCategory");
      } else {
        res.render("../Admin/views/pages/Vehicles/addVehicles", {
          user: req.session.user,
          areas: areas,
          cats: cats,
          pageTitle: "list category",
          path: "/VehiclesCategory/category-list",
          oldInput: {
            categoryId: "",
            categoryName: "",
            vehicleNo: "",
            model: "",
            seats: "",
            ownerName: "",
            ownerCNIC: "",
            ownerContact: "",
            ownerAddress: "",
            ownerArea: "",
            description: "",
            features: "",
            videoUrl: "",
          },
          flashMessage: req.flash("message"),
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  const vehicleList = (req, res, next) => {
    Vehicles.find()
      .then((vehicles) => {
        res.render("../Admin/views/pages/Vehicles/vehicleList", {
          user: req.session.user,
          vehicles: vehicles,
          pageTitle: "Vehicle List",
          path: "/Vehicles/vehicles-list",
          flashMessage: req.flash("message"),
        });
      })
      .catch((err) => console.log(err));
  };
  
  const vehiclesBookinglist = (req, res, next) => {
    Vehicles.find()
      .then((vehicles) => {
        res.render("../Admin/views/pages/Vehicles/bookingsList", {
          user: req.session.user,
          vehicles: vehicles,
          pageTitle: "Vehicle List",
          path: "/Vehicles/vehicles-list",
          flashMessage: req.flash("message"),
        });
      })
      .catch((err) => console.log(err));
  };
  
  const editVehicle = async (req, res, next) => {
    const id = req.params.id;
  
    try {
      const vehicle = await Vehicles.findById(id);
      const areas = await Areas.find();
      if (!vehicle) {
        console.log("no vehicle found");
        req.flash("message", "Vehicle Not Found");
        return res.redirect("/");
      }
  
      const cats = await vehicleCategory.find();
      res.render("../Admin/views/pages/Vehicles/editVehicle", {
        user: req.session.user,
        cats: cats,
        areas: areas,
        vehicle: vehicle,
        flashMessage: req.flash("message"),
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  const addVehicleGallery = (req, res, next) => {
    const vehicleId = req.params.id;
    res.render("../Admin/views/pages/Vehicles/addVehicleGallery", {
      user: req.session.user, vehicleId: vehicleId });
  };
  
  const editVehicleGallery = (req, res, next) => {
    const vehicleId = req.params.id;
    Vehicles.findById(vehicleId)
      .then((vehicle) => {
        if (!vehicle) {
          res.redirect("/Vehicles/addVehicleGallery/" + vehicleId);
        } else {
          res.render("../Admin/views/pages/Vehicles/editVehicleGallery", {
            user: req.session.user,
            gallery: vehicle.gallery,
            vehicleId: vehicle.id,
            pageTitle: "Gallery List",
            path: "/Vehicle/gallery-list",
            flashMessage: req.flash("message"),
          });
        }
      })
      .catch((err) => console.log(err));
  };
  
  const postAddVehicle = async (req, res) => {
  
    const category = JSON.parse(req.body.category);
    const vehicleNo = req.body.vehicleNo;
    const model = req.body.model;
    const seats = req.body.seats;
    const serviceArea = req.body.serviceArea;
    const ownerName = req.body.ownerName;
    const ownerCNIC = req.body.ownerCNIC;
    const ownerContact = req.body.ownerContact;
    const ownerAddress = req.body.ownerAddress;
    const ownerArea = req.body.ownerArea;
    const description = req.body.description;
    const features = req.body.features;
    const videoUrl = req.body.videoUrl;
  
    const errors = validationResult(req);
    const areas = await Areas.find();
    const cats = await vehicleCategory.find();
    if (!errors.isEmpty()) {
      return res.status(422).render("../Admin/views/pages/Vehicles/addVehicles", {
        user: req.session.user,
        path: "/Vehicles/addVehicle",
        pageTitle: "Vehicles",
        flashMessage: errors.array()[0].msg,
        cats: cats,
        areas: areas,
        oldInput: {
          categoryId: category.id,
          categoryName: category.name,
          vehicleNo: vehicleNo,
          model: model,
          seats: seats,
          serviceArea: serviceArea,
          ownerName: ownerName,
          ownerCNIC: ownerCNIC,
          ownerContact: ownerContact,
          ownerAddress: ownerAddress,
          ownerArea: ownerArea,
          description: description,
          features: features,
          videoUrl: videoUrl,
        },
        validationErrors: errors.array(),
      });
    }
    
    const vehicle = new Vehicles({
      categoryId: category.id,
      categoryName: category.name,
      vehicleNo: vehicleNo,
      model: model,
      seats: seats,
      serviceArea: serviceArea,
      ownerName: ownerName,
      ownerCNIC: ownerCNIC,
      ownerContact: ownerContact,
      ownerArea: ownerArea,
      ownerAddress: ownerAddress,
      description: description,
      features: features,
      videoUrl: videoUrl,
    });
  
    try {
      await vehicle.save();
      console.log("Added vehicle");
      req.flash("message", "Vehicle Added Successfully");
      res.redirect("/admin");
    } catch (err) {
      console.log(err);
      return res.status(422).render("../Admin/views/pages/Vehicles/addVehicles", {
        user: req.session.user,
        path: "/Vehicles/addVehicle",
        pageTitle: "Vehicles",
        flashMessage: 'Something went wrong.',
        cats: cats,
        areas: areas,
        oldInput: {
          categoryId: category.id,
          categoryName: category.name,
          vehicleNo: vehicleNo,
          model: model,
          seats: seats,
          serviceArea: serviceArea,
          ownerName: ownerName,
          ownerCNIC: ownerCNIC,
          ownerContact: ownerContact,
          ownerAddress: ownerAddress,
          ownerArea: ownerArea,
          description: description,
          features: features,
          videoUrl: videoUrl,
        },
        validationErrors: errors.array(),
      });
    }
  };
  
  const postEditVehicle = async (req, res) => {
    const id = req.body.id;
    const category = JSON.parse(req.body.category);
    const vehicleNo = req.body.vehicleNo;
    const model = req.body.model;
    const seats = req.body.seats;
    const serviceArea = req.body.serviceArea;
    const ownerName = req.body.ownerName;
    const ownerCNIC = req.body.ownerCNIC;
    const ownerContact = req.body.ownerContact;
    const ownerAddress = req.body.ownerAddress;
    const ownerArea = req.body.ownerArea;
    const description = req.body.description;
    const features = req.body.features;
    const videoUrl = req.body.videoUrl;
  
    const errors = validationResult(req);
    const cats = await vehicleCategory.find();
    const areas = await Areas.find();
    if (!errors.isEmpty()) {
  
      return res.status(422).render("../Admin/views/pages/Vehicles/editVehicle", {
        user: req.session.user,
        path: "/Vehicles/addVehicle",
        pageTitle: "Vehicles",
        flashMessage: errors.array()[0].msg,
        cats: cats,
        areas: areas,
        vehicle: {
          id: id,
          categoryId: category.id,
          categoryName: category.name,
          vehicleNo: vehicleNo,
          model: model,
          seats: seats,
          serviceArea: serviceArea,
          ownerName: ownerName,
          ownerCNIC: ownerCNIC,
          ownerContact: ownerContact,
          ownerArea: ownerArea,
          ownerAddress: ownerAddress,
          description: description,
          features: features,
          videoUrl: videoUrl,
        },
        validationErrors: errors.array(),
      });
    }
  
    try {
      const vehicle = await Vehicles.findById(id);
      vehicle.categoryId = category.id;
      vehicle.categoryName = category.name;
      vehicle.vehicleNo = vehicleNo;
      vehicle.model = model;
      vehicle.seats = seats;
      vehicle.serviceArea = serviceArea;
      vehicle.ownerName = ownerName;
      vehicle.ownerCNIC = ownerCNIC;
      vehicle.ownerContact = ownerContact;
      vehicle.ownerArea = ownerArea;
      vehicle.ownerAddress = ownerAddress;
      vehicle.description = description;
      vehicle.features = features;
      vehicle.videoUrl = videoUrl;
  
      await vehicle.save();
  
      console.log("Updated vehicle");
      req.flash("message", "Vehicle Data Updated Successfully");
      res.redirect("/admin");
    } catch (err) {
      console.log(err);
      return res.status(422).render("../Admin/views/pages/Vehicles/editVehicle", {
        user: req.session.user,
        path: "/Vehicles/addVehicle",
        pageTitle: "Vehicles",
        flashMessage: errors.array()[0].msg,
        cats: cats,
        areas: areas,
        vehicle: {
          id: id,
          categoryId: category.id,
          categoryName: category.name,
          vehicleNo: vehicleNo,
          model: model,
          seats: seats,
          serviceArea: serviceArea,
          ownerName: ownerName,
          ownerCNIC: ownerCNIC,
          ownerContact: ownerContact,
          ownerArea: ownerArea,
          ownerAddress: ownerAddress,
          description: description,
          features: features,
          videoUrl: videoUrl,
        },
        validationErrors: errors.array(),
      });
    }
  };
  
  const postDeleteVehicle = async (req, res) => {
    const vehicleId = req.body.id;
    try {
      const vehicle = await Vehicles.findById(vehicleId);
      const gallery = vehicle.gallery;
      await Vehicles.findByIdAndDelete(vehicleId);
      delMultImages(gallery);
      res.sendStatus(200);
      console.log("vehicle deleted");
    } catch (err) {
      console.log(err);
      res.sendStatus(204);
    }
  };
  
  const postAddVehicleGallery = async (req, res) => {
    const uploads = req.files;
    const vehicleId = req.body.vehicleId;
    const gallery = [];
  
    for (let i = 0; i < uploads.length; i++) {
      gallery.push(uploads[i].filename);
    }
  
    try {
      const vehicle = await Vehicles.findById(vehicleId);
      if (vehicle.gallery.length === 0) {
        vehicle.gallery = gallery;
        vehicle.save();
        console.log("added gallery to vehicle");
        req.flash("message", "Vehicle Gallery Added Successfully");
        res.redirect("/admin/Vehicles/editVehicleGallery/" + vehicleId);
      } else {
        updatedGallery = vehicle.gallery.concat(gallery);
        vehicle.gallery = updatedGallery;
        vehicle.save();
        console.log("gallery updated");
        req.flash("message", "Vehicle Gallery Updated Successfully");
        res.redirect("/admin/Vehicles/editVehicleGallery/" + vehicleId);
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  const postDeleteVehiclesGalleryImage = async (req, res) => {
    const image = req.body.image;
    const vehicleId = req.body.id;
  
    try {
      const vehicle = await Vehicles.findById(vehicleId);
      gallery = vehicle.gallery;
      if (delImg(image)) {
        //removing the selected image from array
        gallery.splice(gallery.indexOf(image), 1);
        vehicle.gallery = gallery;
        await vehicle.save();
        console.log("UPDATED Gallery!");
        res.sendStatus(200);
      } else {
        throw "Something went wrong while deleting file.";
      }
      
    } catch (err) {
      console.log(err);
      res.sendStatus(204);
    }
  };

  module.exports = {
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
  }