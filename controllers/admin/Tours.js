const { delImg, delMultImages } = require("../../util/file");
const { validationResult } = require("express-validator");
const moment = require('moment');

//models
const Areas = require("../../models/Location");
const Tours = require("../../models/Tour");
const Hotels = require("../../models/Hotel");

const addTour = async (req, res, next) => {
    try {
      const hotels = await Hotels.find();
      const areas = await Areas.find();
      res.render("../Admin/views/pages/Tours/addTours", {
        user: req.session.user,
        areas: areas,
        hotels: hotels,
        flashMessage: req.flash('message'),
        oldInput: {
          tourType: '',
          startDate: '',
          endDate: '',
          fromPlace: '',
          toPlace: '',
          pickupLocation: '',
          dropoffLocation: '',
          stayHotel: '',
          days: '',
          nights: '',
          availableSeats: '',
          chargesPerHead: '',
          description: '',
          videoUrl: '',
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  const tourList = (req, res, next) => {
    Tours.find()
      .then((tours) => {
        res.render("../Admin/views/pages/Tours/toursList", {
          user: req.session.user,
          tours: tours,
          pageTitle: "Tours List",
          path: "/Tours/tour-list",
          flashMessage: req.flash("message"),
        });
      })
      .catch((err) => console.log(err));
  };
  
  const viewTour = (req, res, next) => {
    const tourId = req.params.id;
    Tours.findById(tourId)
      .then((tour) => {
        if (!tour) {
          return res.redirect("/");
        }
        res.render("../Admin/views/pages/Tours/viewTour", {
          user: req.session.user,
          pageTitle: "View Tour",
          path: "/tours/tour",
          tour: tour,
        });
      })
      .catch((err) => console.log(err));
  };
  
  const addTourGallery = (req, res, next)=>{
    const tourId = req.params.id;
    res.render("../Admin/views/pages/Tours/addGallery", { user: req.session.user, tourId: tourId });
  }
  
  const tourGallery = (req, res, next) => {
    const tourId = req.params.id;
    Tours.findById(tourId)
      .then((tour) => {
        if (tour.gallery.length == 0) {
          res.redirect("/admin/Tours/addGallery/" + tourId);
        } else {
          res.render("../Admin/views/pages/Tours/gallery", {
            user: req.session.user,
            gallery: tour.gallery,
            tourId: tour.id,
            pageTitle: "Gallery List",
            path: "/Vehicle/gallery-list",
            flashMessage: req.flash("message"),
          });
        }
      })
      .catch((err) => {
        console.log(err);
        req.flash('message', 'Something went wrong.');
        res.redirect('/admin')
      });
  };
  
  const postAddTourGallery = async (req, res) => {
    const uploads = req.files;
    const tourId = req.body.tourId;
    const gallery = [];
  
    for (let i = 0; i < uploads.length; i++) {
      gallery.push(uploads[i].filename);
    }
  
    try {
      const tour = await Tours.findById(tourId);
      if (tour.gallery.length === 0) {
        tour.gallery = gallery;
        tour.save();
        console.log("added gallery to tour");
        req.flash("message", "tour Gallery Added Successfully");
        res.redirect("/admin/Tours/gallery/" + tourId);
      } else {
        updatedGallery = tour.gallery.concat(gallery);
        tour.gallery = updatedGallery;
        tour.save();
        console.log("gallery updated");
        req.flash("message", "tour Gallery Updated Successfully");
        res.redirect("/admin/Tours/gallery/" + tourId);
      }
    } catch (err) {
      req.flash('message', 'Something went wrong.')
      console.log(err);
      res.redirect('/admin');
    }
  };
  
  const postDeleteTourGalleryImage = async (req, res) => {
    const image = req.body.image;
    const tourId = req.body.id;
  
    try {
      const tour = await Tours.findById(tourId);
      gallery = tour.gallery;
      if (delImg(image)) {
        //removing the selected image from array
        gallery.splice(gallery.indexOf(image), 1);
        tour.gallery = gallery;
        await tour.save();
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
  
  
  const editTour = async (req, res, next) => {
    try {
      const areas = await Areas.find();
      const hotels = await Hotels.find();
      const tourId = req.params.id;
      Tours.findById(tourId).then((tour) => {
        res.render("../Admin/views/pages/Tours/editTour", {
          user: req.session.user,
          pageTitle: "Edit Tour",
          path: "/admin/edit-tour",
          tour: tour,
          areas: areas,
          hotels: hotels,
        });
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  const postAddTour = async (req, res) => {
    const tourType = req.body.tourType;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const fromPlace = JSON.parse(req.body.fromPlace);
    const toPlace = JSON.parse(req.body.toPlace);
    const pickupLoc = JSON.parse(req.body.pickupLoc);
    const dropoffLoc = JSON.parse(req.body.dropoffLoc);
    const stayHotel = JSON.parse(req.body.stayHotel);
    const days = req.body.days;
    const nights = req.body.nights;
    const availableSeats = req.body.seats;
    const chargesPerHead = req.body.charges;
    const description = req.body.desc;
    const videoUrl = req.body.videoUrl;
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
      const areas = await Areas.find();
      const hotels = await Hotels.find();
      return res.status(422).render("../views/pages/Tours/addTours", {
        user: req.session.user,
        flashMessage: errors.array()[0].msg,
        areas: areas,
        hotels: hotels,
        oldInput: {
          tourType: tourType,
          startDate: startDate,
          endDate: endDate,
          fromPlace: fromPlace.areaName,
          toPlace: toPlace.areaName,
          pickupLocation: pickupLoc.areaName,
          dropoffLocation: dropoffLoc.areaName,
          stayHotel: stayHotel.hotelName,
          days: days,
          nights: nights,
          availableSeats: availableSeats,
          chargesPerHead: chargesPerHead,
          description: description,
          videoUrl: videoUrl,
        },
        validationErrors: errors.array(),
      });
    }
  
    const tour = new Tours({
      tourType: tourType,
      startDate: startDate,
      endDate: endDate,
      fromPlace: fromPlace.areaName,
      toPlace: toPlace.areaName,
      pickupLocation: pickupLoc.areaName,
      dropoffLocation: dropoffLoc.areaName,
      stayHotel: stayHotel.hotelName,
      days: days,
      nights: nights,
      availableSeats: availableSeats,
      chargesPerHead: chargesPerHead,
      description: description,
      videoUrl: videoUrl,
    });
    tour
      .save()
      .then((result) => {
        // console.log(result);
        console.log("Added Tour");
        req.flash("message", "Tour Added Successfully");
        res.redirect("/admin");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  const postEditTour = (req, res, next) => {
    const tourId = req.body.tourId;
    const tourType = req.body.tourType;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const fromPlace = JSON.parse(req.body.fromPlace);
    const toPlace = JSON.parse(req.body.toPlace);
    const pickupLoc = JSON.parse(req.body.pickupLoc);
    const dropoffLoc = JSON.parse(req.body.dropoffLoc);
    const stayHotel = JSON.parse(req.body.stayHotel);
    const days = req.body.days;
    const nights = req.body.nights;
    const availableSeats = req.body.seats;
    const chargesPerHead = req.body.charges;
    const description = req.body.desc;
    const videoUrl = req.body.videoUrl;
  
    Tours.findById(tourId)
      .then((tour) => {
        tour.tourType = tourType;
        tour.startDate = startDate;
        tour.endDate = endDate;
        tour.fromPlace = fromPlace.areaName;
        tour.toPlace = toPlace.areaName;
        tour.pickupLocation = pickupLoc.areaName;
        tour.dropoffLocation = dropoffLoc.areaName;
        tour.stayHotel = stayHotel.hotelName;
        tour.days = days;
        tour.nights = nights;
        tour.availableSeats = availableSeats;
        tour.chargesPerHead = chargesPerHead;
        tour.description = description;
        tour.videoUrl = videoUrl;
        return tour.save();
      })
      .then((result) => {
        console.log("UPDATED Tour!");
        req.flash("message", "Tour Data Updated Successfully");
        res.redirect("/Tours/toursList");
      })
      .catch((err) => console.log(err));
  };
  
  const postDeleteTour = (req, res) => {
    const tourId = req.body.id;
    Tours.findByIdAndDelete(tourId)
      .then((result) => {
        console.log("Tours deleted");
        res.sendStatus(200);
      })
      .catch((err) => res.sendStatus(204));
  };

  module.exports = {
    addTour,
    tourList,
    viewTour,
    editTour,
    addTourGallery,
    tourGallery,
    postAddTourGallery,
    postDeleteTourGalleryImage,
    postAddTour,
    postEditTour,
    postDeleteTour
  }