const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const { getUserByUsername, addUser } = require("../users/users-models");

router.post('/login', [validateBodyMW, findUserMW], (req, res) => {
  const credentials = req.body;
  const user = res.user
  if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
    res.status(401).json('Incorrect credentials.');
  } else {
    req.session.name = user.username;
    res.status(200).json(`${user.username} logged in.`);
  }
});

router.post('/register', [validateBodyMW, checkExistingUserMW], (req, res) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;
  addUser(credentials)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(`Error adding user to database.`);
    })
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(500).json(`Error logging out.`)
      } else {
        res.status(200).json(`User logged out.`);
      }
    })
  } else {
    res.json(`User was not logged in.`);
  }
});


//middleware
function findUserMW(req, res, next) {
  getUserByUsername(req.body.username)
    .then(data => {
      if (data.length > 0) {
        res.user = data[0];
        next();
      }
      else {
        res.status(404).json(`User not found.`)
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(`Error finding user.`)
    })
}

function checkExistingUserMW(req, res, next) {
  getUserByUsername(req.body.username)
    .then(data => {
      if (data.length > 0) {
        res.status(404).json(`Username already taken.`)
      }
      else {
        next();
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(`Error checking if user already exists.`)
    })
}

function validateBodyMW(req, res, next) {
  if (!req.body.password || !req.body.username) {
    res.status(500).json(`Request must include username and password.`);
  } else {
    next();
  }
}
module.exports = router;
