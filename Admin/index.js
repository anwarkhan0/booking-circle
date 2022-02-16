require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const homeRoutes = require('./routes/home-routes')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();
const store = new MongoDBStore({
  uri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xjk47.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  collection: 'sessions'
});
const port = 3000;

// configuring of file destination and name
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/');
  },
  filename: (req, file, cb) => {
    let date = new Date().toISOString().replaceAll(":", "-");
    cb(null, date + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array('images', 12)
);
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(cookieParser('SecretStringForCookies'));
app.use(session({
  secret: 'SecretStringForCookies',
  cookie: {maxAge: 86400000},
  resave: false,
  saveUninitialized: false,
  store: store
}));
app.use(flash());

app.set("layout login", false);

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, './public')));
app.use('images', express.static(path.join(__dirname, './public/images')));

app.use(homeRoutes.routes)

app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(...);
  res.render('./pages/Errors/error', { desc: error});
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xjk47.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
  )
  .then(result => {
    app.listen(port, () => console.log(`App listening on Port: ${port}`));
  })
  .catch(err => {
    console.log(err);
  });
