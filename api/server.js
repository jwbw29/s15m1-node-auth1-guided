const path = require("path");
const express = require("express");
const session = require("express-session");
const Store = require("connect-session-knex")(session); //capitalized because it's a constructor function. This now gives us access to storing our sessions in the database
const authRouter = require("./auth/auth-router.js");
const usersRouter = require("./users/users-router.js");

const server = express();

server.use(express.static(path.join(__dirname, "../client")));
server.use(express.json());
server.use(
  session({
    name: "monkey",
    secret: "keep it secret",
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false, // true in production (if true, the cookie would only work on https),
      httpOnly: false, // true means JS can't access the cookie
    },
    resave: false,
    saveUninitialized: false, // GDPR laws against setting cookies automatically -- client must approve
    store: new Store({
      // this is how we store sessions in the database
      knex: require("../database/db-config.js"),
      tablename: "sessions",
      sidfieldname: "sid",
      createtable: true,
      clearInterval: 1000 * 60 * 60, // deletes expired sessions every hour
    }),
  })
);

server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

server.use("*", (req, res, next) => {
  next({ status: 404, message: "not found!" });
});

server.use((err, req, res, next) => {
  // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
