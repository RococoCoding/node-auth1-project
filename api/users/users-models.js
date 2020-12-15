const db = require("../../data/dbconfig");

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUsername,
  addUser
}

function getUserById(id) {
  return db('users')
    .where({id});
}

function getUserByUsername(username) {
  return db('users')
    .where({username});
}

function getAllUsers() {
  return db('users');
}

function addUser(body) {
  return db('users')
    .insert(body)
    .then(id => {
      return getUserById(id)
        .select('username', 'id') // don't send back password!
    })
}