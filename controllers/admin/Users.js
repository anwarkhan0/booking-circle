const { delImg, delMultImages } = require("../../util/file");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

//models
const Areas = require("../../models/Location");
const sliderGallery = require("../../models/SliderGallery");
const Users = require("../../models/SystemUsers");
const Feedbacks = require('../../models/Feedback');
const Messages = require('../../models/Message');
const UsersModel = require('../../models/usersModel');

const login = (req, res, next) => {
    res.render("../Admin/views/login", {
      layout: "../Admin/views/login",
      oldInput: {
        email: "",
        passsword: "",
      },
      flashMessage: req.flash("message"),
    });
  };
  
  //postLogin
  const postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("../views/login", {
        path: "/login",
        pageTitle: "Login",
        layout: "adminLogin",
        flashMessage: errors.array()[0].msg,
        oldInput: {
          email: email,
          password: password,
        },
        validationErrors: errors.array(),
      });
    }
    Users.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("message", "invalid email");
          return res.redirect("/admin/login");
        }
        bcrypt
          .compare(password, user.password)
          .then((doMatch) => {
            if (doMatch) {
              req.session.adminLoggedIn = true;
              req.session.admin = user;
              req.flash("message", "Welcome " + user.name);
              return req.session.save((err) => {
                console.log(err);
                res.redirect("/admin");
              });
            }
            req.flash("message", "invalid password");
            res.redirect("/admin/login");
          })
          .catch((err) => {
            console.log(err);
            req.flash("message", "invalid email or password");
            res.redirect("/admin/login");
          });
      })
      .catch((err) => {
        console.log(err);
        req.flash('message', 'Something went wrong Please try Again.');
        res.redirect('/admin/login');
      });
  };
  
  const logout = (req, res, next) => {
    req.session.destroy((err) => {
      console.log(err);
      res.redirect("/");
    });
  };
  
  // Dashboard
  const indexView = (req, res, next) => {
    const message = req.flash("message");
    res.render("../Admin/views/pages/Home/home", { flashMessage: message });
  };

  const customersList = async (req, res, next) => {
    const customers = await UsersModel.find();
    res.render("../Admin/views/pages/Customers/customer", {layout: '../Admin/views/layout', customers: customers});
  };
  
  const editMembership = (req, res, next) => {
    res.render("../Admin/views/pages/Customers/editMembership");
  };
  
  const viewCustomer = async (req, res, next) => {
    const id = req.params.id;
    const user = await UsersModel.findById(id);
    res.render("../Admin/views/pages/Customers/viewCustomer", {customer: user});
  };
  
  const delCustomer = async (req, res, next) => {
    const id = req.body.id;
    
    try {
      const users = await UsersModel.find()
      await UsersModel.findByIdAndDelete(id);
      console.log('deleted Successfully');
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.sendStatus(204);
    }
    
  };
  // Bundles and Offers
