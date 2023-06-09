const controller = require("../controllers/user.controller");
const { JWT } = require("../middlewares");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/auth/signup", controller.signup);

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/profile", [JWT.verifyToken], controller.profile);

  app.post("/api/auth/signout", controller.signout);

  app.post("/api/auth/comments", controller.comments);

  app.post("/api/auth/favs", controller.favs);
};
