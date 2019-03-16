const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');

const {port} = require('./config/keys');

const app = express();

// Connect to local mongoDB
mongoose.connect('mongodb://localhost:27017/oauth2', {useNewUrlParser: true})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Request Body Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Session Middleware
app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: 'secret'
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Load Passport config
require('./config/passport')(passport);

// Handlebars Template Engine Configuration
app.set('views', path.join(__dirname, '/views'));
app.engine('hbs', hbs({
    extname: 'hbs',
    layoutsDir: path.join(__dirname, '/views/layouts'),
    defaultLayout: 'main'
}));
app.set('view engine', 'hbs');

// Load Routes
const userRouter = require('./routes/users');
const clientRouter = require('./routes/clients');
const oauthRouter = require('./routes/auth');

// User Router
app.use('/api/users', userRouter);
app.use('/api/clients', clientRouter);
app.use('/auth', oauthRouter);

app.listen(port, () => console.log(`Server started on port: ${port}`));
