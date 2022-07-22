const { delImg, delMultImages } = require("../../util/file");
const { validationResult } = require("express-validator");

//models
const Updates = require("../../models/Updates");

const addUpdates = async (req, res, next) => {
    try{
      const blogNo = await Updates.countDocuments({}).exec();
      res.render("../Admin/views/pages/Updates/addUpdates", {
        user: req.session.user,
        flashMessage: req.flash("message"),
        oldInput: {
          blogNo: blogNo + 1,
          heading: "",
          author: "",
          date: "",
          media: "",
          description: "",
        },
      });
    } catch(err){
      console.log(err)
    }
  };
  
  const updateList = (req, res, next) => {
    Updates.find()
      .then((updates) => {
        res.render("../Admin/views/pages/Updates/updateList", {
          user: req.session.user,
          updates: updates,
          pageTitle: "Updates List",
          path: "/Updates/update-list",
        });
      })
      .catch((err) => console.log(err));
  };
  
  const editBlog = (req, res, next) => {
    const id = req.params.id;
    Updates.findById(id)
      .then((update) => {
        if (!update) {
          console.log("no update found");
          return res.redirect("/");
        }
        res.render("../Admin/views/pages/Updates/editUpdate", {
          user: req.session.user,
          flashMessage: req.flash('message'),
          update: update,
        });
      })
      .catch((err) => console.log(err));
  };
  
  const deleteBlog = (req, res, next) => {
    res.render("../Admin/views/pages/Updates/deleteBlog");
  };
  
  const postAddUpdate = async (req, res) => {
    const blogNo = req.body.blogNo;
    const heading = req.body.heading;
    const author = req.body.author;
    const date = new Date();
    const desc = req.body.desc;
    const uploads = req.files;
  
    try {
      const media = uploads[0].filename;
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).render("../views/pages/Updates/addUpdates", {
          user: req.session.user,
          path: "/Updates/addUpdate",
          pageTitle: "Updates",
          flashMessage: errors.array()[0].msg,
          oldInput: {
            blogNo: blogNo,
            heading: heading,
            author: author,
            date: date,
            media: media,
            description: desc,
          },
          validationErrors: errors.array(),
        });
      }
  
      const update = new Updates({
        blogNo: blogNo,
        heading: heading,
        author: author,
        date: date,
        media: media,
        description: desc,
      });
  
      await update.save();
      console.log("Added update");
      req.flash("message", "News Update added successfully.");
      res.redirect("/admin");
    } catch (err) {
      console.log(err);
      res.render("../views/pages/Updates/addUpdates", {
        user: req.session.user,
        path: "/Updates/addUpdate",
        pageTitle: "Updates",
        flashMessage: "Something went wrong, please try again.",
        oldInput: {
          blogNo: blogNo,
          heading: heading,
          author: author,
          date: date,
          media: media,
          description: desc,
        },
        validationErrors: errors.array(),
      });
    }
  };
  
  const postEditUpdate = (req, res) => {
  
    const id = req.body.id;
    blogNo = req.body.blogNo;
    const heading = req.body.heading;
    const author = req.body.author;
    const date = new Date();
    const oldImage = req.body.oldImage;
    let media;
    const desc = req.body.desc;
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
  
      return res.status(422).render("../views/pages/Updates/editUpdate", {
        user: req.session.user,
        path: "/Updates/editUpdate",
        pageTitle: "Updates",
        flashMessage: errors.array()[0].msg,
        update: {
          id: id,
          blogNo: blogNo,
          heading: heading,
          author: author,
          date: date,
          media: media,
          description: desc,
        },
        validationErrors: errors.array(),
      });
    }
  
  
    const uploads = req.files;
  
    Updates.findById(id)
      .then((update) => {
  
        if (uploads.length === 0) {
          media = oldImage;
        } else {
  
          if(delImg(oldImage)){
            media = uploads[0].filename;
          }else{
            throw 'Something went wrong while deleting the old file.';
          }
          
        }
        update.heading = heading;
        update.author = author;
        update.date = date;
        update.media = media;
        update.description = desc;
        return update.save();
      })
      .then((result) => {
        console.log("Updated updates");
        res.redirect("/admin/Updates/updateList");
      })
      .catch((err) => {
        console.log(err);
        res.redirect('/admin');
      });
  };
  
  const postDeleteUpdate = async (req, res) => {
    const updateId = req.body.id;
    try {
      const update = await Updates.findById(updateId);
      await Updates.findByIdAndDelete(updateId);
      const mediaFile = update.media;
      if(delImg(mediaFile)){
        console.log("update deleted");
        res.sendStatus(200);
      }else{
        throw 'Something went wrong while deleting files associated with the update.';
      }
      
    } catch (err) {
      console.log(err);
      res.sendStatus(204);
    }
  };

  module.exports = {
    addUpdates,
    updateList,
    editBlog,
    deleteBlog,
    postAddUpdate,
    postEditUpdate,
    postDeleteUpdate
  }