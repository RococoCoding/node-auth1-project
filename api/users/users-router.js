const express = require("express");
const router = express();
const { getAllUsers } = require("./users-models");


router.get('/', (req, res) => {
  getAllUsers()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(`Error getting users.`);
    })
});

module.exports = router;