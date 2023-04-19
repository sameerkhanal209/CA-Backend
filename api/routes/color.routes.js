const controller = require("../controllers/color.controller");
const { JWT } = require("../middlewares");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/color/save", [JWT.verifyToken], controller.save);
  app.post("/api/color/get", controller.get);
  app.post("/api/color/comment", [JWT.verifyToken], controller.comment);

};
