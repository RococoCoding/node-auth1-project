const express = require("express");
const server = express();
const bcrypt = require('bcryptjs');
const session = require('express-session');
// const router = express.Router();
const { addUser, getAllUsers, getUserByUsername, updateUser } = require("./models");
server.use(express.json());
server.use(
  session({
    name: 'notsession', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
      secure: false, //only set cookies over https. do not send back a cookie over http. 
      httpOnly: true,
    },
    // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false, //saves session even if session is not modified
    saveUninitialized: false, //don't save until they've accept cookies
  })
)
server.use('/api/users', protected);

server.get('/api/login', (req, res) => {
  const credentials = req.body;
  getUserByUsername(req.body.username)
    .then(data => {
      if (data.length > 0) {
        if (!bcrypt.compareSync(credentials.password, data[0].password)) {
          return res.status(401).json({ error: 'Incorrect credentials' });
        } else {
          req.session.name = data[0].username;
          const logged = {logged_in: true}
          updateHelper(data[0].username, logged);
          res.status(200).json(req.session.name)
        }
      } else {
        res.status(404).json(`User not found.`)
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(`Error logging in.`)
    })
});
server.post('/api/register', (req, res) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;
  addUser(credentials)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(`Error add user to database.`);
    })
});
server.put('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(500).json(`Error logging out.`)
    } else {
      res.status(200).json(`User logged out.`);
    }
  })
});

server.get('/api/users', (req, res) => {
  getAllUsers()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(`Error getting users.`);
    })
});

function updateHelper(username, logged) {
  updateUser(username, logged);
}

function protected(req, res, next) {
  console.log(req.session)
  if (req.session && req.session.name) {
    next();
  } else {
    res.status(401).json({ message: 'you shall not pass!!' });
  }
}
server.listen(5000, () => {
  console.log(`server up on 5000`);
});