const addBundle = (req, res, next) => {
    res.render("../Admin/views/pages/BundleOffers/addBundle");
  };
  
  const bundleList = (req, res, next) => {
    res.render("../Admin/views/pages/BundleOffers/bundlesList");
  };
  
  // Slider Images
  const addImagesSlider = (req, res, next) => {
    const galleryId = req.params.id;
    res.render("../Admin/views/pages/SliderImages/addSliderImages", { galleryId: galleryId });
  };
  
  const sliderImages = (req, res, next) => {
    sliderGallery
      .findOne()
      .then((gallery) => {
        if (!gallery) {
          res.redirect("/admin/SliderImages/addSliderImages/none");
        }
        res.render("../Admin/views/pages/SliderImages/sliderImagesList", {
          gallery: gallery,
          flashMessage: req.flash("message"),
        });
      })
      .catch((err) => console.log(err));
  };
  
  const postAddSliderImages = async (req, res) => {
    const uploads = req.files;
    const galleryId = req.body.galleryId;
    const sliderImages = [];
  
    for (let i = 0; i < uploads.length; i++) {
      sliderImages.push(uploads[i].filename);
    }
  
    const filter = { id: galleryId };
    const update = { $push: { images: sliderImages } };
  
    const existingGallery = await sliderGallery.findOneAndUpdate(filter, update, {
      new: true,
    });
    if (existingGallery) {
      console.log("the gallery updated");
      req.flash("message", "Slider Gallery Updated Successfully");
      res.redirect("/admin/SliderImages/sliderImagesList");
    } else {
      const gallery = new sliderGallery({
        images: sliderImages,
      });
      gallery
        .save()
        .then((result) => {
          // console.log(result);
          console.log("Created Gallery");
          req.flash("message", "Slider Gallery Added Successfully");
          res.redirect("/admin/SliderImages/sliderImagesList");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  
  const postDeleteSliderGalleryImage = (req, res) => {
    const galleryId = req.body.id;
    const image = req.body.image;
    let images = [];
    sliderGallery
      .findById(galleryId)
      .then((gallery) => {
        images = gallery.images;
        images.splice(images.indexOf(image), 1);
        if (images.length === 0) {
          return sliderGallery.findByIdAndDelete(galleryId);
        } else {
          return gallery.save();
        }
      })
      .then((result) => {
        if (delImg(image)) {
          console.log("UPDATED Slider Gallery!");
          if (images.length === 0) {
            res.redirect("/");
          } else {
            res.redirect("/admin/SliderImages/sliderImagesList");
          }
        }else{
          throw 'Something went wrong while deleting Image.'
        }
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/admin/SliderImages/sliderImagesList");
      });
  };
  
  // Customer Feedback
  const feedback = async (req, res, next) => {
    const feedbacks = await Feedbacks.find();
    res.render("../Admin/views/pages/Feedback/customerFeedback", {feedbacks: feedbacks});
  };
  
  const viewFeedbackQuery = async (req, res, next) => {
    const id = req.params.id;
    const feedback = await Feedbacks.findById(id);
    res.render("../Admin/views/pages/Feedback/viewFeedbackQuery",{
      feedback: feedback
    });
  };
  
  //Messages
  const msgList = async (req, res)=>{
    const msgs = await Messages.find();
    res.render("../Admin/views/pages/Messages/messagesList",{
      messages: msgs
    });
  }
  
  const viewMessage = async (req, res, next) => {
    const id = req.params.id;
    const message = await Messages.findById(id);
    res.render("../Admin/views/pages/Messages/viewMessage",{
      message: message
    });
  };
  
  
  // Users
  const addUser = (req, res, next) => {
    Areas.find()
      .then((areas) => {
        res.render("../Admin/views/pages/Users/addUser", {
          areas: areas,
          oldInput: {
            name: "",
            contact: "",
            CNIC: "",
            location: "",
            address: "",
            access: 0,
            email: "",
            password: "",
          },
          flashMessage: req.flash("message"),
        });
      })
      .catch((err) => console.log(err));
  };
  
  const userList = async (req, res, next) => {
    Users.find()
      .then((users) => {
        res.render("../Admin/views/pages/Users/usersList", {
          users: users,
          activeUser: req.session,
          pageTitle: "Users List",
          path: "/Users/users-list",
        });
      })
      .catch((err) => console.log(err));
  };
  
  const editUser = async (req, res, next) => {
    const userId = req.params.id;
  
    try {
      const areas = await Areas.find();
      const user = await Users.findById(userId);
      res.render("../Admin/views/pages/Users/editUser", {
        user: user,
        areas: areas,
        pageTitle: "Edit User",
        path: "/Users/edit-user",
        flashMessage: req.flash("message"),
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  const postAddUser = async (req, res) => {
    const name = req.body.name;
    const contact = req.body.contact;
    const cnic = req.body.cnic;
    const city = req.body.city;
    const address = req.body.address;
    const access = req.body.access;
    const email = req.body.email;
    const password = req.body.password;
  
    const areas = await Areas.find();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("../Admin/views/pages/Users/addUser", {
        path: "/Users/addUser",
        pageTitle: "Add User",
        flashMessage: errors.array()[0].msg,
        areas: areas,
        oldInput: {
          name: name,
          contact: contact,
          CNIC: cnic,
          location: city,
          address: address,
          access: access,
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
  
    const user = new Users({
      name: name,
      contact: contact,
      CNIC: cnic,
      location: city,
      address: address,
      access: access,
      email: email,
      password: hashedPassword,
    });
  
    try {
      await user.save();
      console.log("Added user");
      req.flash("message", "User Added Successfully");
      res.redirect("/admin");
    } catch (err) {
  
      console.log(err);
      res.status(422).render("../Admin/views/pages/Users/addUser", {
        path: "/Users/addUser",
        pageTitle: "Add User",
        flashMessage: 'Something went wrong.',
        areas: areas,
        oldInput: {
          name: name,
          contact: contact,
          CNIC: cnic,
          location: city,
          address: address,
          access: access,
          email: email,
          password: password,
        },
        validationErrors: errors.array(),
      });
    }
  
  };
  
  const postEditUser = async (req, res) => {
    const userId = req.body.userId;
    const name = req.body.name;
    const contact = req.body.contact;
    const cnic = req.body.cnic;
    const city = req.body.city;
    const address = req.body.address;
    const access = Number(req.body.access);
    const email = req.body.email;
    const password = req.body.password;
    const oldPassword = req.body.oldPassword;
  
    const areas = await Areas.find();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("../Admin/views/pages/Users/editUser", {
        path: "/Users/addUser",
        pageTitle: "Add User",
        flashMessage: errors.array()[0].msg,
        areas: areas,
        user: {
          id: userId,
          name: name,
          contact: contact,
          CNIC: cnic,
          location: city,
          address: address,
          access: access,
          email: email,
          password: password,
        },
        validationErrors: errors.array(),
      });
    }
  
    let salt=null;
    let hashedPassword=null;
    if (password.length > 0) {
  
      // generate salt to hash password
      salt = await bcrypt.genSalt(5);
      // now we set user password to hashed password
      hashedPassword = await bcrypt.hash(password, salt);
  
    }else{
  
      hashedPassword = oldPassword;
  
    }
  
    try {
      const user = await Users.findById(userId);
      user.name = name;
      user.contact = contact;
      user.CNIC = cnic;
      user.location = city;
      user.address = address;
      user.access = access;
      user.email = email;
      user.password = hashedPassword;
      await user.save();
      console.log("UPDATED User!");
      req.flash("message", "User Updated Successfully");
      res.redirect("/admin");
    } catch (err) {
      console.log(err);
      res.status(422).render("../Admin/views/pages/Users/editUser", {
        flashMessage: 'Something went wrong.',
        areas: areas,
        user: {
          id: userId,
          name: name,
          contact: contact,
          CNIC: cnic,
          location: city,
          address: address,
          access: access,
          email: email,
          password: password,
        },
        validationErrors: errors.array(),
      });
    }
  };
  
  const postDeleteUser = (req, res) => {
    const userId = req.body.id;
    Users.findByIdAndDelete(userId)
      .then(() => {
        console.log("Deleted user");
        res.sendStatus(200);
      })
      .catch((err) => res.sendStatus(204));
  };
  
  module.exports = {
    // Login
    login,
    postLogin,
    logout,
  
    // Dashboard
    indexView,

    // Customers
    customersList,
    viewCustomer,
    editMembership,
    delCustomer,
    
    // Bundles and Offers
    addBundle,
    bundleList,
  
    // Slider Images
    addImagesSlider,
    sliderImages,
    postAddSliderImages,
    postDeleteSliderGalleryImage,
  
    // Customer Feedback
    feedback,
    viewFeedbackQuery,
  
    //Messages
    msgList,
    viewMessage,
  
    // Users
    addUser,
    userList,
    editUser,
    postAddUser,
    postEditUser,
    postDeleteUser,
  };
  