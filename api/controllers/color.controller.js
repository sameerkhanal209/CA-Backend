const db = require("../models");

const Color = db.color;
const Saved = db.saved;
const Comments = db.comments;

exports.get = (req, res) => {

  if(!req.body.colorId){
    res.send({ success: false, message: "Please enter a color id" })
    return
  }

  Color.findOneAndUpdate({colorId: req.body.colorId},
  {
    $inc: { views: 1 }
  },
  {
    upsert: true
  }).then((data) => {
  res.send({ success: true, message: "Color viewed successfully!", data: data });
  }).catch((err)=>{
      if (err) {
          res.status(500).send({ success: false, message: err });
          return;
      }
  });
};

exports.save = (req, res) => {
  if(!req.body.colorId){
    res.send({ success: false, message: "Please enter a color id" })
    return
  }

  Saved.findOne({colorId: req.body.colorId, savedBy: req.userId}).then((data) => {
    if(data){
      res.send({ success: false, message: "Color already saved!" })
      return
    }

    Saved.create({
      colorId: req.body.colorId,
      savedBy: req.userId
    }).then((data) => {
    res.send({ success: true, message: "Color saved successfully!", data: data });
    }).catch((err)=>{
        if (err) {
            res.status(500).send({ success: false, message: err });
            return;
        }
    });

  });
};


exports.comment = (req, res) => {

  if(!req.body.colorId){
    res.send({ success: false, message: "Please enter a color id" })
    return
  }

  if(!req.body.comment){
    res.send({ success: false, message: "Please enter a comment" })
    return
  }

  Comments.create({
    colorId: req.body.colorId,
    commentedBy: req.userId,
    comment: req.body.comment
  }).then((data) => {
  res.send({ success: true, message: "Commented in the color successfully!", data: data });
  }).catch((err)=>{
      if (err) {
          res.status(500).send({ success: false, message: err });
          return;
      }
  });

};