const { validationResult } = require("express-validator");

//models
const Areas = require("../../models/Location");

const addArea = (req, res, next) => {
  const message = req.flash("message");
  res.render("../Admin/views/pages/Areas/addAreas", { name: "", flashMessage: message });
};

const listAreas = (req, res, next) => {
  const message = req.flash("message");
  Areas.find()
    .then((areas) => {
      res.render("../Admin/views/pages/Areas/areaList", {
        areas: areas,
        pageTitle: "Areas List",
        path: "/Areas/area-list",
        flashMessage: message,
      });
    })
    .catch((err) => console.log(err));
};

const editArea = (req, res, next) => {
  const areaId = req.params.id;
  Areas.findById(areaId)
    .then((area) => {
      if (!area) {
        return res.render("../Admin/views/pages/Errors/error", {
          desc: "The recored does't exist",
        });
      }
      res.render("../Admin/views/pages/Areas/editArea", {
        layout: '../Admin/views/layout',
        pageTitle: "Edit Area",
        path: "/admin/edit-area",
        area: area,
        flashMessage: req.flash("message"),
      });
    })
    .catch((err) => res.render("../Admin/views/pages/Errors/error"));
};

const postAddArea = (req, res, next) => {
  const name = req.body.areaName;
  const area = new Areas({
    name: name,
  });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("../Admin/views/pages/Areas/addAreas", {
      flashMessage: errors.array()[0].msg,
      name: name,
      validationErrors: errors.array(),
    });
  }

  area
    .save()
    .then((result) => {
      // console.log(result);
      console.log("Added Area");
      req.flash("message", "Location Added Successfully");
      res.redirect("/admin");
    })
    .catch((err) => {
      console.log(err);
      return res.status(422).render("../Admin/views/pages/Areas/addAreas", {
        flashMessage: "Something went Wrong, please try again.",
        name: name,
      });
    });
};

const postEditArea = (req, res, next) => {
  const areaId = req.body.areaId;
  const updatedName = req.body.areaName;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("../Admin/views/pages/Areas/editArea", {
      flashMessage: errors.array()[0].msg,
      area: {
        id: areaId,
        name: updatedName,
      },
      validationErrors: errors.array(),
    });
  }

  Areas.findById(areaId)
    .then((area) => {
      area.name = updatedName;
      return area.save();
    })
    .then((result) => {
      console.log("UPDATED Area!");
      req.flash("message", "Location Updated");
      res.redirect("/admin/Areas/areaList");
    })
    .catch((err) => {
      console.log(err);
      return res.status(422).render("../Admin/views/pages/Areas/edit+Area", {
        flashMessage: "Something went wrong, please try again.",
        area: {
          id: areaId,
          name: updatedName,
        },
      });
    });
};

const postDeleteArea = (req, res) => {
  const areaId = req.body.id;

  Areas.findByIdAndDelete(areaId)
    .then(() => {
      console.log("Deleted location");
      res.sendStatus(200);
    })
    .catch((err) => res.sendStatus(204));
};

module.exports = {
    addArea,
  listAreas,
  editArea,
  postAddArea,
  postEditArea,
  postDeleteArea
}