const db = require("../models");

const User = db.user;
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
          res.send({ success: false, message: err });
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
    return
    }).catch((err)=>{
        if (err) {
            res.send({ success: false, message: err });
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
  return
  }).catch((err)=>{
      if (err) {
          res.send({ success: false, message: err });
          return;
      }
  });

};


exports.isFav = (req, res) => {
  if(!req.body.colorId){
    res.send({ success: false, message: "Please enter a color id" })
    return
  }

  Saved.findOne({colorId: req.body.colorId, savedBy: req.userId}).then((data) => {
    if(data){
      res.send({ success: true, isFav: true})
      return
    } else {
      res.send({ success: true, isFav: false})
      return
    }

  });
};


exports.removeFav = (req, res) => {
  if(!req.body.colorId){
    res.send({ success: false, message: "Please enter a color id" })
    return
  }

  Saved.findOne({colorId: req.body.colorId, savedBy: req.userId}).then((data) => {
    if(data){

      Saved.deleteOne({
        colorId: req.body.colorId,
        savedBy: req.userId
      }).then((data) => {

        res.send({ success: false, isFav: false })
        return

      }).catch((err)=>{
          if (err) {
              res.send({ success: false, message: err });
              return;
          }
      });
      
    } else {
      res.send({ success: false, isFav: false })
      return
    }

    

  });
};

exports.getComments = async (req, res) => {
  if(!req.body.colorId){
    res.send({ success: false, message: "Please enter a color id" })
    return
  }

  let comments = await Comments.aggregate([ { 
    $match : { colorId : req.body.colorId } 
  },
  { $addFields: { "userId": { "$toObjectId": "$commentedBy" }}},
  {
    $lookup: {
      from: User.collection.name,
      localField: "userId",
      foreignField: "_id",
      as: "commentedBy"
    }
  },
  {
    $project: {
      "commentedBy.password": 0,
    }
  },
  {
    $unwind: "$commentedBy"
  }
])

  if(comments){
    res.send({ success: true, data: comments})
    return
  } else {
    res.send({ success: false, data: null})
    return
  }

  /*
  Comments.find({colorId: req.body.colorId }).then((data) => {
    if(data){
      res.send({ success: true, data: data})
      return
    } else {
      res.send({ success: false})
      return
    }

  });
  */
};