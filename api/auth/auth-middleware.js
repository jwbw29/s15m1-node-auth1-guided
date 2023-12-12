async function protect(req, res, next) {
  // check the session id of the request and see if it matches a live session on the server
  if (req.session.user) {
    next();
  } else {
    next({ status: 401, message: "You shall not pass!" });
  }
}

module.exports = { protect };
