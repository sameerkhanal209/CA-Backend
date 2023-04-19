const jwt = require("jsonwebtoken");
const config = require("../config/db.config.js");

verifyToken = (req, res, next) => {
  let token = req.session.token || req.body.token;

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken
};
module.exports = authJwt;
