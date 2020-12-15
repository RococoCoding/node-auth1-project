const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const server = express();
const session = require('express-session');
const usersRouter = require("./api/users/users-router");
const authRouter = require("./api/auth/auth-router");
const KnexSessionStore = require("connect-session-knex")(session)

const config = {
  name: 'sessionId', 
  secret: "It's a lovely day in the village, and you are a horrible goose.",
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000, //1 day
    secure: false, //change to true in production 
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false, 
  store: new KnexSessionStore({
    knex: require("./data/dbconfig.js"), // configured instance of knex
    tablename: "sessions", // table that will store sessions inside the db, name it anything you want
    sidfieldname: "sid", // column that will hold the session id, name it anything you want
    createtable: true, // if the table does not exist, it will create it automatically
    clearInterval: 1000 * 60 * 60, // time it takes to check for old sessions and remove them from the database to keep it clean and performant
  })
}

server.use(express.json());
server.use(helmet());
server.use(cors());
server.use(session(config));

//routers
server.use('/api/', authRouter);
server.use('/api/users', protected, usersRouter);

//middleware
function protected(req, res, next) {
  if (req.session && req.session.name) {
    next();
  } else {
    res.status(401).json({ message: 'User is not authorized.' });
  }
}
server.listen(5000, () => {
  console.log(`server up on 5000`);
});