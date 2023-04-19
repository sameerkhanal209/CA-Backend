const config = require("../config/db.config");
const db = require("../models");

const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {

    if(!req.body.username){
        res.send({ success: false, message: "Please enter an username" })
        return
    }

    if(req.body.username.length < 4 && req.body.username.length > 20){
        res.send({ success: false, message: "Username should be greater than 4 and less than 20." })
        return
    }

    if(!req.body.email){
        res.send({ success: false, message: "Please enter a email" })
        return
    }

    if(!req.body.password){
        res.send({ success: false, message: "Please enter a password" })
        return
    }

    if(req.body.password < 8){
        res.send({ success: false, message: "Password should be greater than 8." })
        return
    }

    if(req.body.password !== req.body.confirm_password){
        res.send({ success: false, message: "Password and confirm password doesnot match" })
        return
    }

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save().then((data) => {

    var token = jwt.sign({ id: data._id }, config.SECRET, {
      expiresIn: 86400, // 24 hours
    });

    res.send({ success: true, message: "User registered successfully!", data: data, token: token });

  }).catch((err)=>{
        if (err) {
            res.status(500).send({ success: false, message: err });
            return;
        }
    });
};

exports.signin = (req, res) => {

    if(!req.body.username){
        res.send({ success: false, message: "Please enter an username" })
        return
    }

    if(!req.body.password){
        res.send({ success: false, message: "Please enter a password" })
        return
    }

  User.findOne({
    username: req.body.username,
  }).then((user) => {

      if (!user) {
        return res.status(404).send({ success: false, message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ success: false, message: "Invalid Password!" });
      }

      var token = jwt.sign({ id: user.id }, config.SECRET, {
        expiresIn: 86400, // 24 hours
      });

      res.status(200).send({
        success: true,
        id: user._id,
        username: user.username,
        email: user.email,
        token: token
      });
      
    }).catch((err)=>{
        if (err) {
            res.status(500).send({ success: false, message: err });
            return;
          }
    });
};

exports.profile = (req, res) => {

  User.findOne({_id: req.userId}).select(['-password', '-_id']).then((data) => {
    if(data){
      res.send({ success: true, data: data });
      return
    }
  });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};
