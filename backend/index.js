const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
// const _ = require('lodash');

const passport = require('passport');
const passportJWT = require('passport-jwt');

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'wowwow';

// lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  let user = getUser({ id: jwt_payload.id });

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});
// use the strategy
passport.use(strategy);

const app = express();
// initialize passport with express
app.use(passport.initialize());

// parse application/json
app.use(bodyParser.json());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  next();
});
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// initialze an instance of Sequelize
const sequelize = new Sequelize({
  database: 'employee',
  username: 'root',
  password: '',
  dialect: 'mysql'
});

// check the databse connection
sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// create user model
const User = sequelize.define('user', {
  email: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING,
  },
});

// create table with user model
User.sync()
  .then(() => console.log('User table created successfully'))
  .catch(err => console.log('oooh, did you enter wrong database credentials?'));

// create some helper functions to work on the database
const createUser = async ({ email }) => {
  status = 'Working';
  return await User.create({ email, status });
};

const getAllUsers = async () => {
  return await User.findAll();
};

const getUser = async obj => {
  return await User.findOne({
    where: obj,
  });
};

const updateStatus = async ({ email, status }) => {
  return await User.update(
    { status: status},
    { where: { email: email } }
  );
}

const getEmployees = async ({ email, status }) => {
  if (status==""){
    return await User.findAll(
      { 
        where: { 
          email: { 
            [Op.like]: '%'+email+'%' 
          }
        } 
      }
    );
  }
  return await User.findAll(
    { 
      where: { 
        email: { 
          [Op.like]: '%'+email+'%' 
        }, 
        status: status 
      } 
    }
  );
}

// set some basic routes
app.get('/', function(req, res) {
  res.json({ message: 'Express is up!' });
});

// get all users
app.get('/users', function(req, res) {
  getAllUsers().then(user => res.json(user));
});

// register route
app.post('/register', function(req, res, next) {
  const { email } = req.body;
  createUser({ email }).then(user =>
    res.json({ user, msg: 'account created successfully' })
  );
});

//login route
app.post('/login', async function(req, res, next) {
  const { email } = req.body;
  if (email) {
    let user = await getUser({ email: email });
    if (!user) {
      let user = await createUser({ email: email });
      let payload = { email: user.email, status: user.status };
      let token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: 3600 });
      res.json({ token: 'Bearer ' + token });
    }
    if (user.email === email) {
      let payload = { email: user.email, status: user.status };
      let token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: 3600 });
      res.json({ token: 'Bearer ' + token });
    } else {
      res.status(401).json({ msg: 'email is incorrect' });
    }
  }
});

// get status
app.post('/getStatus', passport.authenticate('jwt', { session: false }), async function(req, res, next) {
  const { email } = req.body;
  let user = await getUser({ email: email });
  if (!user) {
    res.status(401).json({ message: 'No such user found' });
  }else{
    res.json({ status: user.status});
  }

});

// update status
app.post('/updateStatus', passport.authenticate('jwt', { session: false }), async function(req, res, next) {
  const { email, status } = req.body;
  updateStatus({ email: email, status: status }).then(response =>
    res.json({ status: status})
  );
});

// get employees
app.post('/getEmployee', async function(req, res, next) {
  const { email, status } = req.body;
  getEmployees({ email: email, status: status }).then(response =>
    res.json({ employees: response})
  );
});

// start app
app.listen(5000, function() {
  console.log('Express is running on port 5000');
});
