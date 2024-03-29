require('dotenv').config()
const express = require('express')
const cors = require('cors')
const expressLayouts = require('express-ejs-layouts')
const path = require('path')
const bodyParser = require('body-parser')
const adminRoutes = require('./routes/adminRoutes')
const homeRoutes = require('./routes/home-routes')
const multer = require('multer')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const MongoDBStore = require('connect-mongodb-session')(session)
const compression = require('compression')
const app = express()
app.use(cors())
app.use(compression())

// cloud
const store = new MongoDBStore({
  uri: process.env.MONGO_ATLUS,
  collection: 'sessions',
})

// local db
// const store = new MongoDBStore({
//   uri: process.env.MONGO,
//   collection: 'sessions'
// });

// configuring of file destination and name
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, './files/uploads/'))
  },
  filename: (req, file, cb) => {
    let date = new Date().toISOString().replaceAll(':', '-')
    cb(null, date + '-' + file.originalname)
  },
})

const blogImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, './files/uploads/blogImages/'))
  },
  filename: (req, file, cb) => {
    let date = new Date().toISOString().replaceAll(':', '-')
    cb(null, date + '-' + file.originalname)
  },
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.raw())

//file uploading
app.use(
  '/uploadBlogImage',
  multer({ storage: blogImageStorage, fileFilter: fileFilter }).single('image'),
  (req, res) => {
    res.json({
      location: '/uploads/blogImages/' + req.file.filename,
    })
  }
)
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array('images', 12)
)

//cookie config
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    cookie: { maxAge: 1800000 },
    resave: false,
    saveUninitialized: false,
    store: store,
  })
)
app.use(flash())

app.use(expressLayouts)
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, './files')))
app.use('/admin', express.static(path.join(__dirname, './files/admin/')))

app.use((req, res, next) => {
  app.set('layout', path.join(__dirname, './views/layout'))
  next()
})
app.use(homeRoutes.routes)
app.use('/admin/*', (req, res, next) => {
  app.use(
    '/tinymce',
    express.static(path.join(__dirname, 'node_modules', 'tinymce'))
  )
  app.set('layout', path.join(__dirname, './Admin/views/layout'))
  next()
})
app.use(adminRoutes.routes)

const port = process.env.PORT || 8080

//Cloud Database
mongoose
  .connect(
    process.env.MONGO_ATLUS
  )
  .then(result => {
    app.listen(port, () => console.log(`App listening on Port: ${port}`))
  })
  .catch(err => {
    console.log(err)
  })

// LOCALHOST:DATABASE/////////////
// mongoose
// .connect(
//   process.env.MONGO
// )
// .then(result => {
//   app.listen(port, () => console.log(`App listening on Port: ${port}`));
// })
// .catch(err => {
//   console.log(err);
// });

// const cron = require('node-cron');

// cron.schedule('* * * * *', () => {
//   console.log('running a task every minute');
// });


  // const admins = require('./models/AppData');
  // const bcrypt = require('bcrypt');

  // admins.find(users => {
  //   if (!users) {

  //     bcrypt.genSalt(16, function (err, salt) {
  //       bcrypt.hash('password', salt, function (err, hash) {
  //         const user = new admins({
  //           name: 'hasnain',
  //           contact: 123,
  //           CNIC: 123,
  //           location: 'city',
  //           address: 'address',
  //           role: 0,
  //           email: 'admin@admin.com',
  //           password: hash,
  //         })
  //         user.save()
  //       });
  //     });


  //   }
  // }).catch(err => console.log(err))

