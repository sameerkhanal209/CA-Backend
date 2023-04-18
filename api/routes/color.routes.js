const controller = require("../controllers/color.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/color/add", controller.add);
  app.get("/api/color/get", controller.get);

};
