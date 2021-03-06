const express = require('express'),
        app = express(),
        expressLayouts = require('express-ejs-layouts'),
        mongoose = require('mongoose'),
        flash = require('connect-flash'),
        session = require('express-session')
        passport = require('passport')
        methodOverride = require('method-override')
        compression = require('compression'),
        helmet = require('helmet');

//passport config
require('./config/passport')(passport);

//Database
mongoose.connect('mongodb://localhost:27017/login-system',{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to mongoDB'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;


//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//bodyparser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));
//passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

// connect flash
app.use(flash());

//global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error_msg_basketPhone = req.flash('error_msg_basketPhone');
    res.locals.error_msg_basketPerson = req.flash('error_msg_basketPerson');
    res.locals.error = req.flash('error');
    next();
})
//Static Routes
app.use('/pictures',express.static('public/house_pictures'));
app.use('/',express.static('public/house_pictures'));
app.use('/',express.static('public/'));
app.use('/pictures',express.static('public'));
app.use('/contact',express.static('public'));

//Routes



app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/lounge', require('./routes/lounge'));
app.use('/me', require('./routes/me'));
app.use('/me/admin', require('./routes/admin'));
app.use('/book', require('./routes/book'));
app.use('/pictures', require('./routes/pictures'));
app.use('/contact', require('./routes/contact'));

app.use(helmet());
app.use(compression());
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}...`));



