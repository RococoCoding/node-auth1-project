const db = require("./data/dbconfig");

module.exports = {
  getAllUsers,
  getUserByUsername,
  addUser,
  updateUser
}


function getUserByUsername(username) {
  return db('users')
    .where({username});
}

function updateUser(username, logged) {
  return db('users')
    .where({username})
    .update(logged)
    .then(data => {
      return Promise.resolve(data);
    })
}

function getAllUsers() {
  return db('users');
}

function addUser(body) {
  return db('users')
    .insert(body);
}